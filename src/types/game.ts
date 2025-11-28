export type TraitId = string;
export type BuildingId = string;
export type UpgradeId = string;
export type AchievementId = string;

export type TraitRarity = "common" | "uncommon" | "rare" | "mythic";

export interface TraitModifiers {
  sparkClickMultiplier?: number;
  fluxMultiplier?: number;
  civilizationMultiplier?: number;
  buildingCostMultiplier?: number;
  upgradeCostMultiplier?: number;
  runDurationMultiplier?: number;
  buildingMultipliers?: Record<BuildingId, number>;
  anomalyChanceMultiplier?: number;
}

export interface Trait {
  id: TraitId;
  name: string;
  description: string;
  modifiers: TraitModifiers;
  rarity: TraitRarity;
  discovered: boolean;
}

export interface Building {
  id: BuildingId;
  name: string;
  description: string;
  baseRate: number;
  baseCost: number;
  costMultiplier: number;
  count: number;
  resourceProduced: 'flux' | 'civilization';
  unlockedAt: number;
}

export interface Upgrade {
  id: UpgradeId;
  name: string;
  description: string;
  cost: number;
  costCurrency: 'sparks' | 'flux' | 'civilization' | 'echoes';
  effect: {
    type: 'multiplier' | 'additive' | 'unlock' | 'special';
    target: 'sparks' | 'flux' | 'civilization' | 'building' | 'global';
    value: number;
    buildingId?: BuildingId;
  };
  purchased: boolean;
  visible: boolean;
  prerequisite?: (state: GameState) => boolean;
}

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  unlocked: boolean;
  progress: number;
  target: number;
  reward: {
    shards: number;
    bonus?: string;
  };
}

export interface GameState {
  version: number;

  sparks: number;
  flux: number;
  civilization: number;
  anomalies: number;

  echoes: number;
  totalEchoesEver: number;
  shards: number;

  buildings: Record<BuildingId, Building>;
  upgrades: Record<UpgradeId, Upgrade>;
  achievements: Record<AchievementId, Achievement>;

  activeTraits: TraitId[];
  discoveredTraits: TraitId[];

  runNumber: number;
  runStartTime: string;
  lastTickTime: string;
  totalRunTime: number;

  totalClicks: number;
  totalSparksEarned: number;
  totalFluxEarned: number;

  soundOn: boolean;
  autoSaveEnabled: boolean;
}

export interface GameProfile {
  id: string;
  userId: string;
  displayName: string;
  createdAt: string;
  lastSeenAt: string;
  totalEchoesEarned: number;
  highestRunPower: number;
}

export interface SaveData {
  id: string;
  userId: string;
  slot: number;
  stateJson: GameState;
  version: number;
  updatedAt: string;
}
