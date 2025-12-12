import type { Inventory as InventoryType } from "../types/game";

interface InventoryProps {
  inventory: InventoryType;
}

export function Inventory({ inventory }: InventoryProps) {
  const { keys, weapon, items } = inventory;

  return (
    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-4 py-3 rounded-lg z-10">
      <h3 className="text-white font-bold text-sm mb-2">Inventory</h3>

      <div className="flex flex-col gap-2 text-xs">
        {/* Keys */}
        {keys.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Keys:</span>
            <div className="flex gap-1">
              {keys.map((color, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded text-white font-bold"
                  style={{
                    backgroundColor: color === "red" ? "#dc2626" : color === "blue" ? "#2563eb" : "#6b7280"
                  }}
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Weapon */}
        {weapon && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Weapon:</span>
            <span className="text-purple-400 font-bold">{weapon.name}</span>
          </div>
        )}

        {/* Items */}
        {items.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Items:</span>
            <div className="flex gap-1 flex-wrap">
              {items.map((item, idx) => (
                <span key={idx} className="text-yellow-400 text-xs">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {keys.length === 0 && !weapon && items.length === 0 && (
          <span className="text-gray-500 text-xs italic">Empty</span>
        )}
      </div>
    </div>
  );
}
