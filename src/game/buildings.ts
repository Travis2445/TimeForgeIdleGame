import { Building, BuildingId } from '../types/game';

export const BUILDING_DEFINITIONS: Record<BuildingId, Omit<Building, 'count'>> = {
  foundry: {
    id: 'foundry',
    name: 'Foundry',
    description: 'Basic forge that produces Flux from raw materials.',
    baseRate: 0.1,
    baseCost: 10,
    costMultiplier: 1.15,
    resourceProduced: 'flux',
    unlockedAt: 0,
  },
  reactor: {
    id: 'reactor',
    name: 'Reactor',
    description: 'Harnesses stellar energy to generate Flux.',
    baseRate: 1,
    baseCost: 100,
    costMultiplier: 1.15,
    resourceProduced: 'flux',
    unlockedAt: 0,
  },
  lab: {
    id: 'lab',
    name: 'Laboratory',
    description: 'Scientific research accelerates universal development.',
    baseRate: 10,
    baseCost: 1100,
    costMultiplier: 1.15,
    resourceProduced: 'flux',
    unlockedAt: 0,
  },
  civilization: {
    id: 'civilization',
    name: 'Civilization Seed',
    description: 'Plants the seeds of intelligent life.',
    baseRate: 0.1,
    baseCost: 12000,
    costMultiplier: 1.15,
    resourceProduced: 'civilization',
    unlockedAt: 1000,
  },
  world: {
    id: 'world',
    name: 'World Engine',
    description: 'Creates entire worlds teeming with potential.',
    baseRate: 100,
    baseCost: 130000,
    costMultiplier: 1.15,
    resourceProduced: 'flux',
    unlockedAt: 10000,
  },
  megastructure: {
    id: 'megastructure',
    name: 'Megastructure',
    description: 'Vast cosmic constructs that reshape reality itself.',
    baseRate: 1,
    baseCost: 500000,
    costMultiplier: 1.15,
    resourceProduced: 'civilization',
    unlockedAt: 100000,
  },
};

export function createBuildings(): Record<BuildingId, Building> {
  const buildings: Record<BuildingId, Building> = {};

  Object.entries(BUILDING_DEFINITIONS).forEach(([id, def]) => {
    buildings[id] = {
      ...def,
      count: 0,
    };
  });

  return buildings;
}

export function getBuildingCost(building: Building, count: number = building.count): number {
  return Math.floor(building.baseCost * Math.pow(building.costMultiplier, count));
}

export function getBuildingProduction(building: Building): number {
  return building.baseRate * building.count;
}
