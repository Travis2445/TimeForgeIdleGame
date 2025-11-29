import { GameState, Building } from '../types/game';
import { getBuildingCost } from './buildings';

export function calculateMultiBuyCost(
  building: Building,
  amount: number | 'max',
  state: GameState
): { count: number; totalCost: number } {
  if (amount === 'max') {
    return calculateMaxBuy(building, state);
  }

  const baseCost = building.baseCost;
  const multiplier = building.costMultiplier;
  const currentCount = building.count;

  let totalCost = 0;
  for (let i = 0; i < amount; i++) {
    const cost = Math.floor(baseCost * Math.pow(multiplier, currentCount + i));
    totalCost += cost;
  }

  return { count: amount, totalCost: Math.floor(totalCost) };
}

export function calculateMaxBuy(
  building: Building,
  state: GameState
): { count: number; totalCost: number } {
  const availableSparks = state.sparks;
  const baseCost = building.baseCost;
  const multiplier = building.costMultiplier;
  const currentCount = building.count;

  let count = 0;
  let totalCost = 0;

  while (true) {
    const nextCost = Math.floor(baseCost * Math.pow(multiplier, currentCount + count));
    if (totalCost + nextCost > availableSparks) {
      break;
    }
    totalCost += nextCost;
    count++;

    if (count > 1000) break;
  }

  return { count, totalCost };
}

export function canAffordMultiBuy(
  building: Building,
  amount: number | 'max',
  state: GameState
): boolean {
  const { totalCost } = calculateMultiBuyCost(building, amount, state);
  return state.sparks >= totalCost;
}
