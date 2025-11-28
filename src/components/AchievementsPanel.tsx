import { Trophy, Lock } from 'lucide-react';
import { GameState } from '../types/game';

interface AchievementsPanelProps {
  state: GameState;
}

export function AchievementsPanel({ state }: AchievementsPanelProps) {
  const achievements = Object.values(state.achievements);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
        <Trophy size={24} className="text-orange-400" />
        Achievements
        <span className="text-sm text-slate-500">
          ({unlockedCount} / {achievements.length})
        </span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              achievement.unlocked
                ? 'bg-gradient-to-br from-orange-900/30 to-yellow-900/30 border-orange-500/50'
                : 'bg-slate-900/50 border-slate-700/50 opacity-60'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg ${
                  achievement.unlocked
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'bg-slate-800 text-slate-600'
                }`}
              >
                {achievement.unlocked ? <Trophy size={20} /> : <Lock size={20} />}
              </div>

              <div className="flex-1">
                <h3
                  className={`font-semibold mb-1 ${
                    achievement.unlocked ? 'text-slate-100' : 'text-slate-500'
                  }`}
                >
                  {achievement.name}
                </h3>
                <p
                  className={`text-xs mb-2 ${
                    achievement.unlocked ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {achievement.description}
                </p>

                {!achievement.unlocked && achievement.target > 1 && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>
                        {Math.floor(achievement.progress)} / {achievement.target}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div
                        className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            (achievement.progress / achievement.target) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="text-xs text-orange-400 font-semibold">
                  +{achievement.reward.shards} Shards
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
