import { useEffect, useRef } from 'react';
import { GameState } from '../types/game';
import { getTotalProduction, checkAchievements } from '../game/logic';
import { getStageFromFlux, initializeDailyTasks, updateDailyTaskProgress, applyMetaUpgrades } from '../game/helpers';

const TICK_RATE = 200;

export function useGameLoop(
  _state: GameState,
  setState: React.Dispatch<React.SetStateAction<GameState>>,
  isLoading: boolean
) {
  const lastTickRef = useRef<number>(Date.now());
  const anomalyTimerRef = useRef<number>(0);

  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const deltaSeconds = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setState((prev) => {
        const { fluxPerSecond, civilizationPerSecond } = getTotalProduction(prev);

        const fluxGained = fluxPerSecond * deltaSeconds;
        const civilizationGained = civilizationPerSecond * deltaSeconds;

        anomalyTimerRef.current += deltaSeconds;

        let anomaliesGained = 0;
        if (anomalyTimerRef.current >= 60) {
          const anomalyChance = 0.01;
          let totalChance = anomalyChance;

          prev.activeTraits.forEach((traitId) => {
            if (traitId === 'cosmic_lottery') {
              totalChance *= 10;
            }
          });

          if (Math.random() < totalChance) {
            anomaliesGained = 1;
          }

          anomalyTimerRef.current = 0;
        }

        let newState = {
          ...prev,
          flux: prev.flux + fluxGained,
          civilization: prev.civilization + civilizationGained,
          anomalies: prev.anomalies + anomaliesGained,
          totalFluxEarned: prev.totalFluxEarned + fluxGained,
          totalRunTime: prev.totalRunTime + deltaSeconds,
          lastTickTime: new Date(now).toISOString(),
          lastUpdateTime: new Date(now).toISOString(),
        };

        const newStageId = getStageFromFlux(newState);
        if (newStageId !== newState.currentStageId) {
          newState = {
            ...newState,
            currentStageId: newStageId,
            highestStageReached: newStageId,
          };
        }

        newState = initializeDailyTasks(newState);
        newState = updateDailyTaskProgress(newState);

        return checkAchievements(newState);
      });
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [isLoading, setState]);
}
