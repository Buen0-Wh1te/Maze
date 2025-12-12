import { useState, useCallback } from "react";
import type { Inventory, Item } from "../types/game";

export function useInventory() {
  const [inventory, setInventory] = useState<Inventory>({
    keys: [],
    weapon: null,
    items: [],
  });

  const addKey = useCallback((color: string) => {
    setInventory((prev) => ({
      ...prev,
      keys: [...prev.keys, color],
    }));
  }, []);

  const hasKey = useCallback(
    (color: string) => {
      return inventory.keys.includes(color);
    },
    [inventory.keys]
  );

  const setWeapon = useCallback((weapon: Item) => {
    setInventory((prev) => ({
      ...prev,
      weapon,
    }));
  }, []);

  const hasWeapon = useCallback(() => {
    return inventory.weapon !== null;
  }, [inventory.weapon]);

  const addItem = useCallback((item: Item) => {
    setInventory((prev) => ({
      ...prev,
      items: [...prev.items, item],
    }));
  }, []);

  const hasItem = useCallback(
    (itemId: string) => {
      return inventory.items.some((item) => item.id === itemId);
    },
    [inventory.items]
  );

  return {
    inventory,
    addKey,
    hasKey,
    setWeapon,
    hasWeapon,
    addItem,
    hasItem,
  };
}
