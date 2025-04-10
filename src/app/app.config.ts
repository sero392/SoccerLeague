import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';

import Aura from '@primeng/themes/aura';
import { MatchSimulationService } from '../services/match-simulation.service';
import { FootballTeam } from '../models/FootballTteam';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    MatchSimulationService,
    FootballTeam,
    providePrimeNG({
      theme:{
        preset:Aura
      }
    })
  
  ]
};
