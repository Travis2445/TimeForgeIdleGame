import { Sparkles, TrendingUp, Clock, Zap } from 'lucide-react';
import { GameState } from '../types/game';
import { calculateEchoesFromRun } from '../game/logic';

interface CollapseModalProps {
  state: GameState;
  onConfirm: () => void;
  onCancel: () => void;
}

function formatNumber(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return Math.floor(num).toString();
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

export function CollapseModal({ state, onConfirm, onCancel }: CollapseModalProps) {
  const echoesEarned = calculateEchoesFromRun(state);

  const stats = [
    {
      label: 'Total Flux Earned',
      value: formatNumber(state.totalFluxEarned),
      icon: Zap,
      color: 'text-cyan-400',
    },
    {
      label: 'Civilization Level',
      value: formatNumber(state.civilization),
      icon: TrendingUp,
      color: 'text-green-400',
    },
    {
      label: 'Run Duration',
      value: formatTime(state.totalRunTime),
      icon: Clock,
      color: 'text-blue-400',
    },
    {
      label: 'Total Clicks',
      value: formatNumber(state.totalClicks),
      icon: Sparkles,
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 max-w-2xl w-full border border-slate-700 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles size={32} className="text-purple-400 animate-pulse" />
            <h2 className="text-3xl font-bold text-slate-100">Collapse Universe</h2>
            <Sparkles size={32} className="text-purple-400 animate-pulse" />
          </div>
          <p className="text-slate-400">
            Your universe has reached its peak. Collapse it into Echo Crystals to begin anew.
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-xl p-6 mb-6 border border-purple-500/30">
          <div className="text-center">
            <div className="text-sm text-slate-400 mb-2">Echo Crystals Earned</div>
            <div className="text-5xl font-bold text-purple-400 mb-2">
              +{echoesEarned}
            </div>
            <div className="text-sm text-slate-500">
              Total: {state.echoes} → {state.echoes + echoesEarned}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className={stat.color} />
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
                <div className={`text-xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl transition-all duration-200"
          >
            Keep Going
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-200"
          >
            Collapse Universe
          </button>
        </div>

        <div className="mt-6 p-4 bg-amber-900/20 rounded-lg border border-amber-700/50">
          <p className="text-xs text-amber-300 text-center">
            Echo Crystals are permanent and can be spent on powerful upgrades that persist across all universes.
          </p>
        </div>
      </div>
    </div>
  );
}
