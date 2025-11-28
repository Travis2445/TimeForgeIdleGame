import { Trait, TraitId } from '../types/game';

export const TRAITS: Record<TraitId, Trait> = {
  arcane_physics: {
    id: 'arcane_physics',
    name: 'Arcane Physics',
    description: 'Magic infuses reality. Labs produce +200% Flux, but Reactors produce -30%.',
    modifiers: {
      buildingMultipliers: {
        lab: 3.0,
        reactor: 0.7,
      },
    },
    rarity: 'uncommon',
    discovered: true,
  },
  early_industrialization: {
    id: 'early_industrialization',
    name: 'Early Industrialization',
    description: 'Civilization advances rapidly. +150% Civilization, but upgrades cost +50%.',
    modifiers: {
      civilizationMultiplier: 2.5,
      upgradeCostMultiplier: 1.5,
    },
    rarity: 'common',
    discovered: true,
  },
  cosmic_lottery: {
    id: 'cosmic_lottery',
    name: 'Cosmic Lottery',
    description: 'Reality is unpredictable. Random massive production spikes.',
    modifiers: {
      anomalyChanceMultiplier: 10.0,
    },
    rarity: 'rare',
    discovered: true,
  },
  entropy_plus: {
    id: 'entropy_plus',
    name: 'Entropy Plus',
    description: 'Time accelerates. +100% all production, runs end 40% sooner.',
    modifiers: {
      fluxMultiplier: 2.0,
      civilizationMultiplier: 2.0,
      runDurationMultiplier: 0.6,
    },
    rarity: 'rare',
    discovered: true,
  },
  steady_growth: {
    id: 'steady_growth',
    name: 'Steady Growth',
    description: 'Stable universe. Buildings cost -20%, production +20%.',
    modifiers: {
      buildingCostMultiplier: 0.8,
      fluxMultiplier: 1.2,
    },
    rarity: 'common',
    discovered: true,
  },
  hyper_industrial: {
    id: 'hyper_industrial',
    name: 'Hyper-Industrial',
    description: 'Machine supremacy. Foundries and Reactors produce +150%.',
    modifiers: {
      buildingMultipliers: {
        foundry: 2.5,
        reactor: 2.5,
      },
    },
    rarity: 'uncommon',
    discovered: true,
  },
  quantum_flux: {
    id: 'quantum_flux',
    name: 'Quantum Flux',
    description: 'Reality fluctuates. All Flux production +300%.',
    modifiers: {
      fluxMultiplier: 4.0,
    },
    rarity: 'mythic',
    discovered: true,
  },
  philosopher_stone: {
    id: 'philosopher_stone',
    name: "Philosopher's Stone",
    description: 'Alchemical perfection. Clicking produces +500% Sparks.',
    modifiers: {
      sparkClickMultiplier: 6.0,
    },
    rarity: 'uncommon',
    discovered: true,
  },
  slow_time: {
    id: 'slow_time',
    name: 'Slow Time',
    description: 'Time crawls. Buildings cost -40%, production -30%.',
    modifiers: {
      buildingCostMultiplier: 0.6,
      fluxMultiplier: 0.7,
      civilizationMultiplier: 0.7,
    },
    rarity: 'common',
    discovered: true,
  },
  ascended_reality: {
    id: 'ascended_reality',
    name: 'Ascended Reality',
    description: 'Transcendence beckons. Worlds produce +400%.',
    modifiers: {
      buildingMultipliers: {
        world: 5.0,
      },
    },
    rarity: 'mythic',
    discovered: true,
  },
};

export function getRandomTraits(count: number): TraitId[] {
  const allTraits = Object.keys(TRAITS);
  const rarityWeights = {
    common: 50,
    uncommon: 30,
    rare: 15,
    mythic: 5,
  };

  const weightedTraits: TraitId[] = [];
  allTraits.forEach((traitId) => {
    const trait = TRAITS[traitId];
    const weight = rarityWeights[trait.rarity];
    for (let i = 0; i < weight; i++) {
      weightedTraits.push(traitId);
    }
  });

  const selected: TraitId[] = [];
  const used = new Set<TraitId>();

  while (selected.length < count && selected.length < allTraits.length) {
    const randomIndex = Math.floor(Math.random() * weightedTraits.length);
    const traitId = weightedTraits[randomIndex];

    if (!used.has(traitId)) {
      selected.push(traitId);
      used.add(traitId);
    }
  }

  return selected;
}
