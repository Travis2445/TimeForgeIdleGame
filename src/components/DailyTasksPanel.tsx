import { Trophy, Check } from 'lucide-react';
import { GameState } from '../types/game';
import { DAILY_TASKS } from '../game/content/dailyTasks';

interface DailyTasksPanelProps {
  state: GameState;
  onClaim: (taskId: string) => void;
}

export function DailyTasksPanel({ state, onClaim }: DailyTasksPanelProps) {
  if (!state.dailyTasks || state.dailyTasks.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={20} className="text-yellow-400" />
        <h3 className="font-bold text-slate-200">Daily Challenges</h3>
      </div>

      <div className="space-y-2">
        {state.dailyTasks.map((taskProgress) => {
          const task = DAILY_TASKS.find((t) => t.id === taskProgress.taskId);
          if (!task) return null;

          const progress = Math.min(taskProgress.progress, task.target);
          const progressPercent = (progress / task.target) * 100;

          return (
            <div
              key={task.id}
              className={`p-3 rounded-lg border ${
                taskProgress.completed
                  ? 'bg-green-900/20 border-green-700/50'
                  : 'bg-slate-800/50 border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-slate-100 text-sm">{task.name}</h4>
                    {taskProgress.completed && !taskProgress.claimed && (
                      <Check size={16} className="text-green-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{task.description}</p>

                  {!taskProgress.completed && (
                    <div className="mb-2">
                      <div className="w-full bg-slate-700 rounded-full h-1.5 mb-1">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-500">
                        {Math.floor(progress)} / {task.target}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {task.reward.echoes && (
                      <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                        +{task.reward.echoes} Echoes
                      </span>
                    )}
                    {task.reward.sparks && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded">
                        +{task.reward.sparks} Sparks
                      </span>
                    )}
                  </div>
                </div>

                {taskProgress.completed && !taskProgress.claimed && (
                  <button
                    onClick={() => onClaim(task.id)}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded transition-colors"
                  >
                    Claim
                  </button>
                )}

                {taskProgress.claimed && (
                  <div className="text-xs text-green-400 font-semibold">Claimed</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
