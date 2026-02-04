import { create } from 'zustand';

export interface EstimatePart {
  partId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface LaborType {
  id: string;
  name: string;
  rate: number;
}

export interface TravelRate {
  id: string;
  distance: string;
  rate: number;
}

interface EstimateState {
  // 부품 목록
  parts: EstimatePart[];

  // 선택된 공임 유형들
  selectedLabor: LaborType[];

  // 선택된 출장비
  travelRate: TravelRate | null;

  // VAT 포함 여부
  includeVAT: boolean;

  // 비고
  notes: string;

  // Actions
  setParts: (parts: EstimatePart[]) => void;
  updatePartQuantity: (partId: string, quantity: number) => void;
  removePart: (partId: string) => void;

  toggleLabor: (labor: LaborType) => void;
  setSelectedLabor: (labor: LaborType[]) => void;

  setTravelRate: (rate: TravelRate | null) => void;

  toggleVAT: () => void;
  setIncludeVAT: (include: boolean) => void;

  setNotes: (notes: string) => void;

  reset: () => void;
}

const initialState = {
  parts: [],
  selectedLabor: [],
  travelRate: null,
  includeVAT: false,
  notes: '',
};

export const useEstimateStore = create<EstimateState>((set) => ({
  ...initialState,

  setParts: (parts) => set({ parts }),

  updatePartQuantity: (partId, quantity) =>
    set((state) => ({
      parts: state.parts.map((part) =>
        part.partId === partId ? { ...part, quantity } : part
      ),
    })),

  removePart: (partId) =>
    set((state) => ({
      parts: state.parts.filter((part) => part.partId !== partId),
    })),

  toggleLabor: (labor) =>
    set((state) => {
      const exists = state.selectedLabor.some((l) => l.id === labor.id);
      return {
        selectedLabor: exists
          ? state.selectedLabor.filter((l) => l.id !== labor.id)
          : [...state.selectedLabor, labor],
      };
    }),

  setSelectedLabor: (labor) => set({ selectedLabor: labor }),

  setTravelRate: (rate) => set({ travelRate: rate }),

  toggleVAT: () => set((state) => ({ includeVAT: !state.includeVAT })),

  setIncludeVAT: (include) => set({ includeVAT: include }),

  setNotes: (notes) => set({ notes }),

  reset: () => set(initialState),
}));
