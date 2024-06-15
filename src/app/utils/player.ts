import { Maze } from "./maze";


export class Player {
  constructor(private maze: Maze, private ctx: CanvasRenderingContext2D, private _cellSize: number, private onComplete: () => void, private sprite: HTMLImageElement | null) {
    sprite ? this.drawSprite = this.drawSpriteImg : this.drawSprite = this.drawSpriteCircle;
    this.drawSprite(this.maze.startCoord);
  }
  private readonly drawSprite!: (cellCoords: { x: number, y: number }) => void
  private readonly map = this.maze.map;
  readonly cellCoords = { x: this.maze.startCoord.x, y: this.maze.startCoord.y };
  private cellSize = this._cellSize;
  private readonly halfCellSize = this.cellSize / 2;

  private readonly offsetLeft = this.cellSize / 50;
  private readonly offsetRight = this.cellSize / 25;


  drawSpriteCircle(cellCoords: { x: number, y: number }) {
    const x = (cellCoords.x + 1) * this.cellSize - this.halfCellSize;
    const y = (cellCoords.y + 1) * this.cellSize - this.halfCellSize;
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.arc(x, y, this.halfCellSize - 2, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  drawSpriteImg(cellCoords: { x: number, y: number }) {
    if (!this.sprite) return;
    this.ctx.drawImage(
      this.sprite,
      0,
      0,
      this.sprite.width,
      this.sprite.height,
      cellCoords.x * this.cellSize + this.offsetLeft,
      cellCoords.y * this.cellSize + this.offsetLeft,
      this.cellSize - this.offsetRight,
      this.cellSize - this.offsetRight
    )
  }

  private checkWin() {
    if (this.cellCoords.x === this.maze.endCoord.x && this.cellCoords.y === this.maze.endCoord.y) {
      this.onComplete();
      this.removeSprite(this.cellCoords);
    }
  }

  removeSprite(cellCoords: { x: number, y: number }) {
    const cellSize = this.cellSize * 0.9;
    const z = this.cellSize - cellSize;
    this.ctx.clearRect(
      (cellCoords.x * this.cellSize + this.offsetLeft) + z / 2,
      (cellCoords.y * this.cellSize + this.offsetLeft) + z / 2,
      cellSize - this.offsetRight,
      cellSize - this.offsetRight);
  }
  check(e: KeyboardEvent) {
    const cell = this.map[this.cellCoords.x][this.cellCoords.y];
    this.removeSprite(this.cellCoords);
    if (e.key == "ArrowLeft" && cell.w == true) this.cellCoords.x--
    else if (e.key == "ArrowUp" && cell.n == true) this.cellCoords.y--
    else if (e.key == "ArrowRight" && cell.e == true) this.cellCoords.x++;
    else if (e.key == "ArrowDown" && cell.s == true) this.cellCoords.y++
    this.drawSprite(this.cellCoords);
    this.checkWin();
  }
}
