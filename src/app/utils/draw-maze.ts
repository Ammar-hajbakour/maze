import { Maze, _Map } from "./maze";

export class DrawMaze {

  constructor(private maze: Maze, private ctx: CanvasRenderingContext2D, private _cellSize: number, private endSprite: HTMLImageElement | null) {
    // this.ctx.lineWidth = this.cellSize / 40
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "#049a3b";

    endSprite ? this.drawEndMethod = this.drawEndSprite : this.drawEndMethod = this.drawEndFlag;

    this.clear();
    this.drawMap();
    this.drawEndMethod();

  }
  map = this.maze.map;
  cellSize = this._cellSize;
  drawEndMethod!: () => void

  redrawMaze(size: number) {
    this.cellSize = size
    // this.ctx.lineWidth = this.cellSize / 50;
    this.drawMap();
    this.drawEndMethod();
  }
  drawCell(xCoord: number, yCoord: number, cell: _Map) {
    const x = xCoord * this.cellSize;
    const y = yCoord * this.cellSize;

    // if (cell.visited) {
    //   this.ctx.fillStyle = "black";
    //   this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
    // }
    this.ctx.beginPath();
    if (!cell.n) {
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + this.cellSize, y);
    }

    if (!cell.e) {
      this.ctx.moveTo(x + this.cellSize, y);
      this.ctx.lineTo(x + this.cellSize, y + this.cellSize);
    }

    if (!cell.s) {
      this.ctx.moveTo(x, y + this.cellSize);
      this.ctx.lineTo(x + this.cellSize, y + this.cellSize);
    }

    if (!cell.w) {
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x, y + this.cellSize);
    }
    this.ctx.stroke();
  }
  drawMap() {
    for (let x = 0; x < this.map.length; x++) {
      for (let y = 0; y < this.map[x].length; y++) {
        this.drawCell(x, y, this.map[x][y]);
      }
    }
  }

  drawEndFlag() {
    const coord = this.maze.endCoord;
    const gridSize = 4;
    const fraction = this.cellSize / gridSize - 2;
    let colorSwap = true;
    for (let y = 0; y < gridSize; y++) {
      if (gridSize % 2 == 0) colorSwap = !colorSwap;
      for (let x = 0; x < gridSize; x++) {
        this.ctx.beginPath();
        this.ctx.rect(
          coord.x * this.cellSize + x * fraction + 4.5,
          coord.y * this.cellSize + y * fraction + 4.5,
          fraction,
          fraction
        );
        this.ctx.fillStyle = colorSwap ? "black" : "white";
        this.ctx.fill();
        colorSwap = !colorSwap;
      }
    }
  }

  drawEndSprite() {
    if (!this.endSprite) return;
    const offsetLeft = this.cellSize / 50;
    const offsetRight = this.cellSize / 25;
    const coord = this.maze.endCoord;
    this.ctx.drawImage(
      this.endSprite,
      1,
      1,
      this.endSprite.width,
      this.endSprite.height,
      coord.x * this.cellSize + offsetLeft,
      coord.y * this.cellSize + offsetLeft,
      this.cellSize - offsetRight,
      this.cellSize - offsetRight
    );
  }

  clear() {
    const canvasSize = this.cellSize * this.map.length;
    this.ctx.clearRect(0, 0, canvasSize, canvasSize);
  }
}
