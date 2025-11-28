import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { GameState, TraitId } from '../types/game';
import { createInitialState, canAffordBuilding, canAffordUpgrade, applyTraitModifiersToCost, checkAchievements, calculateClickPower } from '../game/logic';
import { getBuildingCost } from '../game/buildings';
import { loadGameSave, saveGameState, collapseUniverse as collapseUniverseApi } from '../lib/api';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface GameContextType {
  state: GameState;
  user: User | null;
  clickForge: () => void;
  buyBuilding: (buildingId: string) => void;
  buyUpgrade: (upgradeId: string) => void;
  buyMetaUpgrade: (upgradeId: string) => void;
  collapseUniverse: () => Promise<void>;
  selectTraits: (traitIds: TraitId[]) => void;
  claimDailyTask: (taskId: string) => void;
  completeTutorialStep: (step: string) => void;
  dismissTutorial: () => void;
  claimOfflineGains: () => void;
  saveGame: () => Promise<void>;
  isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'timeforge_save';
const AUTO_SAVE_INTERVAL = 10000;

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(createInitialState());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<number>();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      loadGame(user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((async (event, session) => {
      (async () => {
        setUser(session?.user || null);
        if (event === 'SIGNED_IN' && session?.user) {
          await loadGame(session.user);
        } else if (event === 'SIGNED_OUT') {
          const localSave = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (localSave) {
            try {
              const parsed = JSON.parse(localSave);
              setState(parsed);
            } catch (e) {
              setState(createInitialState());
            }
          } else {
            setState(createInitialState());
          }
        }
      })();
    }));

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadGame = async (currentUser: User | null) => {
    setIsLoading(true);

    let loadedState: GameState | null = null;

    if (currentUser) {
      loadedState = await loadGameSave();
    }

    if (!loadedState) {
      const localSave = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localSave) {
        try {
          loadedState = JSON.parse(localSave);
        } catch (e) {
          console.error('Failed to parse local save');
        }
      }
    }

    if (loadedState) {
      loadedState.lastTickTime = new Date().toISOString();
      setState(loadedState);
    } else {
      setState(createInitialState());
    }

    setIsLoading(false);
  };

  const saveGame = useCallback(async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));

    if (user) {
      await saveGameState(state);
    }
  }, [state, user]);

  useEffect(() => {
    if (!isLoading) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = window.setTimeout(() => {
        saveGame();
      }, AUTO_SAVE_INTERVAL);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state, isLoading, saveGame]);

  const clickForge = useCallback(() => {
    setState((prev) => {
      const clickPower = calculateClickPower(prev);
      const newState = {
        ...prev,
        sparks: prev.sparks + clickPower,
        totalSparksEarned: prev.totalSparksEarned + clickPower,
        totalClicks: prev.totalClicks + 1,
      };
      return checkAchievements(newState);
    });
  }, []);

  const buyBuilding = useCallback((buildingId: string) => {
    setState((prev) => {
      const building = prev.buildings[buildingId];
      if (!building) return prev;

      const cost = applyTraitModifiersToCost(
        getBuildingCost(building),
        'building',
        prev
      );

      if (!canAffordBuilding(building, prev) || prev.sparks < cost) {
        return prev;
      }

      const newState = {
        ...prev,
        sparks: prev.sparks - cost,
        buildings: {
          ...prev.buildings,
          [buildingId]: {
            ...building,
            count: building.count + 1,
          },
        },
      };

      return checkAchievements(newState);
    });
  }, []);

  const buyUpgrade = useCallback((upgradeId: string) => {
    setState((prev) => {
      const upgrade = prev.upgrades[upgradeId];
      if (!upgrade || upgrade.purchased) return prev;

      if (upgrade.prerequisite && !upgrade.prerequisite(prev)) {
        return prev;
      }

      const cost = applyTraitModifiersToCost(upgrade.cost, 'upgrade', prev);

      if (!canAffordUpgrade(upgrade, prev)) {
        return prev;
      }

      const currencyKey = upgrade.costCurrency;
      if (prev[currencyKey] < cost) {
        return prev;
      }

      return {
        ...prev,
        [currencyKey]: prev[currencyKey] - cost,
        upgrades: {
          ...prev.upgrades,
          [upgradeId]: {
            ...upgrade,
            purchased: true,
          },
        },
      };
    });
  }, []);

  const selectTraits = useCallback((traitIds: TraitId[]) => {
    setState((prev) => {
      const newDiscovered = new Set(prev.discoveredTraits);
      traitIds.forEach((id) => newDiscovered.add(id));

      const newState = {
        ...prev,
        activeTraits: traitIds,
        discoveredTraits: Array.from(newDiscovered),
      };

      return checkAchievements(newState);
    });
  }, []);

  const buyMetaUpgrade = useCallback((upgradeId: string) => {
    setState((prev) => {
      const currentLevel = prev.metaUpgrades[upgradeId] || 0;
      const upgrade = require('../game/content/metaUpgrades').META_UPGRADES[upgradeId];
      if (!upgrade) return prev;

      const cost = require('../game/content/metaUpgrades').getMetaUpgradeCost(upgrade, currentLevel);
      if (prev.echoes < cost || currentLevel >= upgrade.maxLevel) return prev;

      return {
        ...prev,
        echoes: prev.echoes - cost,
        metaUpgrades: {
          ...prev.metaUpgrades,
          [upgradeId]: currentLevel + 1,
        },
      };
    });
  }, []);

  const claimDailyTask = useCallback((taskId: string) => {
    setState((prev) => {
      const taskIndex = prev.dailyTasks.findIndex((t) => t.taskId === taskId);
      if (taskIndex === -1) return prev;

      const task = prev.dailyTasks[taskIndex];
      if (!task.completed || task.claimed) return prev;

      const taskDef = require('../game/content/dailyTasks').DAILY_TASKS.find((t: any) => t.id === taskId);
      if (!taskDef) return prev;

      const newState = { ...prev };
      newState.dailyTasks = [...prev.dailyTasks];
      newState.dailyTasks[taskIndex] = { ...task, claimed: true };

      if (taskDef.reward.echoes) {
        newState.echoes += taskDef.reward.echoes;
      }
      if (taskDef.reward.sparks) {
        newState.sparks += taskDef.reward.sparks;
      }

      return newState;
    });
  }, []);

  const completeTutorialStep = useCallback((step: string) => {
    setState((prev) => ({
      ...prev,
      tutorial: {
        ...prev.tutorial,
        completedSteps: [...prev.tutorial.completedSteps, step],
        currentStep: null,
      },
    }));
  }, []);

  const dismissTutorial = useCallback(() => {
    setState((prev) => ({
      ...prev,
      tutorial: {
        ...prev.tutorial,
        dismissed: true,
        currentStep: null,
      },
    }));
  }, []);

  const claimOfflineGains = useCallback(() => {
    setState((prev) => ({
      ...prev,
      offlineGainsClaimed: true,
    }));
  }, []);

  const collapseUniverse = useCallback(async () => {
    const newState = await collapseUniverseApi(state);
    setState(checkAchievements(newState));
  }, [state]);

  const value: GameContextType = {
    state,
    user,
    clickForge,
    buyBuilding,
    buyUpgrade,
    buyMetaUpgrade,
    collapseUniverse,
    selectTraits,
    claimDailyTask,
    completeTutorialStep,
    dismissTutorial,
    claimOfflineGains,
    saveGame,
    isLoading,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
