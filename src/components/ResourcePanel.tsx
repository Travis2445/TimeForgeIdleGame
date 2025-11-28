import { Zap, Activity, Users, Sparkles, Award } from 'lucide-react';
import { GameState } from '../types/game';
import { getTotalProduction } from '../game/logic';

interface ResourcePanelProps {
  state: GameState;
}

function formatNumber(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return Math.floor(num).toString();
}

export function ResourcePanel({ state }: ResourcePanelProps) {
  const { fluxPerSecond, civilizationPerSecond } = getTotalProduction(state);

  const resources = [
    {
      name: 'Sparks',
      value: state.sparks,
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
    {
      name: 'Flux',
      value: state.flux,
      rate: fluxPerSecond,
      icon: Activity,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
    },
    {
      name: 'Civilization',
      value: state.civilization,
      rate: civilizationPerSecond,
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      name: 'Echo Crystals',
      value: state.echoes,
      icon: Sparkles,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
    {
      name: 'Shards',
      value: state.shards,
      icon: Award,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {resources.map((resource) => {
        const Icon = resource.icon;
        return (
          <div
            key={resource.name}
            className={`${resource.bgColor} ${resource.borderColor} border rounded-xl p-4 transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={18} className={resource.color} />
              <span className="text-xs font-medium text-slate-400">
                {resource.name}
              </span>
            </div>
            <div className={`text-xl font-bold ${resource.color}`}>
              {formatNumber(resource.value)}
            </div>
            {resource.rate !== undefined && resource.rate > 0 && (
              <div className="text-xs text-slate-500 mt-1">
                +{formatNumber(resource.rate)}/s
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
