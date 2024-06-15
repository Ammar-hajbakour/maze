import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Maze } from '../utils/maze';
import { DrawMaze } from '../utils/draw-maze';
import { Player } from '../utils/player';
@Component({
  selector: 'game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements AfterViewInit {
  @ViewChild('mazeCanvas') mazeCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('scrollable') scrollable!: ElementRef<HTMLDivElement>;
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (this.player) this.player.check(event);
    switch (event.key) {
      case 'w':
        this.moveScreenTo('up');
        break;
      case 'a':
        this.moveScreenTo('left');
        break;
      case 's':
        this.moveScreenTo('down');
        break;
      case 'd':
        this.moveScreenTo('right');
        break;
      case 'm':
        this.showFullMap.set(!this.showFullMap());
        break;
      case ' ':
        this.resetScreen();
        break;
    }
  }
  router = inject(Router);
  sprite: HTMLImageElement | null = null;
  finishSprite: HTMLImageElement | null = null;

  maze: Maze | null = null;
  draw: DrawMaze | null = null;
  player: Player | null = null;

  cellSize: number = 0;
  difficulty!: number;

  gameCompleted = signal<boolean>(false);
  showFullMap = signal<boolean>(false);
  fullMap = signal<string>('');
  constructor(private route: ActivatedRoute) {
    this.difficulty = Number(this.route.snapshot.queryParams['difficulty']);
  }
  makeMaze() {
    this.cellSize = this.mazeCanvas.nativeElement.width / this.difficulty;
    this.maze = new Maze(this.difficulty, this.difficulty)
    const ctx = this.mazeCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.draw = new DrawMaze(this.maze, ctx, this.cellSize, this.finishSprite);
    this.player = new Player(this.maze, ctx, this.cellSize, () => this.gameCompleted.set(true), this.sprite);
    this.resetScreen()
    this.canvasToDataUrl();
  }

  canvasToDataUrl() {
    this.fullMap.set(this.mazeCanvas.nativeElement.toDataURL())
  }


  playGame() {
    let completeOne = false;
    let completeTwo = false;
    const isComplete = () => {
      if (completeOne && completeTwo) this.makeMaze();
    }

    this.sprite = new Image();
    this.sprite.src = "assets/key.png" + "?" + new Date().getTime();
    this.sprite.setAttribute('crossorigin', " ");

    this.sprite.onload = (e) => {
      completeOne = true;
      isComplete();
    }

    this.finishSprite = new Image();
    this.finishSprite.src = "assets/home.png" + "?" + new Date().getTime();
    this.finishSprite.setAttribute('crossorigin', " ");
    this.finishSprite.onload = () => {
      completeTwo = true;
      isComplete();
    }
  }
  restartGame() {
    this.maze = null;
    this.draw = null;
    this.player = null;
    this.gameCompleted.set(false);
    this.playGame();
  }
  nextLevel() {
    this.difficulty += 5;
    this.router.navigate(['game'], { queryParams: { difficulty: this.difficulty } })
    this.gameCompleted.set(false);
    this.playGame();
  }
  moveScreenTo(dir: 'left' | 'right' | 'up' | 'down') {
    let x = this.scrollable.nativeElement.scrollLeft;
    let y = this.scrollable.nativeElement.scrollTop;
    const moveAmount = this.cellSize * 2;
    switch (dir) {
      case 'left':
        x -= moveAmount;
        break;
      case 'right':
        x += moveAmount;
        break;
      case 'up':
        y -= moveAmount;
        break;
      case 'down':
        y += moveAmount;
        break;
    }

    this.scrollable.nativeElement.scroll({ behavior: 'smooth', top: y, left: x });
  }
  resetScreen() {
    if (!this.player) return;
    let x = this.player.cellCoords.x * this.cellSize;
    const y = this.player.cellCoords.y * this.cellSize;
    this.scrollable.nativeElement.scroll({ behavior: 'smooth', top: y, left: x });
  }

  openFullMap() {
    this.canvasToDataUrl()
    this.showFullMap.set(true)
  }

  ngAfterViewInit(): void {
    this.playGame();
  }

  simulateKeyPress(key: string) {
    let code = 0;
    switch (key) {
      case "up":
        code = 38;
        break;
      case "down":
        code = 40;
        break;
      case "left":
        code = 37;
        break;
      case "right":
        code = 39;
        break;
    }
    const event = new KeyboardEvent('keydown', {
      key: key,
      keyCode: code,
      code: key,
      bubbles: true,
      cancelable: true,
      composed: true
    });

    document.dispatchEvent(event);
  }

}


