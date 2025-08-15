export interface Brick {
  x: number;
  y: number;
  status: number;
}

export interface BrickLayout {
  rowCount: number;
  columnCount: number;
  width: number;
  height: number;
  padding: number;
  offsetTop: number;
  offsetLeft: number;
}

export const brickSettings: BrickLayout = {
  rowCount: 5,
  columnCount: 7,
  width: 100,
  height: 20,
  padding: 10,
  offsetTop: 30,
  offsetLeft: 35,
};

export default function createBricks(layout = brickSettings): Brick[][] {
  const bricks: Brick[][] = [];
  for (let c = 0; c < layout.columnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < layout.rowCount; r++) {
      const x = c * (layout.width + layout.padding) + layout.offsetLeft;
      const y = r * (layout.height + layout.padding) + layout.offsetTop;
      bricks[c][r] = { x, y, status: 1 };
    }
  }
  return bricks;
}
