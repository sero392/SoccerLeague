import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FootballTeam } from '../../models/FootballTteam';
import { MatchSimulationService } from '../../services/match-simulation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CardModule, TableModule, ButtonModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  title = 'Soccer League';

  teams: FootballTeam[] = [
    new FootballTeam('Fenerbahçe'),
    new FootballTeam('Galatasaray'),
    new FootballTeam('Beşiktaş'),
    new FootballTeam('Bursaspor'),
  ];

  weeks: number = 6; // Haftalar
  matchResults: Map<string, FootballTeam> = new Map<string, FootballTeam>(); // Maç sonuçları  
  fixtureList: FootballTeam[][] = []; // Fixture listesi
  startedWeek: number = 0; // Başlangıç haftası
  expectedWeek: number = 0; // Beklenen hafta
  constructor(private matchSimulationService: MatchSimulationService) { }



  startSimulate(): void {
    
    this.matchSimulationService.setTeams(this.teams); // Takımları ayarla
    this.matchSimulationService.simulateLeague(this.weeks, this.startedWeek, this.startedWeek + 1); // Maçları simüle et
    this.matchResults = this.matchSimulationService.getMatchResults(); // Maç sonuçlarını al
    this.fixtureList = this.matchSimulationService.getFixtureList().slice(this.expectedWeek,this.expectedWeek + 2); // Fixture listesini al
    this.expectedWeek += 2;


    this.startedWeek += 1; // Her simülasyonda bir hafta ilerle

  }

  get matchResultsArray(): { teamName: string, team: FootballTeam }[] {
    const a = Array.from(this.matchResults, ([teamName, team]) => ({ teamName, team }));
    return a;
  }
}
