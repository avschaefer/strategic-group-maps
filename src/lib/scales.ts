import { scaleLinear } from 'd3-scale';

export const CHART_MARGIN = { top: 30, right: 30, bottom: 50, left: 60 };
export const RATING_MIN = 1;
export const RATING_MAX = 10;

export function createXScale(width: number) {
  return scaleLinear()
    .domain([RATING_MIN - 0.5, RATING_MAX + 0.5])
    .range([CHART_MARGIN.left, width - CHART_MARGIN.right]);
}

export function createYScale(height: number) {
  return scaleLinear()
    .domain([RATING_MIN - 0.5, RATING_MAX + 0.5])
    .range([height - CHART_MARGIN.bottom, CHART_MARGIN.top]);
}

export function clampRating(value: number): number {
  return Math.round(Math.min(RATING_MAX, Math.max(RATING_MIN, value)) * 2) / 2;
}
