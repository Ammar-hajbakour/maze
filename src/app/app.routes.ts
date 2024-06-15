import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./intro/intro.component').then(c => c.IntroComponent)
  },
  {
    path: 'game',
    loadComponent: () => import('./game/game.component').then(c => c.GameComponent)
  }
];
