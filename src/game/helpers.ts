import { GameState } from '../types/game';
import { META_UPGRADES, getMetaUpgradeCost } from './content/metaUpgrades';
import { getCurrentStage, UNIVERSE_STAGES } from './content/stages';
import { getRandomDailyTasks, shouldResetDailyTasks } from './content/dailyTasks';

export function applyMetaUpgrades(state: GameState): {
  clickPowerMultiplier: number;
  buildingProductionMultiplier: number;
  fluxMultiplier: number;
  civilizationMultiplier: number;
  globalProductionMultiplier: number;
  buildingCostMultiplier: number;
  stageProgressMultiplier: number;
  offlineCapHours: number;
  offlineGainsMultiplier: number;
  echoesEarnedMultiplier: number;
  traitChoices: number;
  anomalyChance: number;
  startingSparks: number;
  globalSpeedMultiplier: number;
} {
  const result = {
    clickPowerMultiplier: 1,
    buildingProductionMultiplier: 1,
    fluxMultiplier: 1,
    civilizationMultiplier: 1,
    globalProductionMultiplier: 1,
    buildingCostMultiplier: 1,
    stageProgressMultiplier: 1,
    offlineCapHours: 8,
    offlineGainsMultiplier: 1,
    echoesEarnedMultiplier: 1,
    traitChoices: 2,
    anomalyChance: 0,
    startingSparks: 0,
    globalSpeedMultiplier: 1,
  };

  Object.entries(state.metaUpgrades || {}).forEach(([upgradeId, level]) => {
    const upgrade = META_UPGRADES[upgradeId];
    if (!upgrade || level === 0) return;

    upgrade.effects.forEach((effect) => {
      const value = Math.pow(effect.valuePerLevel, level);
      const additiveValue = effect.valuePerLevel * level;

      switch (effect.key) {
        case 'clickPower':
          result.clickPowerMultiplier *= value;
          break;
        case 'buildingProduction':
          result.buildingProductionMultiplier *= value;
          break;
        case 'fluxMultiplier':
          result.fluxMultiplier *= value;
          break;
        case 'civilizationMultiplier':
          result.civilizationMultiplier *= value;
          break;
        case 'globalProduction':
          result.globalProductionMultiplier *= value;
          break;
        case 'buildingCost':
          result.buildingCostMultiplier *= value;
          break;
        case 'stageProgress':
          result.stageProgressMultiplier *= value;
          break;
        case 'offlineCapHours':
          result.offlineCapHours += additiveValue;
          break;
        case 'offlineGains':
          result.offlineGainsMultiplier *= value;
          break;
        case 'echoesEarned':
          result.echoesEarnedMultiplier *= value;
          break;
        case 'traitChoices':
          result.traitChoices += additiveValue;
          break;
        case 'anomalyChance':
          result.anomalyChance += additiveValue;
          break;
        case 'startingSparks':
          result.startingSparks += additiveValue;
          break;
        case 'globalSpeed':
          result.globalSpeedMultiplier *= value;
          break;
      }
    });
  });

  return result;
}

export function applyStageMultipliers(state: GameState): {
  fluxMultiplier: number;
  civilizationMultiplier: number;
  buildingCostMultiplier: number;
  echoBonus: number;
} {
  const currentStage = UNIVERSE_STAGES[state.currentStageId];
  if (!currentStage || !currentStage.bonuses) {
    return {
      fluxMultiplier: 1,
      civilizationMultiplier: 1,
      buildingCostMultiplier: 1,
      echoBonus: 1,
    };
  }

  return {
    fluxMultiplier: currentStage.bonuses.fluxMultiplier || 1,
    civilizationMultiplier: currentStage.bonuses.civilizationMultiplier || 1,
    buildingCostMultiplier: currentStage.bonuses.buildingCostReduction || 1,
    echoBonus: currentStage.bonuses.echoBonus || 1,
  };
}

export function calculateOfflineGains(state: GameState): {
  sparks: number;
  flux: number;
  civilization: number;
  timeAwaySeconds: number;
} {
  const now = Date.now();
  const lastUpdate = new Date(state.lastUpdateTime || state.lastTickTime).getTime();
  const timeAwayMs = now - lastUpdate;
  const timeAwaySeconds = timeAwayMs / 1000;

  const metaBonuses = applyMetaUpgrades(state);
  const maxOfflineSeconds = metaBonuses.offlineCapHours * 3600;
  const cappedTimeAway = Math.min(timeAwaySeconds, maxOfflineSeconds);

  const clickPower = 1;
  const sparksPerSecond = clickPower * 0.1;

  let fluxPerSecond = 0;
  let civilizationPerSecond = 0;

  Object.values(state.buildings).forEach((building) => {
    const production = building.baseRate * building.count;
    if (building.resourceProduced === 'flux') {
      fluxPerSecond += production;
    } else {
      civilizationPerSecond += production;
    }
  });

  const sparksGained = sparksPerSecond * cappedTimeAway * metaBonuses.offlineGainsMultiplier;
  const fluxGained = fluxPerSecond * cappedTimeAway * metaBonuses.offlineGainsMultiplier;
  const civilizationGained =
    civilizationPerSecond * cappedTimeAway * metaBonuses.offlineGainsMultiplier;

  return {
    sparks: Math.floor(sparksGained),
    flux: Math.floor(fluxGained),
    civilization: Math.floor(civilizationGained),
    timeAwaySeconds: cappedTimeAway,
  };
}

export function getStageFromFlux(state: GameState): string {
  const metaBonuses = applyMetaUpgrades(state);
  const adjustedFlux = state.totalFluxEarned * metaBonuses.stageProgressMultiplier;
  const stage = getCurrentStage(adjustedFlux);
  return stage.id;
}

export function initializeDailyTasks(state: GameState): GameState {
  if (
    !state.dailyTasksLastReset ||
    shouldResetDailyTasks(state.dailyTasksLastReset)
  ) {
    const tasks = getRandomDailyTasks(3);
    return {
      ...state,
      dailyTasks: tasks.map((task) => ({
        taskId: task.id,
        progress: 0,
        completed: false,
        claimed: false,
      })),
      dailyTasksLastReset: new Date().toISOString(),
      dailyCollapses: 0,
      dailyRareTraitRuns: 0,
      dailyBuildingsPurchased: 0,
    };
  }
  return state;
}

export function updateDailyTaskProgress(state: GameState): GameState {
  const updatedTasks = state.dailyTasks.map((taskProgress) => {
    if (taskProgress.completed) return taskProgress;

    const task = getRandomDailyTasks(5).find((t) => t.id === taskProgress.taskId);
    if (!task) return taskProgress;

    const progress = task.checkProgress(state);
    const completed = progress >= task.target;

    return {
      ...taskProgress,
      progress,
      completed,
    };
  });

  return {
    ...state,
    dailyTasks: updatedTasks,
  };
}
