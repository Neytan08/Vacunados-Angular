import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';

export const ROUTES: Routes = [
	{ path: '', component: MainComponent },
	{ path: '', pathMatch: 'full', redirectTo: '' },
	{ path: '**', pathMatch: 'full', redirectTo: '' }
];

export const APP_ROUTING = RouterModule.forRoot(ROUTES);