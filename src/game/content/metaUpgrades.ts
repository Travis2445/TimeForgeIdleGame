export type MetaUpgradeColumn = 'power' | 'tempo' | 'weirdness';

export interface MetaUpgradeEffect {
  type: 'multiplier' | 'additive' | 'special';
  key: string;
  valuePerLevel: number;
}

export interface MetaUpgrade {
  id: string;
  name: string;
  description: string;
  column: MetaUpgradeColumn;
  tier: number;
  baseCost: number;
  costMultiplier: number;
  maxLevel: number;
  effects: MetaUpgradeEffect[];
  prerequisite?: string;
}

export const META_UPGRADES: Record<string, MetaUpgrade> = {
  power_click_1: {
    id: 'power_click_1',
    name: 'Forge Mastery',
    description: 'Each click generates +50% Sparks',
    column: 'power',
    tier: 1,
    baseCost: 3,
    costMultiplier: 2,
    maxLevel: 5,
    effects: [
      { type: 'multiplier', key: 'clickPower', valuePerLevel: 1.5 },
    ],
  },
  power_buildings_1: {
    id: 'power_buildings_1',
    name: 'Industrial Revolution',
    description: 'All buildings produce +25% more',
    column: 'power',
    tier: 2,
    baseCost: 5,
    costMultiplier: 2.5,
    maxLevel: 5,
    effects: [
      { type: 'multiplier', key: 'buildingProduction', valuePerLevel: 1.25 },
    ],
  },
  power_flux_1: {
    id: 'power_flux_1',
    name: 'Quantum Resonance',
    description: 'Global Flux production +30%',
    column: 'power',
    tier: 3,
    baseCost: 10,
    costMultiplier: 3,
    maxLevel: 5,
    effects: [
      { type: 'multiplier', key: 'fluxMultiplier', valuePerLevel: 1.3 },
    ],
  },
  power_civilization_1: {
    id: 'power_civilization_1',
    name: 'Cultural Enlightenment',
    description: 'Civilization production +40%',
    column: 'power',
    tier: 4,
    baseCost: 20,
    costMultiplier: 3,
    maxLevel: 3,
    effects: [
      { type: 'multiplier', key: 'civilizationMultiplier', valuePerLevel: 1.4 },
    ],
  },
  power_ultimate: {
    id: 'power_ultimate',
    name: 'Cosmic Omnipotence',
    description: 'All production doubled',
    column: 'power',
    tier: 5,
    baseCost: 100,
    costMultiplier: 5,
    maxLevel: 1,
    effects: [
      { type: 'multiplier', key: 'globalProduction', valuePerLevel: 2 },
    ],
    prerequisite: 'power_flux_1',
  },

  tempo_cost_1: {
    id: 'tempo_cost_1',
    name: 'Efficient Forging',
    description: 'Buildings cost -10% Sparks',
    column: 'tempo',
    tier: 1,
    baseCost: 3,
    costMultiplier: 2,
    maxLevel: 5,
    effects: [
      { type: 'multiplier', key: 'buildingCost', valuePerLevel: 0.9 },
    ],
  },
  tempo_stages_1: {
    id: 'tempo_stages_1',
    name: 'Temporal Acceleration',
    description: 'Reach stages 15% faster',
    column: 'tempo',
    tier: 2,
    baseCost: 5,
    costMultiplier: 2.5,
    maxLevel: 3,
    effects: [
      { type: 'multiplier', key: 'stageProgress', valuePerLevel: 1.15 },
    ],
  },
  tempo_offline_1: {
    id: 'tempo_offline_1',
    name: 'Idle Mastery',
    description: 'Offline time cap +2 hours, gains +20%',
    column: 'tempo',
    tier: 3,
    baseCost: 8,
    costMultiplier: 2,
    maxLevel: 5,
    effects: [
      { type: 'additive', key: 'offlineCapHours', valuePerLevel: 2 },
      { type: 'multiplier', key: 'offlineGains', valuePerLevel: 1.2 },
    ],
  },
  tempo_echoes_1: {
    id: 'tempo_echoes_1',
    name: 'Echo Amplifier',
    description: 'Earn +25% more Echo Crystals on collapse',
    column: 'tempo',
    tier: 4,
    baseCost: 15,
    costMultiplier: 3,
    maxLevel: 4,
    effects: [
      { type: 'multiplier', key: 'echoesEarned', valuePerLevel: 1.25 },
    ],
  },
  tempo_ultimate: {
    id: 'tempo_ultimate',
    name: 'Time Lord',
    description: 'Everything happens 50% faster',
    column: 'tempo',
    tier: 5,
    baseCost: 120,
    costMultiplier: 5,
    maxLevel: 1,
    effects: [
      { type: 'multiplier', key: 'globalSpeed', valuePerLevel: 1.5 },
    ],
    prerequisite: 'tempo_stages_1',
  },

  weird_traits_1: {
    id: 'weird_traits_1',
    name: 'Multiverse Awareness',
    description: '+1 trait choice at run start',
    column: 'weirdness',
    tier: 1,
    baseCost: 10,
    costMultiplier: 5,
    maxLevel: 2,
    effects: [
      { type: 'additive', key: 'traitChoices', valuePerLevel: 1 },
    ],
  },
  weird_anomaly_1: {
    id: 'weird_anomaly_1',
    name: 'Reality Glitch',
    description: 'Small chance each minute for bonus Anomaly',
    column: 'weirdness',
    tier: 2,
    baseCost: 12,
    costMultiplier: 4,
    maxLevel: 3,
    effects: [
      { type: 'additive', key: 'anomalyChance', valuePerLevel: 0.05 },
    ],
  },
  weird_speed_1: {
    id: 'weird_speed_1',
    name: 'Speedrunner',
    description: 'Bonus Echoes for runs under 10 minutes',
    column: 'weirdness',
    tier: 3,
    baseCost: 15,
    costMultiplier: 3,
    maxLevel: 3,
    effects: [
      { type: 'special', key: 'fastRunBonus', valuePerLevel: 0.5 },
    ],
  },
  weird_starting_1: {
    id: 'weird_starting_1',
    name: 'Head Start',
    description: 'Begin each run with 100 Sparks',
    column: 'weirdness',
    tier: 4,
    baseCost: 8,
    costMultiplier: 2,
    maxLevel: 5,
    effects: [
      { type: 'additive', key: 'startingSparks', valuePerLevel: 100 },
    ],
  },
  weird_ultimate: {
    id: 'weird_ultimate',
    name: 'Chaos Incarnate',
    description: 'Random powerful effect each run',
    column: 'weirdness',
    tier: 5,
    baseCost: 150,
    costMultiplier: 10,
    maxLevel: 1,
    effects: [
      { type: 'special', key: 'randomBuff', valuePerLevel: 1 },
    ],
    prerequisite: 'weird_traits_1',
  },
};

export function getMetaUpgradeCost(upgrade: MetaUpgrade, currentLevel: number): number {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
}

export function canAffordMetaUpgrade(upgrade: MetaUpgrade, currentLevel: number, echoes: number): boolean {
  if (currentLevel >= upgrade.maxLevel) return false;
  return echoes >= getMetaUpgradeCost(upgrade, currentLevel);
}

export function isMetaUpgradeUnlocked(upgrade: MetaUpgrade, purchasedUpgrades: Record<string, number>): boolean {
  if (!upgrade.prerequisite) return true;
  return (purchasedUpgrades[upgrade.prerequisite] || 0) > 0;
}
