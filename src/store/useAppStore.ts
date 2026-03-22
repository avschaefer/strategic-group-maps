import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Variable, Firm, StrategicMap } from '../types';
import { FIRM_COLORS } from '../constants/colors';

interface AppState {
  variables: Variable[];
  firms: Firm[];
  maps: StrategicMap[];

  addVariable: (name: string) => void;
  removeVariable: (id: string) => void;
  updateVariable: (id: string, name: string) => void;

  addFirm: (name: string) => void;
  removeFirm: (id: string) => void;
  updateFirm: (id: string, name: string) => void;

  createMap: (name: string, xVarId: string, yVarId: string) => void;
  deleteMap: (id: string) => void;
  updateRating: (mapId: string, firmId: string, x: number | null, y: number | null) => void;

  exportSession: () => string;
  importSession: (json: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      variables: [],
      firms: [],
      maps: [],

      addVariable: (name) =>
        set((s) => ({
          variables: [...s.variables, { id: nanoid(8), name }],
        })),

      removeVariable: (id) =>
        set((s) => ({
          variables: s.variables.filter((v) => v.id !== id),
          maps: s.maps.filter((m) => m.xVariableId !== id && m.yVariableId !== id),
        })),

      updateVariable: (id, name) =>
        set((s) => ({
          variables: s.variables.map((v) => (v.id === id ? { ...v, name } : v)),
        })),

      addFirm: (name) => {
        const { firms, maps } = get();
        const colorIndex = firms.length % FIRM_COLORS.length;
        const newFirm: Firm = {
          id: nanoid(8),
          name,
          color: FIRM_COLORS[colorIndex],
        };
        set({
          firms: [...firms, newFirm],
          maps: maps.map((m) => ({
            ...m,
            ratings: [...m.ratings, { firmId: newFirm.id, x: null, y: null }],
          })),
        });
      },

      removeFirm: (id) =>
        set((s) => ({
          firms: s.firms.filter((f) => f.id !== id),
          maps: s.maps.map((m) => ({
            ...m,
            ratings: m.ratings.filter((r) => r.firmId !== id),
          })),
        })),

      updateFirm: (id, name) =>
        set((s) => ({
          firms: s.firms.map((f) => (f.id === id ? { ...f, name } : f)),
        })),

      createMap: (name, xVarId, yVarId) => {
        const { firms } = get();
        const newMap: StrategicMap = {
          id: nanoid(8),
          name,
          xVariableId: xVarId,
          yVariableId: yVarId,
          ratings: firms.map((f) => ({ firmId: f.id, x: null, y: null })),
        };
        set((s) => ({ maps: [...s.maps, newMap] }));
      },

      deleteMap: (id) =>
        set((s) => ({ maps: s.maps.filter((m) => m.id !== id) })),

      updateRating: (mapId, firmId, x, y) =>
        set((s) => ({
          maps: s.maps.map((m) =>
            m.id === mapId
              ? {
                  ...m,
                  ratings: m.ratings.map((r) =>
                    r.firmId === firmId ? { ...r, x, y } : r
                  ),
                }
              : m
          ),
        })),

      exportSession: () => {
        const { variables, firms, maps } = get();
        return JSON.stringify({ variables, firms, maps }, null, 2);
      },

      importSession: (json) => {
        const data = JSON.parse(json);
        const variables = Array.isArray(data.variables) ? data.variables : [];
        const firms = Array.isArray(data.firms) ? data.firms : [];
        const maps = Array.isArray(data.maps) ? data.maps : [];
        set({ variables, firms, maps });
      },
    }),
    { name: 'strategic-group-maps' }
  )
);
