export interface DailyTask {
  id: string;
  name: string;
  description: string;
  target: number;
  reward: {
    echoes?: number;
    sparks?: number;
    productionBoost?: number;
  };
  checkProgress: (state: any) => number;
}

export const DAILY_TASKS: DailyTask[] = [
  {
    id: 'generate_sparks',
    name: 'Spark Generator',
    description: 'Generate 10,000 Sparks',
    target: 10000,
    reward: { echoes: 2 },
    checkProgress: (state) => state.totalSparksEarned || 0,
  },
  {
    id: 'collapse_once',
    name: 'Universe Recycler',
    description: 'Collapse a universe',
    target: 1,
    reward: { echoes: 3 },
    checkProgress: (state) => state.dailyCollapses || 0,
  },
  {
    id: 'use_rare_trait',
    name: 'Rare Reality',
    description: 'Complete a run with a Rare or Mythic trait',
    target: 1,
    reward: { echoes: 5 },
    checkProgress: (state) => state.dailyRareTraitRuns || 0,
  },
  {
    id: 'reach_stage',
    name: 'Stage Explorer',
    description: 'Reach the Civilizations stage',
    target: 1,
    reward: { echoes: 4 },
    checkProgress: (state) => {
      const stageOrder = state.currentStage?.order || 0;
      return stageOrder >= 4 ? 1 : 0;
    },
  },
  {
    id: 'buy_buildings',
    name: 'Industrial Tycoon',
    description: 'Purchase 50 buildings',
    target: 50,
    reward: { echoes: 2, sparks: 500 },
    checkProgress: (state) => state.dailyBuildingsPurchased || 0,
  },
];

export function getRandomDailyTasks(count: number = 3): DailyTask[] {
  const shuffled = [...DAILY_TASKS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function isDailyTaskComplete(task: DailyTask, progress: number): boolean {
  return progress >= task.target;
}

export function shouldResetDailyTasks(lastResetTime: string): boolean {
  const lastReset = new Date(lastResetTime);
  const now = new Date();

  const lastMidnight = new Date(lastReset);
  lastMidnight.setUTCHours(0, 0, 0, 0);

  const nextMidnight = new Date(lastMidnight);
  nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1);

  return now >= nextMidnight;
}
