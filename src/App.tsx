import { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { useGameLoop } from './hooks/useGameLoop';
import { Header } from './components/Header';
import { ResourcePanel } from './components/ResourcePanel';
import { ForgeButton } from './components/ForgeButton';
import { BuildingsPanel } from './components/BuildingsPanel';
import { UpgradesPanel } from './components/UpgradesPanel';
import { AchievementsPanel } from './components/AchievementsPanel';
import { TraitsDisplay } from './components/TraitsDisplay';
import { TraitDraftModal } from './components/TraitDraftModal';
import { CollapseModal } from './components/CollapseModal';
import { calculateClickPower } from './game/logic';

function GameContent() {
  const {
    state,
    user,
    clickForge,
    buyBuilding,
    buyUpgrade,
    collapseUniverse,
    selectTraits,
    isLoading,
  } = useGame();

  const [showTraitDraft, setShowTraitDraft] = useState(false);
  const [showCollapseModal, setShowCollapseModal] = useState(false);
  const [currentState, setCurrentState] = useState(state);

  useGameLoop(currentState, setCurrentState, isLoading);

  useEffect(() => {
    setCurrentState(state);
  }, [state]);

  useEffect(() => {
    if (!isLoading && currentState.activeTraits.length === 0 && currentState.runNumber === 0) {
      setShowTraitDraft(true);
    }
  }, [isLoading, currentState.activeTraits.length, currentState.runNumber]);

  const handleTraitSelect = (traitIds: string[]) => {
    selectTraits(traitIds);
    setShowTraitDraft(false);
  };

  const handleCollapseConfirm = async () => {
    await collapseUniverse();
    setShowCollapseModal(false);
    setShowTraitDraft(true);
  };

  const clickPower = calculateClickPower(currentState);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading the Cosmic Forge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header
        user={user}
        runNumber={currentState.runNumber}
        onCollapseClick={() => setShowCollapseModal(true)}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <ResourcePanel state={currentState} />

        {currentState.activeTraits.length > 0 && (
          <TraitsDisplay activeTraits={currentState.activeTraits} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col items-center">
            <ForgeButton onClick={clickForge} clickPower={clickPower} />

            {!user && (
              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-xl max-w-sm">
                <p className="text-sm text-blue-300 text-center">
                  Sign in to save your progress across devices and never lose your cosmic empire!
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-8">
            <BuildingsPanel state={currentState} onBuy={buyBuilding} />
            <UpgradesPanel state={currentState} onBuy={buyUpgrade} />
          </div>
        </div>

        <AchievementsPanel state={currentState} />

        <div className="text-center text-slate-600 text-sm py-8">
          <p>TimeForge: Echoes of Infinity</p>
          <p className="mt-1">
            A cosmic idle game where universes are your currency
          </p>
        </div>
      </main>

      {showTraitDraft && (
        <TraitDraftModal
          onSelect={handleTraitSelect}
          runNumber={currentState.runNumber}
        />
      )}

      {showCollapseModal && (
        <CollapseModal
          state={currentState}
          onConfirm={handleCollapseConfirm}
          onCancel={() => setShowCollapseModal(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
