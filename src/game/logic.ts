import { GameState, Building, Upgrade } from '../types/game';
import { createBuildings, getBuildingProduction, getBuildingCost } from './buildings';
import { createUpgrades } from './upgrades';
import { createAchievements } from './achievements';
import { TRAITS } from './traits';

export function createInitialState(): GameState {
  return {
    version: 1,

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
    runStartTime: new Date().toISOString(),
    lastTickTime: new Date().toISOString(),
    totalRunTime: 0,

    totalClicks: 0,
    totalSparksEarned: 0,
    totalFluxEarned: 0,

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

  return Math.floor(cost);
}

export function calculateEchoesFromRun(state: GameState): number {
  const totalFlux = state.totalFluxEarned;
  const totalCiv = state.civilization;
  const runTime = state.totalRunTime;

  const baseEchoes = Math.floor(Math.sqrt(totalFlux) / 10);
  const civBonus = Math.floor(Math.sqrt(totalCiv) / 20);
  const timeBonus = Math.floor(runTime / 60);

  return Math.max(1, baseEchoes + civBonus + timeBonus);
}

export function checkAchievements(state: GameState): GameState {
  const newState = { ...state };
  let updatedAny = false;

  Object.keys(newState.achievements).forEach((id) => {
    const achievement = newState.achievements[id];
    if (achievement.unlocked) return;

    let currentProgress = achievement.progress;

    switch (id) {
      case 'first_click':
        currentProgress = state.totalClicks;
        break;
      case 'click_100':
        currentProgress = state.totalClicks;
        break;
      case 'first_building':
        currentProgress = Object.values(state.buildings).reduce(
          (sum, b) => sum + b.count,
          0
        );
        break;
      case 'flux_1k':
      case 'flux_1m':
        currentProgress = state.flux;
        break;
      case 'first_collapse':
      case 'collapse_10':
        currentProgress = state.runNumber;
        break;
      case 'echoes_100':
        currentProgress = state.totalEchoesEver;
        break;
      case 'trait_discovery':
        currentProgress = state.discoveredTraits.length;
        break;
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
