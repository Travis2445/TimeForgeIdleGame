import { TrendingUp, Lock } from 'lucide-react';
import { GameState } from '../types/game';
import { canAffordUpgrade, applyTraitModifiersToCost } from '../game/logic';

interface UpgradesPanelProps {
  state: GameState;
  onBuy: (upgradeId: string) => void;
}

function formatNumber(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return Math.floor(num).toString();
}

export function UpgradesPanel({ state, onBuy }: UpgradesPanelProps) {
  const upgrades = Object.values(state.upgrades).filter((upgrade) => {
    if (upgrade.purchased) return false;
    if (upgrade.prerequisite && !upgrade.prerequisite(state)) return false;
    return upgrade.visible;
  });

  const purchasedCount = Object.values(state.upgrades).filter(u => u.purchased).length;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
        <TrendingUp size={24} className="text-purple-400" />
        Upgrades
        {purchasedCount > 0 && (
          <span className="text-sm text-slate-500">({purchasedCount} purchased)</span>
        )}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {upgrades.map((upgrade) => {
          const cost = applyTraitModifiersToCost(upgrade.cost, 'upgrade', state);
          const canBuy = canAffordUpgrade(upgrade, state);

          const currencyColors: Record<string, string> = {
            sparks: 'text-yellow-400',
            flux: 'text-cyan-400',
            civilization: 'text-green-400',
            echoes: 'text-purple-400',
          };

          const currencyColor = currencyColors[upgrade.costCurrency] || 'text-slate-400';

          return (
            <button
              key={upgrade.id}
              onClick={() => onBuy(upgrade.id)}
              disabled={!canBuy}
              className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                canBuy
                  ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-purple-500/50 hover:scale-[1.02]'
                  : 'bg-slate-900/50 border-slate-700/50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-100 mb-1">{upgrade.name}</h3>
                  <p className="text-xs text-slate-400 mb-2">{upgrade.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className={`text-sm font-bold ${canBuy ? currencyColor : 'text-slate-500'}`}>
                    {formatNumber(cost)}
                  </div>
                  <div className="text-xs text-slate-500 capitalize">
                    {upgrade.costCurrency}
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {upgrades.length === 0 && (
          <div className="col-span-full text-center py-8 text-slate-500">
            <Lock size={32} className="mx-auto mb-2 opacity-50" />
            <p>All available upgrades purchased!</p>
          </div>
        )}
      </div>
    </div>
  );
}
