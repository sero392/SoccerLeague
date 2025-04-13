import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SharedDataService } from '../../../services/shared-data.service';
import { FootballTeam } from '../../../models/FootballTeam';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-point-stat-comp',
  imports: [CardModule, TableModule, ButtonModule,CommonModule],
  standalone: true,
  templateUrl: './point-stat-comp.component.html',
  styleUrl: './point-stat-comp.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PointStatCompComponent implements OnInit {
  sharedValue: Map<string, FootballTeam> = new Map<string, FootballTeam>();


  constructor(private sharedDataService: SharedDataService) {}
  ngOnInit(): void {
    this.sharedDataService.pointStatValue$.subscribe(value => {
      this.sharedValue = value;
    });


  }

  get matchResultsArray(): { teamName: string; team: FootballTeam }[] {
    const matchResultArr = Array.from(this.sharedValue, ([teamName, team]) => ({
      teamName,
      team,
    }));
    return matchResultArr;
  }

  
}
