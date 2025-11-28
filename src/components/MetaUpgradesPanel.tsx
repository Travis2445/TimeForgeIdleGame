import { Zap, Clock, Sparkles, Lock } from 'lucide-react';
import { GameState } from '../types/game';
import { META_UPGRADES, getMetaUpgradeCost, canAffordMetaUpgrade, isMetaUpgradeUnlocked, MetaUpgradeColumn } from '../game/content/metaUpgrades';

interface MetaUpgradesPanelProps {
  state: GameState;
  onPurchase: (upgradeId: string) => void;
}

const COLUMN_INFO = {
  power: { name: 'Power', icon: Zap, color: 'text-orange-400', borderColor: 'border-orange-500/30', bgColor: 'bg-orange-500/10' },
  tempo: { name: 'Tempo', icon: Clock, color: 'text-blue-400', borderColor: 'border-blue-500/30', bgColor: 'bg-blue-500/10' },
  weirdness: { name: 'Weirdness', icon: Sparkles, color: 'text-purple-400', borderColor: 'border-purple-500/30', bgColor: 'bg-purple-500/10' },
};

function formatNumber(num: number): string {
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return Math.floor(num).toString();
}

export function MetaUpgradesPanel({ state, onPurchase }: MetaUpgradesPanelProps) {
  const columns: MetaUpgradeColumn[] = ['power', 'tempo', 'weirdness'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-200">Forge Upgrades</h2>
        <div className="text-right">
          <div className="text-sm text-slate-400">Echo Crystals</div>
          <div className="text-2xl font-bold text-purple-400">{formatNumber(state.echoes)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => {
          const info = COLUMN_INFO[column];
          const Icon = info.icon;
          const upgrades = Object.values(META_UPGRADES)
            .filter((u) => u.column === column)
            .sort((a, b) => a.tier - b.tier);

          return (
            <div key={column} className="space-y-2">
              <div className={`flex items-center gap-2 pb-2 border-b ${info.borderColor}`}>
                <Icon size={20} className={info.color} />
                <span className={`font-bold ${info.color}`}>{info.name}</span>
              </div>

              {upgrades.map((upgrade) => {
                const currentLevel = state.metaUpgrades[upgrade.id] || 0;
                const isMaxed = currentLevel >= upgrade.maxLevel;
                const isUnlocked = isMetaUpgradeUnlocked(upgrade, state.metaUpgrades);
                const canAfford = canAffordMetaUpgrade(upgrade, currentLevel, state.echoes);
                const cost = getMetaUpgradeCost(upgrade, currentLevel);

                return (
                  <button
                    key={upgrade.id}
                    onClick={() => onPurchase(upgrade.id)}
                    disabled={!canAfford || isMaxed || !isUnlocked}
                    className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                      !isUnlocked
                        ? 'bg-slate-900/30 border-slate-800 opacity-40'
                        : isMaxed
                        ? `${info.bgColor} ${info.borderColor} opacity-60`
                        : canAfford
                        ? `${info.bgColor} ${info.borderColor} hover:scale-[1.02]`
                        : 'bg-slate-900/50 border-slate-700 opacity-60'
                    }`}
                  >
                    {!isUnlocked && (
                      <div className="absolute top-2 right-2">
                        <Lock size={16} className="text-slate-600" />
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-100 text-sm">{upgrade.name}</h3>
                          {currentLevel > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${info.bgColor} ${info.color}`}>
                              Lv.{currentLevel}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mb-2">{upgrade.description}</p>

                        {!isMaxed && (
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${canAfford ? 'text-purple-400' : 'text-slate-500'}`}>
                              {formatNumber(cost)}
                            </span>
                            <span className="text-xs text-slate-500">Echoes</span>
                          </div>
                        )}

                        {isMaxed && (
                          <div className="text-xs text-green-400 font-semibold">MAX</div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
