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

export interface DailyTaskProgress {
  taskId: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

export interface TutorialState {
  completedSteps: string[];
  currentStep: string | null;
  dismissed: boolean;
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
  lastUpdateTime: string;
  totalRunTime: number;

  totalClicks: number;
  totalSparksEarned: number;
  totalFluxEarned: number;

  currentStageId: string;
  highestStageReached: string;

  metaUpgrades: Record<string, number>;

  dailyTasks: DailyTaskProgress[];
  dailyTasksLastReset: string;
  dailyCollapses: number;
  dailyRareTraitRuns: number;
  dailyBuildingsPurchased: number;

  tutorial: TutorialState;

  offlineGainsClaimed: boolean;

  purchaseMode: 1 | 10 | 25 | 100 | 'max';
  lastRunTraits: TraitId[];
  peakFluxPerSecond: number;

  settings: {
    soundOn: boolean;
    animationsOn: boolean;
    numberFormat: 'shorthand' | 'scientific';
  };

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
