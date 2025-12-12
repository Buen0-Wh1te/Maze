import { useState, useEffect } from "react";
import { TILE_SIZE, GAME_LAYOUT } from "../constants/config";

export function useGridScaling(tiles: any[][]) {
  const [gridScale, setGridScale] = useState(1);

  useEffect(() => {
    if (tiles.length > 0) {
      const calculateScale = () => {
        const gridWidth = tiles[0].length * TILE_SIZE;
        const gridHeight = tiles.length * TILE_SIZE;
        const maxWidth = window.innerWidth * GAME_LAYOUT.SCREEN_WIDTH_RATIO;
        const maxHeight = window.innerHeight - GAME_LAYOUT.HEADER_FOOTER_HEIGHT;

        const scaleX = maxWidth / gridWidth;
        const scaleY = maxHeight / gridHeight;
        const scale = Math.min(scaleX, scaleY, GAME_LAYOUT.MAX_SCALE);

        const deviceRatio = Math.max(1, Math.round(window.devicePixelRatio || 1));
        const snappedScale =
            scale > 1 ? Math.min(scale, Math.floor(scale * deviceRatio) / deviceRatio) : scale;

        setGridScale(snappedScale);
      };

      calculateScale();
      window.addEventListener("resize", calculateScale);
      return () => window.removeEventListener("resize", calculateScale);
    }
  }, [tiles]);

  return gridScale;
}
