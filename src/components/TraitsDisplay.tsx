import { Sparkles } from 'lucide-react';
import { TraitId } from '../types/game';
import { TRAITS } from '../game/traits';

interface TraitsDisplayProps {
  activeTraits: TraitId[];
}

const RARITY_COLORS = {
  common: 'text-slate-400 border-slate-500/30 bg-slate-500/10',
  uncommon: 'text-green-400 border-green-500/30 bg-green-500/10',
  rare: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  mythic: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
};

export function TraitsDisplay({ activeTraits }: TraitsDisplayProps) {
  if (activeTraits.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
        <Sparkles size={24} className="text-purple-400" />
        Active Universe Traits
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeTraits.map((traitId) => {
          const trait = TRAITS[traitId];
          if (!trait) return null;

          return (
            <div
              key={traitId}
              className={`p-4 rounded-xl border ${RARITY_COLORS[trait.rarity]}`}
            >
              <div className="flex items-start gap-3">
                <Sparkles size={20} className={RARITY_COLORS[trait.rarity].split(' ')[0]} />
                <div>
                  <h3 className="font-bold text-slate-100 mb-1">{trait.name}</h3>
                  <p className="text-sm text-slate-400">{trait.description}</p>
                  <div className={`text-xs font-semibold uppercase mt-2 ${RARITY_COLORS[trait.rarity].split(' ')[0]}`}>
                    {trait.rarity}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
