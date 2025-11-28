import { Clock, Zap, Activity, X } from 'lucide-react';

interface OfflineGainsModalProps {
  sparks: number;
  flux: number;
  civilization: number;
  timeAwaySeconds: number;
  onClose: () => void;
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${Math.floor(seconds)}s`;
  }
}

function formatNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return Math.floor(num).toString();
}

export function OfflineGainsModal({ sparks, flux, civilization, timeAwaySeconds, onClose }: OfflineGainsModalProps) {
  const hasGains = sparks > 0 || flux > 0 || civilization > 0;

  if (!hasGains) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock size={28} className="text-blue-400" />
            <h2 className="text-2xl font-bold text-slate-100">Welcome Back!</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-slate-400 text-center">
            While you were away for <span className="text-blue-400 font-semibold">{formatTime(timeAwaySeconds)}</span>, your forge generated:
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {sparks > 0 && (
            <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap size={20} className="text-yellow-400" />
                <span className="text-slate-300">Sparks</span>
              </div>
              <span className="text-xl font-bold text-yellow-400">+{formatNumber(sparks)}</span>
            </div>
          )}

          {flux > 0 && (
            <div className="flex items-center justify-between p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity size={20} className="text-cyan-400" />
                <span className="text-slate-300">Flux</span>
              </div>
              <span className="text-xl font-bold text-cyan-400">+{formatNumber(flux)}</span>
            </div>
          )}

          {civilization > 0 && (
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity size={20} className="text-green-400" />
                <span className="text-slate-300">Civilization</span>
              </div>
              <span className="text-xl font-bold text-green-400">+{formatNumber(civilization)}</span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-200"
        >
          Continue Forging
        </button>
      </div>
    </div>
  );
}
