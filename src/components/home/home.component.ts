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
export class HomeComponent implements OnInit {
  title = 'Soccer League';
  teams : FootballTeam[] = [
    new FootballTeam('Fenerbahçe'),
    new FootballTeam('Galatasaray'), 
    new FootballTeam('Beşiktaş'), 
    new FootballTeam('Bursaspor'), 
  ];
weeks: number = 6; // Haftalar
matchResults: string[] = []; // Maç sonuçları

  constructor(private matchSimulationService: MatchSimulationService) {} 

  ngOnInit():void {
 
  }

  startSimulate(): void {
    debugger
    this.matchSimulationService.setTeams(this.teams);
    this.matchSimulationService.simulateLeague(this.weeks);
    this.matchResults = this.matchSimulationService.getMatchResults();
  }


}
