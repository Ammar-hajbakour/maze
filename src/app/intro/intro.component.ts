import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [FormsModule, TitleCasePipe],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss'
})
export class IntroComponent {
  private router = inject(Router);
  difficultyList = [
    { name: 'easy', value: 10 },
    { name: 'medium', value: 15 },
    { name: 'hard', value: 25 },
    { name: 'extreme', value: 38 }
  ]
  difficulty = this.difficultyList[0].value;

  // difficulty = 40;

  playGame() {
    this.router.navigate(['game'], { queryParams: { difficulty: this.difficulty } });
  }
  ngOnInit() {
    console.log(this.difficulty);

  }
}
