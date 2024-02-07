type UseData = () => {
  status: "loading" | "ready";
  items: string[];
  update: () => void;
  canAdd: boolean;
}

export type { UseData }