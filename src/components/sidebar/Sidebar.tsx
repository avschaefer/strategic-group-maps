import { VariableList } from './VariableList';
import { FirmList } from './FirmList';
import { SessionBackup } from './SessionBackup';

export function Sidebar() {
  return (
    <aside className="w-72 min-w-72 bg-[#f5f3ef] border-r border-[#e8e4dd] p-5 overflow-y-auto flex flex-col gap-8">
      <div>
        <h1 className="text-[15px] font-semibold text-[#3d3929] tracking-tight mb-0.5">Strategic Group Maps</h1>
        <p className="text-[11px] text-[#8c8475] tracking-wide uppercase">Competitive Landscape</p>
      </div>
      <VariableList />
      <div className="border-t border-[#e8e4dd]" />
      <FirmList />
      <div className="border-t border-[#e8e4dd] mt-auto" />
      <SessionBackup />
    </aside>
  );
}
