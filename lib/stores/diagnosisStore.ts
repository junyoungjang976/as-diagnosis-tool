import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CheckResult {
  itemId: string;
  checked: boolean;
  hasProblem: boolean;
  note?: string;
}

export interface SelectedPart {
  partId: string;
  name: string;
  partNumber?: string | null;
  quantity: number;
  unitPrice: number;
  checklistItemId: string; // 어떤 체크리스트 항목에서 선택되었는지
}

export interface CustomerInfo {
  name?: string;
  contact?: string;
  email?: string;
  location?: string;
}

interface DiagnosisState {
  equipmentId: string | null;
  customerInfo: CustomerInfo;
  checkResults: CheckResult[];
  selectedParts: SelectedPart[];
  notes: string;
  lastAutoSave: Date | null;

  // Actions
  setEquipmentId: (id: string) => void;
  setCustomerInfo: (info: Partial<CustomerInfo>) => void;
  updateCheckResult: (itemId: string, data: Partial<CheckResult>) => void;
  addSelectedPart: (part: SelectedPart) => void;
  removeSelectedPart: (partId: string, checklistItemId: string) => void;
  updatePartQuantity: (partId: string, checklistItemId: string, quantity: number) => void;
  setNotes: (notes: string) => void;
  setLastAutoSave: (date: Date) => void;
  reset: () => void;

  // Computed
  getCheckedCount: () => number;
  getTotalCount: () => number;
  getProblemCount: () => number;
  getPartsTotal: () => number;
  getPartsByChecklistItem: (itemId: string) => SelectedPart[];
}

const initialState = {
  equipmentId: null,
  customerInfo: {},
  checkResults: [],
  selectedParts: [],
  notes: '',
  lastAutoSave: null,
};

export const useDiagnosisStore = create<DiagnosisState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setEquipmentId: (id) => set({ equipmentId: id }),

      setCustomerInfo: (info) =>
        set((state) => ({
          customerInfo: { ...state.customerInfo, ...info }
        })),

      updateCheckResult: (itemId, data) =>
        set((state) => {
          const existing = state.checkResults.find(r => r.itemId === itemId);
          if (existing) {
            return {
              checkResults: state.checkResults.map(r =>
                r.itemId === itemId ? { ...r, ...data } : r
              ),
            };
          } else {
            return {
              checkResults: [
                ...state.checkResults,
                { itemId, checked: false, hasProblem: false, ...data },
              ],
            };
          }
        }),

      addSelectedPart: (part) =>
        set((state) => {
          // 이미 같은 부품이 같은 체크리스트 항목에 추가되어 있는지 확인
          const existing = state.selectedParts.find(
            p => p.partId === part.partId && p.checklistItemId === part.checklistItemId
          );
          if (existing) {
            // 이미 있으면 수량만 증가
            return {
              selectedParts: state.selectedParts.map(p =>
                p.partId === part.partId && p.checklistItemId === part.checklistItemId
                  ? { ...p, quantity: p.quantity + part.quantity }
                  : p
              ),
            };
          } else {
            return {
              selectedParts: [...state.selectedParts, part],
            };
          }
        }),

      removeSelectedPart: (partId, checklistItemId) =>
        set((state) => ({
          selectedParts: state.selectedParts.filter(
            p => !(p.partId === partId && p.checklistItemId === checklistItemId)
          ),
        })),

      updatePartQuantity: (partId, checklistItemId, quantity) =>
        set((state) => ({
          selectedParts: state.selectedParts.map(p =>
            p.partId === partId && p.checklistItemId === checklistItemId
              ? { ...p, quantity }
              : p
          ),
        })),

      setNotes: (notes) => set({ notes }),

      setLastAutoSave: (date) => set({ lastAutoSave: date }),

      reset: () => set(initialState),

      getCheckedCount: () => {
        return get().checkResults.filter(r => r.checked).length;
      },

      getTotalCount: () => {
        return get().checkResults.length;
      },

      getProblemCount: () => {
        return get().checkResults.filter(r => r.hasProblem).length;
      },

      getPartsTotal: () => {
        return get().selectedParts.reduce(
          (total, part) => total + (part.quantity * part.unitPrice),
          0
        );
      },

      getPartsByChecklistItem: (itemId) => {
        return get().selectedParts.filter(p => p.checklistItemId === itemId);
      },
    }),
    {
      name: 'diagnosis-storage',
      partialize: (state) => ({
        equipmentId: state.equipmentId,
        customerInfo: state.customerInfo,
        checkResults: state.checkResults,
        selectedParts: state.selectedParts,
        notes: state.notes,
        lastAutoSave: state.lastAutoSave,
      }),
    }
  )
);
