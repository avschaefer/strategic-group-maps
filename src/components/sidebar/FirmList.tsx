import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export function FirmList() {
  const firms = useAppStore((s) => s.firms);
  const addFirm = useAppStore((s) => s.addFirm);
  const removeFirm = useAppStore((s) => s.removeFirm);
  const updateFirm = useAppStore((s) => s.updateFirm);
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const name = input.trim();
    if (!name) return;
    if (firms.length >= 15) return;
    addFirm(name);
    setInput('');
  };

  return (
    <section>
      <h2 className="text-[11px] font-medium text-[#8c8475] uppercase tracking-wider mb-2.5">
        Firms ({firms.length}/15)
      </h2>
      <div className="flex gap-1.5 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="e.g. Apple, Samsung..."
          className="flex-1 min-w-0 px-2.5 py-1.5 text-[13px] border border-[#ddd8cf] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#c0785c]/40 focus:border-[#c0785c]/50 bg-white text-[#3d3929] placeholder:text-[#b8b0a2]"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim() || firms.length >= 15}
          className="px-3 py-1.5 text-[12px] font-medium bg-[#3d3929] text-[#faf9f7] rounded-lg hover:bg-[#2c2a1f] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Add
        </button>
      </div>
      <ul className="space-y-0.5">
        {firms.map((f) => (
          <li key={f.id} className="flex items-center gap-2 group">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: f.color }}
            />
            <input
              type="text"
              value={f.name}
              onChange={(e) => updateFirm(f.id, e.target.value)}
              className="flex-1 min-w-0 px-2 py-1 text-[13px] border border-transparent hover:border-[#ddd8cf] focus:border-[#c0785c]/50 rounded-md bg-transparent focus:bg-white focus:outline-none text-[#3d3929]"
            />
            <button
              onClick={() => removeFirm(f.id)}
              className="opacity-0 group-hover:opacity-100 text-[#b8b0a2] hover:text-[#b5695a] text-sm px-1 transition-opacity"
              title="Remove firm"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
