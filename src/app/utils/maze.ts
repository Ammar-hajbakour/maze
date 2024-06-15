import { rand } from "./functions/rand";
import { shuffle } from "./functions/shuffle";

export type _Map = {
  n: boolean,
  e: boolean, s: boolean,
  w: boolean,
  visited: boolean,
  priorPos: null | { x: number; y: number; },

  [key: string]: any
}
type ModDir = {
  n: { x: number; y: number; o: string; };
  e: { x: number; y: number; o: string; };
  s: { x: number; y: number; o: string; };
  w: { x: number; y: number; o: string; };
  [key: string]: { x: number; y: number; o: string; };
};
export class Maze {
  constructor(
    private readonly width: number,
    private readonly height: number
  ) {
    this.genMap();
    this.defineStartEnd();
    this.defineMaze();
  }
  private _map: _Map[][] = [];
  public get map(): _Map[][] {
    return this._map;
  }
  public set map(value: _Map[][]) {
    this._map = value;
  }
  private readonly dirs = ["n", "s", "e", "w"];
  private readonly modDir = {
    n: { x: 0, y: -1, o: "s" },
    e: { x: 1, y: 0, o: "w" },
    s: { x: 0, y: 1, o: "n" },
    w: { x: -1, y: 0, o: "e" }
  } as ModDir
  private _startCoord!: { x: number, y: number };
  public get startCoord(): { x: number, y: number } {
    return this._startCoord;
  }
  public set startCoord(value: { x: number, y: number }) {
    this._startCoord = value;
  }
  private _endCoord!: { x: number, y: number };
  public get endCoord(): { x: number, y: number } {
    return this._endCoord;
  }
  public set endCoord(value: { x: number, y: number }) {
    this._endCoord = value;
  }

  genMap() {
    this.map = new Array(this.height)
    for (let y = 0; y < this.height; y++) {
      this.map[y] = new Array(this.width)
      for (let x = 0; x < this.width; x++) {
        this.map[y][x] = {
          n: false,
          e: false,
          s: false,
          w: false,
          visited: false,
          priorPos: null
        }
      }
    }
  }

  defineMaze() {
    let isComp = false;
    let move = false;
    let cellsVisited = 1;
    let numLoops = 0;
    let maxLoops = 0;
    let pos = { x: 0, y: 0 };
    const numCells = this.width * this.height;
    while (!isComp) {
      move = false;
      this.map[pos.y][pos.x].visited = true;
      if (numLoops >= maxLoops) {
        shuffle(this.dirs);
        maxLoops = Math.round(rand(this.height / 8));
        numLoops = 0;
      }
      numLoops++;
      for (let index = 0; index < this.dirs.length; index++) {
        let direction = this.dirs[index];
        let nx = pos.x + this.modDir[direction].x;
        let ny = pos.y + this.modDir[direction].y;
        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
          if (!this.map[ny][nx].visited) {
            this.map[pos.x][pos.y][direction] = true;
            this.map[nx][ny][this.modDir[direction].o] = true;
            this.map[nx][ny].priorPos = pos;
            pos = { x: nx, y: ny };
            move = true;
            cellsVisited++;
            break;
          }

        }
      }

      if (!move) pos = this.map[pos.x][pos.y].priorPos as { x: number; y: number; };
      if (numCells == cellsVisited) isComp = true;
    }
  }

  defineStartEnd() {
    switch (rand(4)) {
      case 0:
        this.startCoord = { x: 0, y: 0 };
        this.endCoord = { x: this.height - 1, y: this.width - 1 };
        break;
      case 1:
        this.startCoord = { x: 0, y: this.width - 1 };
        this.endCoord = { x: this.height - 1, y: 0 };
        break;
      case 2:
        this.startCoord = { x: this.height - 1, y: 0 };
        this.endCoord = { x: 0, y: this.width - 1 };
        break;
      case 3:
        this.startCoord = { x: this.height - 1, y: this.width - 1 };
        this.endCoord = { x: 0, y: 0 };
        break;
    }
  }

}
