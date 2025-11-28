import { Factory, Atom, FlaskConical, Globe2, Building2, Landmark } from 'lucide-react';
import { GameState } from '../types/game';
import { calculateBuildingProduction, applyTraitModifiersToCost } from '../game/logic';
import { getBuildingCost } from '../game/buildings';

interface BuildingsPanelProps {
  state: GameState;
  onBuy: (buildingId: string) => void;
}

const BUILDING_ICONS: Record<string, any> = {
  foundry: Factory,
  reactor: Atom,
  lab: FlaskConical,
  civilization: Globe2,
  world: Building2,
  megastructure: Landmark,
};

function formatNumber(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return Math.floor(num).toString();
}

export function BuildingsPanel({ state, onBuy }: BuildingsPanelProps) {
  const visibleBuildings = Object.values(state.buildings).filter(
    (building) => state.flux >= building.unlockedAt || building.count > 0
  );

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
        <Factory size={24} className="text-cyan-400" />
        Buildings
      </h2>

      <div className="space-y-2">
        {visibleBuildings.map((building) => {
          const Icon = BUILDING_ICONS[building.id] || Factory;
          const cost = applyTraitModifiersToCost(
            getBuildingCost(building),
            'building',
            state
          );
          const canBuy = state.sparks >= cost;
          const production = calculateBuildingProduction(building, state);

          return (
            <button
              key={building.id}
              onClick={() => onBuy(building.id)}
              disabled={!canBuy}
              className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
                canBuy
                  ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-slate-500 hover:scale-[1.02]'
                  : 'bg-slate-900/50 border-slate-700/50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                    <Icon size={24} className="text-cyan-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-100">{building.name}</h3>
                      {building.count > 0 && (
                        <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-xs rounded-full font-semibold">
                          {building.count}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{building.description}</p>

                    {building.count > 0 && (
                      <div className="text-sm text-green-400">
                        +{formatNumber(production)} {building.resourceProduced}/s
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className={`text-lg font-bold ${canBuy ? 'text-yellow-400' : 'text-slate-500'}`}>
                    {formatNumber(cost)}
                  </div>
                  <div className="text-xs text-slate-500">Sparks</div>
                </div>
              </div>
            </button>
          );
        })}

        {visibleBuildings.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <p>Earn more Flux to unlock buildings</p>
          </div>
        )}
      </div>
    </div>
  );
}
