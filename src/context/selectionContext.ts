import { createContext, useContext } from "react";

export type SelectionContextValue = {
  selectedIds: string[];
  selectedCount: number;
  isSelected: (id: string) => boolean;
  toggleSelection: (id: string) => void;
  selectMany: (ids: string[]) => void;
  clearSelection: () => void;
};

export const SelectionContext = createContext<SelectionContextValue | undefined>(
  undefined,
);

export function useSelection() {
  const context = useContext(SelectionContext);

  if (!context) {
    throw new Error("useSelection must be used within SelectionProvider");
  }

  return context;
}
