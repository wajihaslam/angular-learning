import { Routes } from '@angular/router';
import { Home } from './platform/pages/home/home';
import { Lesson } from './platform/pages/lesson/lesson';
import { TOPICS } from './platform/data/topics';

export const routes: Routes = [
  { path: '', component: Home, title: 'Angular Learning Platform' },
  { path: 'learn', redirectTo: `learn/${TOPICS[0].id}`, pathMatch: 'full' },
  { path: 'learn/:topicId', component: Lesson },
  { path: '**', redirectTo: '' },
];
