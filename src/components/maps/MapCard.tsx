import { useRef, useCallback } from 'react';
import type { StrategicMap } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { ScatterChart } from '../chart/ScatterChart';
import { RatingsTable } from '../table/RatingsTable';
import { exportChartAsPng } from '../../lib/exportPng';

interface MapCardProps {
  map: StrategicMap;
}

export function MapCard({ map }: MapCardProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const firms = useAppStore((s) => s.firms);
  const variables = useAppStore((s) => s.variables);
  const updateRating = useAppStore((s) => s.updateRating);
  const deleteMap = useAppStore((s) => s.deleteMap);

  const xVar = variables.find((v) => v.id === map.xVariableId);
  const yVar = variables.find((v) => v.id === map.yVariableId);

  const handleRatingChange = useCallback(
    (firmId: string, x: number | null, y: number | null) => {
      updateRating(map.id, firmId, x, y);
    },
    [map.id, updateRating]
  );

  const handleExport = async () => {
    if (chartRef.current) {
      await exportChartAsPng(chartRef.current, map.name.replace(/\s+/g, '-'));
    }
  };

  if (!xVar || !yVar) {
    return (
      <div className="bg-white rounded-2xl border border-[#e8e4dd] p-6">
        <p className="text-sm text-[#b5695a]">
          Missing variable(s) for this map. The referenced variables may have been deleted.
        </p>
        <button
          onClick={() => deleteMap(map.id)}
          className="mt-2 text-sm text-[#b5695a] hover:text-[#8b4a3a] underline"
        >
          Remove this map
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e8e4dd] shadow-[0_1px_3px_rgba(61,57,41,0.06)] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#f0ece6]">
        <h3 className="font-semibold text-[15px] text-[#3d3929] tracking-tight">{map.name}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3 py-1.5 text-[11px] font-medium text-[#3d3929] bg-[#f0ece6] rounded-lg hover:bg-[#e8e4dd] transition-colors"
          >
            Export PNG
          </button>
          <button
            onClick={() => deleteMap(map.id)}
            className="px-3 py-1.5 text-[11px] font-medium text-[#b5695a] hover:bg-[#fdf2ef] rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div ref={chartRef} className="p-5 flex-shrink-0">
          <ScatterChart
            firms={firms}
            ratings={map.ratings}
            xLabel={xVar.name}
            yLabel={yVar.name}
            onRatingChange={(firmId, x, y) => handleRatingChange(firmId, x, y)}
          />
        </div>
        <div className="flex-1 p-5 border-t lg:border-t-0 lg:border-l border-[#f0ece6] min-w-[280px]">
          <RatingsTable
            firms={firms}
            ratings={map.ratings}
            xLabel={xVar.name}
            yLabel={yVar.name}
            onRatingChange={handleRatingChange}
          />
        </div>
      </div>
    </div>
  );
}
