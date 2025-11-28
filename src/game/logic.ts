import { GameState, Building, Upgrade } from '../types/game';
import { createBuildings, getBuildingProduction, getBuildingCost } from './buildings';
import { createUpgrades } from './upgrades';
import { createAchievements } from './achievements';
import { TRAITS } from './traits';
import { getRandomDailyTasks } from './content/dailyTasks';
import { applyMetaUpgrades, applyStageMultipliers } from './helpers';

export function createInitialState(): GameState {
  const now = new Date().toISOString();
  const dailyTasks = getRandomDailyTasks(3);

  return {
    version: 2,

    sparks: 0,
    flux: 0,
    civilization: 0,
    anomalies: 0,

    echoes: 0,
    totalEchoesEver: 0,
    shards: 0,

    buildings: createBuildings(),
    upgrades: createUpgrades(),
    achievements: createAchievements(),

    activeTraits: [],
    discoveredTraits: [],

    runNumber: 0,
    runStartTime: now,
    lastTickTime: now,
    lastUpdateTime: now,
    totalRunTime: 0,

    totalClicks: 0,
    totalSparksEarned: 0,
    totalFluxEarned: 0,

    currentStageId: 'primordial',
    highestStageReached: 'primordial',

    metaUpgrades: {},

    dailyTasks: dailyTasks.map((task) => ({
      taskId: task.id,
      progress: 0,
      completed: false,
      claimed: false,
    })),
    dailyTasksLastReset: now,
    dailyCollapses: 0,
    dailyRareTraitRuns: 0,
    dailyBuildingsPurchased: 0,

    tutorial: {
      completedSteps: [],
      currentStep: null,
      dismissed: false,
    },

    offlineGainsClaimed: false,

    soundOn: true,
    autoSaveEnabled: true,
  };
}

export function calculateClickPower(state: GameState): number {
  let power = 1;

  const clickUpgrades = Object.values(state.upgrades).filter(
    (u) => u.purchased && u.effect.target === 'sparks'
  );

  clickUpgrades.forEach((upgrade) => {
    if (upgrade.effect.type === 'multiplier') {
      power *= upgrade.effect.value;
    }
  });

  state.activeTraits.forEach((traitId) => {
    const trait = TRAITS[traitId];
    if (trait?.modifiers.sparkClickMultiplier) {
      power *= trait.modifiers.sparkClickMultiplier;
    }
  });

  const metaBonuses = applyMetaUpgrades(state);
  power *= metaBonuses.clickPowerMultiplier;
  power *= metaBonuses.globalProductionMultiplier;

  return power;
}

export function calculateBuildingProduction(
  building: Building,
  state: GameState
): number {
  let production = getBuildingProduction(building);

  const buildingUpgrades = Object.values(state.upgrades).filter(
    (u) =>
      u.purchased &&
      u.effect.target === 'building' &&
      u.effect.buildingId === building.id
  );

  buildingUpgrades.forEach((upgrade) => {
    if (upgrade.effect.type === 'multiplier') {
      production *= upgrade.effect.value;
    }
  });

  state.activeTraits.forEach((traitId) => {
    const trait = TRAITS[traitId];
    if (trait?.modifiers.buildingMultipliers?.[building.id]) {
      production *= trait.modifiers.buildingMultipliers[building.id];
    }
  });

  const resourceMultiplier =
    building.resourceProduced === 'flux' ? 'fluxMultiplier' : 'civilizationMultiplier';

  state.activeTraits.forEach((traitId) => {
    const trait = TRAITS[traitId];
    const multiplier = trait?.modifiers[resourceMultiplier];
    if (multiplier) {
      production *= multiplier;
    }
  });

  const globalUpgrades = Object.values(state.upgrades).filter(
    (u) =>
      u.purchased &&
      (u.effect.target === building.resourceProduced || u.effect.target === 'global')
  );

  globalUpgrades.forEach((upgrade) => {
    if (upgrade.effect.type === 'multiplier') {
      production *= upgrade.effect.value;
    }
  });

  const metaBonuses = applyMetaUpgrades(state);
  production *= metaBonuses.buildingProductionMultiplier;
  production *= metaBonuses.globalProductionMultiplier;

  if (building.resourceProduced === 'flux') {
    production *= metaBonuses.fluxMultiplier;
  } else {
    production *= metaBonuses.civilizationMultiplier;
  }

  const stageBonuses = applyStageMultipliers(state);
  if (building.resourceProduced === 'flux') {
    production *= stageBonuses.fluxMultiplier;
  } else {
    production *= stageBonuses.civilizationMultiplier;
  }

  return production;
}

export function getTotalProduction(state: GameState): {
  fluxPerSecond: number;
  civilizationPerSecond: number;
} {
  let fluxPerSecond = 0;
  let civilizationPerSecond = 0;

  Object.values(state.buildings).forEach((building) => {
    const production = calculateBuildingProduction(building, state);
    if (building.resourceProduced === 'flux') {
      fluxPerSecond += production;
    } else if (building.resourceProduced === 'civilization') {
      civilizationPerSecond += production;
    }
  });

  return { fluxPerSecond, civilizationPerSecond };
}

export function canAffordUpgrade(upgrade: Upgrade, state: GameState): boolean {
  const currency = state[upgrade.costCurrency];
  return currency >= upgrade.cost;
}

export function canAffordBuilding(building: Building, state: GameState): boolean {
  const cost = getBuildingCost(building);
  return state.sparks >= cost;
}

export function applyTraitModifiersToCost(
  baseCost: number,
  type: 'building' | 'upgrade',
  state: GameState
): number {
  let cost = baseCost;

  state.activeTraits.forEach((traitId) => {
    const trait = TRAITS[traitId];
    if (type === 'building' && trait?.modifiers.buildingCostMultiplier) {
      cost *= trait.modifiers.buildingCostMultiplier;
    }
    if (type === 'upgrade' && trait?.modifiers.upgradeCostMultiplier) {
      cost *= trait.modifiers.upgradeCostMultiplier;
    }
  });

  if (type === 'building') {
    const metaBonuses = applyMetaUpgrades(state);
    cost *= metaBonuses.buildingCostMultiplier;

    const stageBonuses = applyStageMultipliers(state);
    cost *= stageBonuses.buildingCostMultiplier;
  }

  return Math.floor(cost);
}

export function calculateEchoesFromRun(state: GameState): number {
  const totalFlux = state.totalFluxEarned;
  const totalCiv = state.civilization;
  const runTime = state.totalRunTime;

  const baseEchoes = Math.floor(Math.sqrt(totalFlux) / 10);
  const civBonus = Math.floor(Math.sqrt(totalCiv) / 20);
  const timeBonus = Math.floor(runTime / 60);

  let echoes = Math.max(1, baseEchoes + civBonus + timeBonus);

  const metaBonuses = applyMetaUpgrades(state);
  echoes *= metaBonuses.echoesEarnedMultiplier;

  const stageBonuses = applyStageMultipliers(state);
  echoes *= stageBonuses.echoBonus;

  const fast = runTime < 300;
  if (fast && state.metaUpgrades.weird_speed_1) {
    const level = state.metaUpgrades.weird_speed_1;
    echoes *= 1 + (0.5 * level);
  }

  return Math.floor(echoes);
}

export function checkAchievements(state: GameState): GameState {
  const newState = { ...state };
  let updatedAny = false;

  const totalBuildings = Object.values(state.buildings).reduce((sum, b) => sum + b.count, 0);
  const currentStageOrder = state.currentStageId ? state.currentStageId : 'primordial';

  Object.keys(newState.achievements).forEach((id) => {
    const achievement = newState.achievements[id];
    if (achievement.unlocked) return;

    let currentProgress = achievement.progress;

    if (id.startsWith('click_') || id === 'first_click') {
      currentProgress = state.totalClicks;
    } else if (id.startsWith('buildings_') || id === 'first_building') {
      currentProgress = totalBuildings;
    } else if (id.startsWith('flux_')) {
      currentProgress = Math.max(state.flux, state.totalFluxEarned);
    } else if (id.startsWith('civilization_')) {
      currentProgress = state.civilization;
    } else if (id.startsWith('collapse_') || id === 'first_collapse') {
      currentProgress = state.runNumber;
    } else if (id.startsWith('echoes_')) {
      currentProgress = state.totalEchoesEver;
    } else if (id === 'trait_discovery' || id === 'trait_discovery_all') {
      currentProgress = state.discoveredTraits.length;
    } else if (id === 'rare_trait') {
      const hasRare = state.activeTraits.some((traitId) => {
        const trait = TRAITS[traitId];
        return trait && (trait.rarity === 'rare' || trait.rarity === 'mythic');
      });
      currentProgress = hasRare && state.runNumber > 0 ? 1 : 0;
    } else if (id === 'mythic_trait') {
      const hasMythic = state.activeTraits.some((traitId) => {
        const trait = TRAITS[traitId];
        return trait && trait.rarity === 'mythic';
      });
      currentProgress = hasMythic && state.runNumber > 0 ? 1 : 0;
    } else if (id.startsWith('stage_')) {
      const stageMap: Record<string, string> = {
        stage_starbirth: 'starbirth',
        stage_planetfall: 'planetfall',
        stage_awakening: 'awakening',
        stage_civilizations: 'civilizations',
        stage_ascension: 'ascension',
      };
      const requiredStage = stageMap[id];
      if (requiredStage) {
        const reached = state.highestStageReached === requiredStage ||
          (state.highestStageReached && state.highestStageReached >= requiredStage);
        currentProgress = reached ? 1 : 0;
      }
    } else if (id === 'fast_run') {
      currentProgress = state.totalRunTime < 300 && state.runNumber > 0 ? 1 : 0;
    }

    if (currentProgress >= achievement.target && !achievement.unlocked) {
      newState.achievements[id] = {
        ...achievement,
        unlocked: true,
        progress: currentProgress,
      };
      newState.shards += achievement.reward.shards;
      updatedAny = true;
    } else if (currentProgress !== achievement.progress) {
      newState.achievements[id] = {
        ...achievement,
        progress: currentProgress,
      };
    }
  });

  return updatedAny ? newState : state;
}
