import { useRef, useState, useCallback } from 'react';
import type { Firm, MapRating } from '../../types';
import { createXScale, createYScale, clampRating, CHART_MARGIN, RATING_MIN, RATING_MAX } from '../../lib/scales';

interface ScatterChartProps {
  firms: Firm[];
  ratings: MapRating[];
  xLabel: string;
  yLabel: string;
  onRatingChange: (firmId: string, x: number, y: number) => void;
}

const CHART_WIDTH = 560;
const CHART_HEIGHT = 480;
const BUBBLE_RADIUS = 28;

/** Truncate label to fit inside bubble */
function truncateLabel(name: string, maxChars = 7): string {
  return name.length > maxChars ? name.slice(0, maxChars - 1) + '…' : name;
}

export function ScatterChart({ firms, ratings, xLabel, yLabel, onRatingChange }: ScatterChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [dragState, setDragState] = useState<{
    firmId: string;
    px: number;
    py: number;
  } | null>(null);
  const dragRef = useRef(dragState);
  dragRef.current = dragState;

  const xScale = createXScale(CHART_WIDTH);
  const yScale = createYScale(CHART_HEIGHT);

  const ticks = Array.from({ length: RATING_MAX - RATING_MIN + 1 }, (_, i) => RATING_MIN + i);

  const commitDrag = useCallback(() => {
    const ds = dragRef.current;
    if (!ds) return;
    const newX = clampRating(xScale.invert(ds.px));
    const newY = clampRating(yScale.invert(ds.py));
    onRatingChange(ds.firmId, newX, newY);
    setDragState(null);
  }, [xScale, yScale, onRatingChange]);

  const handlePointerDown = useCallback((firmId: string, e: React.PointerEvent) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    const rect = svg.getBoundingClientRect();
    setDragState({
      firmId,
      px: e.clientX - rect.left,
      py: e.clientY - rect.top,
    });
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = Math.max(CHART_MARGIN.left, Math.min(CHART_WIDTH - CHART_MARGIN.right, e.clientX - rect.left));
    const py = Math.max(CHART_MARGIN.top, Math.min(CHART_HEIGHT - CHART_MARGIN.bottom, e.clientY - rect.top));
    setDragState((prev) => prev ? { ...prev, px, py } : null);
  }, []);

  const getFirmById = (id: string) => firms.find((f) => f.id === id);

  // Collect visible ratings for legend
  const visibleRatings = ratings.filter((r) => r.x !== null && r.y !== null && getFirmById(r.firmId));

  // Legend dimensions
  const legendItemH = 18;
  const legendPadding = 10;
  const legendWidth = 100;
  const legendHeight = visibleRatings.length * legendItemH + legendPadding * 2;
  const legendX = CHART_WIDTH - CHART_MARGIN.right - legendWidth - 8;
  const legendY = CHART_MARGIN.top + 8;

  return (
    <div className="relative">
      {/* Toggle buttons */}
      <div className="flex gap-1.5 mb-2">
        <button
          onClick={() => setShowLabels((v) => !v)}
          className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-colors ${
            showLabels
              ? 'bg-[#3d3929] text-[#faf9f7]'
              : 'bg-[#f0ece6] text-[#8c8475] hover:bg-[#e8e4dd]'
          }`}
        >
          Labels {showLabels ? 'On' : 'Off'}
        </button>
        <button
          onClick={() => setShowLegend((v) => !v)}
          className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-colors ${
            showLegend
              ? 'bg-[#3d3929] text-[#faf9f7]'
              : 'bg-[#f0ece6] text-[#8c8475] hover:bg-[#e8e4dd]'
          }`}
        >
          Legend {showLegend ? 'On' : 'Off'}
        </button>
      </div>

      <svg
        ref={svgRef}
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        className="select-none"
        onPointerMove={handlePointerMove}
        onPointerUp={commitDrag}
      >
        {/* Background */}
        <rect x={0} y={0} width={CHART_WIDTH} height={CHART_HEIGHT} fill="#faf9f7" rx={12} />

        {/* Grid lines — very subtle */}
        {ticks.map((t) => (
          <g key={`grid-${t}`}>
            <line
              x1={xScale(t)} y1={CHART_MARGIN.top}
              x2={xScale(t)} y2={CHART_HEIGHT - CHART_MARGIN.bottom}
              stroke="#e8e4dd" strokeWidth={0.5} strokeDasharray="2,4"
            />
            <line
              x1={CHART_MARGIN.left} y1={yScale(t)}
              x2={CHART_WIDTH - CHART_MARGIN.right} y2={yScale(t)}
              stroke="#e8e4dd" strokeWidth={0.5} strokeDasharray="2,4"
            />
          </g>
        ))}

        {/* Axes */}
        <line
          x1={CHART_MARGIN.left} y1={CHART_HEIGHT - CHART_MARGIN.bottom}
          x2={CHART_WIDTH - CHART_MARGIN.right} y2={CHART_HEIGHT - CHART_MARGIN.bottom}
          stroke="#8c8475" strokeWidth={1}
        />
        <line
          x1={CHART_MARGIN.left} y1={CHART_MARGIN.top}
          x2={CHART_MARGIN.left} y2={CHART_HEIGHT - CHART_MARGIN.bottom}
          stroke="#8c8475" strokeWidth={1}
        />

        {/* X-axis ticks and labels */}
        {ticks.map((t) => (
          <g key={`x-tick-${t}`}>
            <line
              x1={xScale(t)} y1={CHART_HEIGHT - CHART_MARGIN.bottom}
              x2={xScale(t)} y2={CHART_HEIGHT - CHART_MARGIN.bottom + 4}
              stroke="#8c8475" strokeWidth={0.75}
            />
            <text
              x={xScale(t)} y={CHART_HEIGHT - CHART_MARGIN.bottom + 17}
              textAnchor="middle" fontSize={10} fill="#8c8475" fontFamily="Inter, system-ui, sans-serif"
            >
              {t}
            </text>
          </g>
        ))}

        {/* Y-axis ticks and labels */}
        {ticks.map((t) => (
          <g key={`y-tick-${t}`}>
            <line
              x1={CHART_MARGIN.left - 4} y1={yScale(t)}
              x2={CHART_MARGIN.left} y2={yScale(t)}
              stroke="#8c8475" strokeWidth={0.75}
            />
            <text
              x={CHART_MARGIN.left - 9} y={yScale(t) + 3.5}
              textAnchor="end" fontSize={10} fill="#8c8475" fontFamily="Inter, system-ui, sans-serif"
            >
              {t}
            </text>
          </g>
        ))}

        {/* Axis labels */}
        <text
          x={CHART_WIDTH / 2} y={CHART_HEIGHT - 8}
          textAnchor="middle" fontSize={12} fontWeight={500} fill="#5a5345"
          fontFamily="Inter, system-ui, sans-serif" letterSpacing="0.02em"
        >
          {xLabel}
        </text>
        <text
          x={14} y={CHART_HEIGHT / 2}
          textAnchor="middle" fontSize={12} fontWeight={500} fill="#5a5345"
          fontFamily="Inter, system-ui, sans-serif" letterSpacing="0.02em"
          transform={`rotate(-90, 14, ${CHART_HEIGHT / 2})`}
        >
          {yLabel}
        </text>

        {/* Bubbles */}
        {ratings.map((r) => {
          if (r.x === null || r.y === null) return null;
          const firm = getFirmById(r.firmId);
          if (!firm) return null;

          const isDragging = dragState?.firmId === r.firmId;
          const cx = isDragging ? dragState.px : xScale(r.x);
          const cy = isDragging ? dragState.py : yScale(r.y);
          const transitionStyle = isDragging ? 'none' : 'cx 0.25s ease, cy 0.25s ease';

          return (
            <g key={r.firmId} style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
              {/* Shadow */}
              <circle
                cx={cx + 1}
                cy={cy + 2}
                r={BUBBLE_RADIUS}
                fill="rgba(61,57,41,0.08)"
                pointerEvents="none"
                style={{ transition: transitionStyle }}
              />
              <circle
                cx={cx}
                cy={cy}
                r={BUBBLE_RADIUS}
                fill={firm.color}
                fillOpacity={isDragging ? 0.95 : 0.85}
                stroke={isDragging ? '#3d3929' : 'rgba(255,255,255,0.6)'}
                strokeWidth={isDragging ? 2 : 1.5}
                onPointerDown={(e) => handlePointerDown(r.firmId, e)}
                style={{ transition: transitionStyle }}
              />
              {/* Label inside bubble */}
              {showLabels && !isDragging && (
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={600}
                  fill="#fff"
                  fontFamily="Inter, system-ui, sans-serif"
                  pointerEvents="none"
                  style={{ transition: 'x 0.25s ease, y 0.25s ease' }}
                >
                  {truncateLabel(firm.name)}
                </text>
              )}
              {/* Drag coordinate readout */}
              {isDragging && (
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={600}
                  fill="#fff"
                  fontFamily="Inter, system-ui, sans-serif"
                  pointerEvents="none"
                >
                  {clampRating(xScale.invert(cx)).toFixed(1)}, {clampRating(yScale.invert(cy)).toFixed(1)}
                </text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        {showLegend && visibleRatings.length > 0 && (
          <g>
            <rect
              x={legendX}
              y={legendY}
              width={legendWidth}
              height={legendHeight}
              fill="rgba(250,249,247,0.92)"
              stroke="#e8e4dd"
              strokeWidth={0.75}
              rx={6}
            />
            {visibleRatings.map((r, i) => {
              const firm = getFirmById(r.firmId);
              if (!firm) return null;
              const itemY = legendY + legendPadding + i * legendItemH + legendItemH / 2;
              return (
                <g key={r.firmId}>
                  <circle
                    cx={legendX + 16}
                    cy={itemY}
                    r={5}
                    fill={firm.color}
                    fillOpacity={0.85}
                  />
                  <text
                    x={legendX + 26}
                    y={itemY + 3.5}
                    fontSize={10}
                    fill="#3d3929"
                    fontFamily="Inter, system-ui, sans-serif"
                    fontWeight={400}
                  >
                    {firm.name}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
