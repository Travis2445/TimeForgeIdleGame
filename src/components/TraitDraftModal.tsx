import { useState, useEffect } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { TraitId } from '../types/game';
import { TRAITS } from '../game/traits';
import { getRandomTraits } from '../game/traits';

interface TraitDraftModalProps {
  onSelect: (traitIds: TraitId[]) => void;
  runNumber: number;
}

const RARITY_COLORS = {
  common: 'border-slate-500 bg-slate-500/10',
  uncommon: 'border-green-500 bg-green-500/10',
  rare: 'border-blue-500 bg-blue-500/10',
  mythic: 'border-purple-500 bg-purple-500/10',
};

const RARITY_TEXT_COLORS = {
  common: 'text-slate-400',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  mythic: 'text-purple-400',
};

export function TraitDraftModal({ onSelect, runNumber }: TraitDraftModalProps) {
  const [availableTraits, setAvailableTraits] = useState<TraitId[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<TraitId[]>([]);
  const maxSelection = 2;

  useEffect(() => {
    const traits = getRandomTraits(5);
    setAvailableTraits(traits);
  }, [runNumber]);

  const handleToggleTrait = (traitId: TraitId) => {
    if (selectedTraits.includes(traitId)) {
      setSelectedTraits(selectedTraits.filter((id) => id !== traitId));
    } else if (selectedTraits.length < maxSelection) {
      setSelectedTraits([...selectedTraits, traitId]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedTraits);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 max-w-4xl w-full border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles size={32} className="text-purple-400" />
            <h2 className="text-3xl font-bold text-slate-100">
              Universe #{runNumber + 1}
            </h2>
            <Sparkles size={32} className="text-purple-400" />
          </div>
          <p className="text-slate-400">
            Select up to {maxSelection} Universe Traits to shape reality
          </p>
          <div className="mt-2 text-sm text-slate-500">
            {selectedTraits.length} / {maxSelection} selected
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {availableTraits.map((traitId) => {
            const trait = TRAITS[traitId];
            const isSelected = selectedTraits.includes(traitId);
            const canSelect = selectedTraits.length < maxSelection || isSelected;

            return (
              <button
                key={traitId}
                onClick={() => handleToggleTrait(traitId)}
                disabled={!canSelect && !isSelected}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left relative ${
                  isSelected
                    ? `${RARITY_COLORS[trait.rarity]} ring-4 ring-white/20 scale-[1.02]`
                    : canSelect
                    ? `${RARITY_COLORS[trait.rarity]} hover:scale-[1.02] opacity-80 hover:opacity-100`
                    : 'bg-slate-900/50 border-slate-700 opacity-40 cursor-not-allowed'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Check size={20} className="text-slate-900" />
                  </div>
                )}

                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-100 text-lg">{trait.name}</h3>
                  </div>
                  <div className={`text-xs font-semibold uppercase ${RARITY_TEXT_COLORS[trait.rarity]}`}>
                    {trait.rarity}
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {trait.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => onSelect([])}
            className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl transition-all duration-200"
          >
            Skip Traits
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedTraits.length === 0}
            className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Begin Universe
          </button>
        </div>
      </div>
    </div>
  );
}
