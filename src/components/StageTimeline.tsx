import { Atom, Flame, Globe, Sparkles, Users, Zap } from 'lucide-react';
import { GameState } from '../types/game';
import { STAGE_ORDER, UNIVERSE_STAGES } from '../game/content/stages';

interface StageTimelineProps {
  state: GameState;
}

const STAGE_ICONS: Record<string, any> = {
  primordial: Flame,
  starbirth: Zap,
  planetfall: Globe,
  awakening: Sparkles,
  civilizations: Users,
  ascension: Atom,
};

export function StageTimeline({ state }: StageTimelineProps) {
  const currentStage = UNIVERSE_STAGES[state.currentStageId];
  const currentOrder = currentStage?.order || 0;

  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
      <h3 className="text-sm font-semibold text-slate-400 mb-4">Universe Evolution</h3>

      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-700" />

        <div className="flex justify-between items-start relative z-10">
          {STAGE_ORDER.map((stage) => {
            const Icon = STAGE_ICONS[stage.id] || Flame;
            const isUnlocked = currentOrder >= stage.order;
            const isCurrent = state.currentStageId === stage.id;

            return (
              <div key={stage.id} className="flex flex-col items-center" style={{ flex: 1 }}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 ring-4 ring-purple-500/30 scale-110'
                      : isUnlocked
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-600'
                      : 'bg-slate-800 border-2 border-slate-700'
                  }`}
                >
                  <Icon
                    size={20}
                    className={isUnlocked ? 'text-white' : 'text-slate-600'}
                  />
                </div>

                <div className="mt-2 text-center">
                  <div
                    className={`text-xs font-semibold ${
                      isCurrent
                        ? 'text-purple-400'
                        : isUnlocked
                        ? 'text-slate-300'
                        : 'text-slate-600'
                    }`}
                  >
                    {stage.name}
                  </div>

                  {isCurrent && (
                    <div className="text-xs text-slate-500 mt-1 max-w-[100px] mx-auto">
                      {stage.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {currentStage && currentStage.bonuses && Object.keys(currentStage.bonuses).length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="text-xs text-slate-500 mb-2">Current Stage Bonuses:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(currentStage.bonuses).map(([key, value]) => {
              let label = key;
              let displayValue = '';

              if (key === 'fluxMultiplier') {
                label = 'Flux';
                displayValue = `+${Math.round((value - 1) * 100)}%`;
              } else if (key === 'civilizationMultiplier') {
                label = 'Civilization';
                displayValue = `+${Math.round((value - 1) * 100)}%`;
              } else if (key === 'buildingCostReduction') {
                label = 'Building Cost';
                displayValue = `-${Math.round((1 - value) * 100)}%`;
              } else if (key === 'echoBonus') {
                label = 'Echo Crystals';
                displayValue = `+${Math.round((value - 1) * 100)}%`;
              }

              return (
                <div
                  key={key}
                  className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-xs text-purple-300"
                >
                  {label}: {displayValue}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
