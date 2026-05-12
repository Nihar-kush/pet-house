import { useMemo, useState, type ReactNode } from "react";
import { SelectionContext } from "./selectionContext";

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Most reads are membership checks, so keep the array for order and a Set for lookup speed.
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const value = useMemo(
    () => ({
      selectedIds,
      selectedCount: selectedIds.length,
      isSelected: (id: string) => selectedIdSet.has(id),
      toggleSelection: (id: string) => {
        setSelectedIds((currentIds) =>
          currentIds.includes(id)
            ? currentIds.filter((currentId) => currentId !== id)
            : [...currentIds, id],
        );
      },
      selectMany: (ids: string[]) => {
        setSelectedIds((currentIds) => {
          const nextIds = new Set(currentIds);
          ids.forEach((id) => nextIds.add(id));
          return [...nextIds];
        });
      },
      clearSelection: () => setSelectedIds([]),
    }),
    [selectedIdSet, selectedIds],
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}
