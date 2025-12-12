import type { Inventory as InventoryType } from "../types/game";
import KeySprite from "../assets/sprites/Key/keys_1_1.png";

interface InventoryProps {
  inventory: InventoryType;
}

const SLOT_SIZE = 48;
const MAX_SLOTS = 9;

export function Inventory({ inventory }: InventoryProps) {
  const { keys, weapon, items } = inventory;

  // Combine all items into slots
  const slots: Array<{ type: "key" | "weapon" | "item"; data: any }> = [];

  keys.forEach(color => slots.push({ type: "key", data: color }));
  if (weapon) slots.push({ type: "weapon", data: weapon });
  items.forEach(item => slots.push({ type: "item", data: item }));

  // Fill remaining slots with empty
  while (slots.length < MAX_SLOTS) {
    slots.push({ type: "item", data: null });
  }

  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10">
      <div className="bg-gray-800 border-4 border-gray-600 p-2">
        <div className="flex flex-col gap-1">
          {slots.map((slot, idx) => (
            <div
              key={idx}
              className="relative bg-gray-900 border-2 border-gray-700 overflow-hidden"
              style={{
                width: `${SLOT_SIZE}px`,
                height: `${SLOT_SIZE}px`,
                boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1)",
              }}
            >
              {slot.data && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {slot.type === "key" && (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div
                        className="absolute inset-0 blur-md"
                        style={{
                          backgroundColor: slot.data === "red" ? "#dc2626" : slot.data === "blue" ? "#2563eb" : slot.data === "green" ? "#16a34a" : slot.data === "yellow" ? "#eab308" : "#6b7280",
                          opacity: 0.4,
                        }}
                      />
                      <img
                        src={KeySprite}
                        alt="Key"
                        className="relative z-10"
                        style={{
                          width: "32px",
                          height: "32px",
                          imageRendering: "pixelated",
                        }}
                      />
                    </div>
                  )}
                  {slot.type === "weapon" && (
                    <div className="flex items-center justify-center w-full h-full p-2">
                      <span className="text-white text-xs text-center uppercase">
                        {slot.data.name}
                      </span>
                    </div>
                  )}
                  {slot.type === "item" && (
                    <div className="flex items-center justify-center w-full h-full p-2">
                      <span className="text-white text-xs text-center uppercase">
                        {slot.data.name}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
