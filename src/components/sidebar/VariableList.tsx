import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export function VariableList() {
  const variables = useAppStore((s) => s.variables);
  const addVariable = useAppStore((s) => s.addVariable);
  const removeVariable = useAppStore((s) => s.removeVariable);
  const updateVariable = useAppStore((s) => s.updateVariable);
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const name = input.trim();
    if (!name) return;
    addVariable(name);
    setInput('');
  };

  return (
    <section>
      <h2 className="text-[11px] font-medium text-[#8c8475] uppercase tracking-wider mb-2.5">
        Variables ({variables.length})
      </h2>
      <div className="flex gap-1.5 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="e.g. Price, Quality..."
          className="flex-1 min-w-0 px-2.5 py-1.5 text-[13px] border border-[#ddd8cf] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#c0785c]/40 focus:border-[#c0785c]/50 bg-white text-[#3d3929] placeholder:text-[#b8b0a2]"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="px-3 py-1.5 text-[12px] font-medium bg-[#3d3929] text-[#faf9f7] rounded-lg hover:bg-[#2c2a1f] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Add
        </button>
      </div>
      <ul className="space-y-0.5">
        {variables.map((v) => (
          <li key={v.id} className="flex items-center gap-1 group">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c0785c] shrink-0" />
            <input
              type="text"
              value={v.name}
              onChange={(e) => updateVariable(v.id, e.target.value)}
              className="flex-1 min-w-0 px-2 py-1 text-[13px] border border-transparent hover:border-[#ddd8cf] focus:border-[#c0785c]/50 rounded-md bg-transparent focus:bg-white focus:outline-none text-[#3d3929]"
            />
            <button
              onClick={() => removeVariable(v.id)}
              className="opacity-0 group-hover:opacity-100 text-[#b8b0a2] hover:text-[#b5695a] text-sm px-1 transition-opacity"
              title="Remove variable"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
