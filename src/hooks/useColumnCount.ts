import { useEffect, useState } from "react";

function getColumnCount() {
  if (typeof window === "undefined") {
    return 4;
  }

  if (window.innerWidth <= 620) {
    return 1;
  }

  if (window.innerWidth <= 1024) {
    return 2;
  }

  return 4;
}

export function useColumnCount() {
  const [columns, setColumns] = useState(getColumnCount);

  useEffect(() => {
    const updateColumns = () => {
      const nextColumnCount = getColumnCount();
      setColumns((currentColumnCount) =>
        currentColumnCount === nextColumnCount
          ? currentColumnCount
          : nextColumnCount,
      );
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);

    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  return columns;
}
