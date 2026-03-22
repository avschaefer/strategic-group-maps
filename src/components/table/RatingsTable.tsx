import type { Firm, MapRating } from '../../types';

interface RatingsTableProps {
  firms: Firm[];
  ratings: MapRating[];
  xLabel: string;
  yLabel: string;
  onRatingChange: (firmId: string, x: number | null, y: number | null) => void;
}

export function RatingsTable({ firms, ratings, xLabel, yLabel, onRatingChange }: RatingsTableProps) {
  const parseRating = (value: string): number | null => {
    if (value === '') return null;
    const num = parseFloat(value);
    if (isNaN(num)) return null;
    return Math.min(10, Math.max(1, num));
  };

  const getRating = (firmId: string) => ratings.find((r) => r.firmId === firmId);

  return (
    <div className="overflow-auto">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr>
            <th className="text-left px-3 py-2.5 font-medium text-[#8c8475] text-[11px] uppercase tracking-wider border-b border-[#e8e4dd]">
              Firm
            </th>
            <th className="text-center px-3 py-2.5 font-medium text-[#8c8475] text-[11px] uppercase tracking-wider border-b border-[#e8e4dd] min-w-[80px]">
              {xLabel}
            </th>
            <th className="text-center px-3 py-2.5 font-medium text-[#8c8475] text-[11px] uppercase tracking-wider border-b border-[#e8e4dd] min-w-[80px]">
              {yLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {firms.map((firm) => {
            const rating = getRating(firm.id);
            return (
              <tr key={firm.id} className="border-b border-[#f0ece6] hover:bg-[#faf9f7] transition-colors">
                <td className="px-3 py-2 flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: firm.color }}
                  />
                  <span className="text-[#3d3929] truncate">{firm.name}</span>
                </td>
                <td className="px-1.5 py-1.5 text-center">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    step={0.5}
                    value={rating?.x ?? ''}
                    onChange={(e) => {
                      const x = parseRating(e.target.value);
                      onRatingChange(firm.id, x, rating?.y ?? null);
                    }}
                    placeholder="-"
                    className="w-14 px-2 py-1.5 text-center text-[13px] border border-[#e8e4dd] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#c0785c]/40 focus:border-[#c0785c]/50 bg-white text-[#3d3929] placeholder:text-[#ccc5b8]"
                  />
                </td>
                <td className="px-1.5 py-1.5 text-center">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    step={0.5}
                    value={rating?.y ?? ''}
                    onChange={(e) => {
                      const y = parseRating(e.target.value);
                      onRatingChange(firm.id, rating?.x ?? null, y);
                    }}
                    placeholder="-"
                    className="w-14 px-2 py-1.5 text-center text-[13px] border border-[#e8e4dd] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#c0785c]/40 focus:border-[#c0785c]/50 bg-white text-[#3d3929] placeholder:text-[#ccc5b8]"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
