import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MapCard } from './MapCard';
import { CreateMapDialog } from './CreateMapDialog';

export function MapsPage() {
  const maps = useAppStore((s) => s.maps);
  const variables = useAppStore((s) => s.variables);
  const firms = useAppStore((s) => s.firms);
  const createMap = useAppStore((s) => s.createMap);
  const [showDialog, setShowDialog] = useState(false);

  const canCreate = variables.length >= 2 && firms.length >= 1;

  return (
    <main className="flex-1 p-8 overflow-y-auto bg-[#faf9f7]">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#3d3929] tracking-tight">Maps</h2>
        <p className="text-[13px] text-[#8c8475] mt-0.5 mb-3">
          {maps.length === 0
            ? 'Create your first strategic group map'
            : `${maps.length} map${maps.length > 1 ? 's' : ''}`}
        </p>
        <button
          onClick={() => setShowDialog(true)}
          disabled={!canCreate}
          title={
            !canCreate
              ? 'Add at least 2 variables and 1 firm to create a map'
              : undefined
          }
          className="px-4 py-2 text-[13px] bg-[#3d3929] text-[#faf9f7] rounded-lg hover:bg-[#2c2a1f] disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
        >
          + New Map
        </button>
      </div>

      {!canCreate && maps.length === 0 && (
        <div className="text-center py-20 text-[#b8b0a2]">
          <p className="text-base mb-1">No maps yet</p>
          <p className="text-[13px]">
            Add at least <span className="text-[#3d3929] font-medium">2 variables</span> and <span className="text-[#3d3929] font-medium">1 firm</span> in the sidebar to get started.
          </p>
        </div>
      )}

      <div className="space-y-8">
        {maps.map((m) => (
          <MapCard key={m.id} map={m} />
        ))}
      </div>

      {showDialog && (
        <CreateMapDialog
          variables={variables}
          onClose={() => setShowDialog(false)}
          onCreate={(name, xId, yId) => {
            createMap(name, xId, yId);
            setShowDialog(false);
          }}
        />
      )}
    </main>
  );
}
