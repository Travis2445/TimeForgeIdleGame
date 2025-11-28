import { Upgrade, UpgradeId, GameState } from '../types/game';

export function createUpgrades(): Record<UpgradeId, Upgrade> {
  return {
    click_power_1: {
      id: 'click_power_1',
      name: 'Reinforced Hammer',
      description: 'Each click produces +100% Sparks',
      cost: 50,
      costCurrency: 'sparks',
      effect: {
        type: 'multiplier',
        target: 'sparks',
        value: 2,
      },
      purchased: false,
      visible: true,
    },
    click_power_2: {
      id: 'click_power_2',
      name: 'Cosmic Hammer',
      description: 'Each click produces +200% more Sparks',
      cost: 500,
      costCurrency: 'sparks',
      effect: {
        type: 'multiplier',
        target: 'sparks',
        value: 3,
      },
      purchased: false,
      visible: true,
      prerequisite: (state: GameState) => {
        return state.upgrades.click_power_1?.purchased || false;
      },
    },
    foundry_boost_1: {
      id: 'foundry_boost_1',
      name: 'Foundry Efficiency',
      description: 'Foundries produce +100% Flux',
      cost: 200,
      costCurrency: 'flux',
      effect: {
        type: 'multiplier',
        target: 'building',
        value: 2,
        buildingId: 'foundry',
      },
      purchased: false,
      visible: true,
    },
    reactor_boost_1: {
      id: 'reactor_boost_1',
      name: 'Reactor Containment',
      description: 'Reactors produce +100% Flux',
      cost: 2000,
      costCurrency: 'flux',
      effect: {
        type: 'multiplier',
        target: 'building',
        value: 2,
        buildingId: 'reactor',
      },
      purchased: false,
      visible: true,
    },
    lab_boost_1: {
      id: 'lab_boost_1',
      name: 'Scientific Method',
      description: 'Labs produce +100% Flux',
      cost: 20000,
      costCurrency: 'flux',
      effect: {
        type: 'multiplier',
        target: 'building',
        value: 2,
        buildingId: 'lab',
      },
      purchased: false,
      visible: true,
    },
    global_flux_1: {
      id: 'global_flux_1',
      name: 'Universal Constants',
      description: 'All Flux production +50%',
      cost: 50000,
      costCurrency: 'flux',
      effect: {
        type: 'multiplier',
        target: 'flux',
        value: 1.5,
      },
      purchased: false,
      visible: true,
    },
    civilization_boost_1: {
      id: 'civilization_boost_1',
      name: 'Cultural Renaissance',
      description: 'All Civilization production +100%',
      cost: 100,
      costCurrency: 'civilization',
      effect: {
        type: 'multiplier',
        target: 'civilization',
        value: 2,
      },
      purchased: false,
      visible: true,
    },
    echo_power_1: {
      id: 'echo_power_1',
      name: 'Echo Resonance',
      description: 'Start each run with +10% more production',
      cost: 5,
      costCurrency: 'echoes',
      effect: {
        type: 'multiplier',
        target: 'global',
        value: 1.1,
      },
      purchased: false,
      visible: true,
    },
    echo_power_2: {
      id: 'echo_power_2',
      name: 'Echo Amplification',
      description: 'Start each run with +25% more production',
      cost: 20,
      costCurrency: 'echoes',
      effect: {
        type: 'multiplier',
        target: 'global',
        value: 1.25,
      },
      purchased: false,
      visible: true,
      prerequisite: (state: GameState) => {
        return state.upgrades.echo_power_1?.purchased || false;
      },
    },
    echo_power_3: {
      id: 'echo_power_3',
      name: 'Echo Cascade',
      description: 'Start each run with +50% more production',
      cost: 50,
      costCurrency: 'echoes',
      effect: {
        type: 'multiplier',
        target: 'global',
        value: 1.5,
      },
      purchased: false,
      visible: true,
      prerequisite: (state: GameState) => {
        return state.upgrades.echo_power_2?.purchased || false;
      },
    },
  };
}
