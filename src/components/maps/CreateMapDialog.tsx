import { useState } from 'react';
import type { Variable } from '../../types';

interface CreateMapDialogProps {
  variables: Variable[];
  onClose: () => void;
  onCreate: (name: string, xVarId: string, yVarId: string) => void;
}

export function CreateMapDialog({ variables, onClose, onCreate }: CreateMapDialogProps) {
  const [name, setName] = useState('');
  const [xVarId, setXVarId] = useState(variables[0]?.id ?? '');
  const [yVarId, setYVarId] = useState(variables[1]?.id ?? '');

  const canCreate = name.trim() && xVarId && yVarId && xVarId !== yVarId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) return;
    onCreate(name.trim(), xVarId, yVarId);
  };

  return (
    <div className="fixed inset-0 bg-[#3d3929]/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(61,57,41,0.12)] p-7 w-full max-w-md border border-[#e8e4dd]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[17px] font-semibold text-[#3d3929] mb-5 tracking-tight">New Map</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-medium text-[#8c8475] uppercase tracking-wider mb-1.5">Map Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Price vs Quality"
              autoFocus
              className="w-full px-3 py-2.5 border border-[#ddd8cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#c0785c]/40 focus:border-[#c0785c]/50 text-[13px] text-[#3d3929] placeholder:text-[#b8b0a2]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-[#8c8475] uppercase tracking-wider mb-1.5">X-Axis</label>
              <select
                value={xVarId}
                onChange={(e) => setXVarId(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#ddd8cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#c0785c]/40 focus:border-[#c0785c]/50 text-[13px] bg-white text-[#3d3929]"
              >
                {variables.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#8c8475] uppercase tracking-wider mb-1.5">Y-Axis</label>
              <select
                value={yVarId}
                onChange={(e) => setYVarId(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#ddd8cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#c0785c]/40 focus:border-[#c0785c]/50 text-[13px] bg-white text-[#3d3929]"
              >
                {variables.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>
          {xVarId === yVarId && xVarId && (
            <p className="text-[12px] text-[#b5695a]">X and Y variables must be different.</p>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] text-[#8c8475] hover:bg-[#f0ece6] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canCreate}
              className="px-5 py-2 text-[13px] font-medium bg-[#3d3929] text-[#faf9f7] rounded-xl hover:bg-[#2c2a1f] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
