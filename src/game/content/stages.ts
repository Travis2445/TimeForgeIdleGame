export interface UniverseStage {
  id: string;
  name: string;
  description: string;
  order: number;
  fluxThreshold: number;
  bonuses?: { [key: string]: number };
}

export const UNIVERSE_STAGES: Record<string, UniverseStage> = {
  primordial: {
    id: 'primordial',
    name: 'Primordial',
    description: 'The universe emerges from quantum foam. Raw energy coalesces.',
    order: 0,
    fluxThreshold: 0,
    bonuses: {},
  },
  starbirth: {
    id: 'starbirth',
    name: 'Starbirth',
    description: 'First stars ignite across the cosmos, forging heavier elements.',
    order: 1,
    fluxThreshold: 500,
    bonuses: { fluxMultiplier: 1.1 },
  },
  planetfall: {
    id: 'planetfall',
    name: 'Planetfall',
    description: 'Worlds form from stellar debris. Planets orbit their suns.',
    order: 2,
    fluxThreshold: 5000,
    bonuses: { fluxMultiplier: 1.15, buildingCostReduction: 0.95 },
  },
  awakening: {
    id: 'awakening',
    name: 'Awakening Life',
    description: 'Life emerges from primordial soup. Consciousness begins to stir.',
    order: 3,
    fluxThreshold: 50000,
    bonuses: { fluxMultiplier: 1.2, civilizationMultiplier: 1.1 },
  },
  civilizations: {
    id: 'civilizations',
    name: 'Civilizations',
    description: 'Sentient beings build great societies across countless worlds.',
    order: 4,
    fluxThreshold: 500000,
    bonuses: { fluxMultiplier: 1.3, civilizationMultiplier: 1.3 },
  },
  ascension: {
    id: 'ascension',
    name: 'Ascension',
    description: 'Reality transcends itself. The universe approaches its ultimate form.',
    order: 5,
    fluxThreshold: 5000000,
    bonuses: { fluxMultiplier: 1.5, civilizationMultiplier: 1.5, echoBonus: 1.2 },
  },
};

export const STAGE_ORDER = Object.values(UNIVERSE_STAGES).sort((a, b) => a.order - b.order);

export function getCurrentStage(totalFlux: number): UniverseStage {
  for (let i = STAGE_ORDER.length - 1; i >= 0; i--) {
    if (totalFlux >= STAGE_ORDER[i].fluxThreshold) {
      return STAGE_ORDER[i];
    }
  }
  return STAGE_ORDER[0];
}

export function getNextStage(currentStageId: string): UniverseStage | null {
  const currentStage = UNIVERSE_STAGES[currentStageId];
  if (!currentStage) return null;

  const nextOrder = currentStage.order + 1;
  return STAGE_ORDER.find((s) => s.order === nextOrder) || null;
}

export function isStageUnlocked(stageId: string, totalFlux: number): boolean {
  const stage = UNIVERSE_STAGES[stageId];
  return stage ? totalFlux >= stage.fluxThreshold : false;
}
