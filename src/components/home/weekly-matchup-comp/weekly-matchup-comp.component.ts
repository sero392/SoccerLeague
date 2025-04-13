import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { SharedDataService } from '../../../services/shared-data.service';
import { FootballTeam } from '../../../models/FootballTeam';

@Component({
  selector: 'app-weekly-matchup-comp',
  imports: [CardModule, CommonModule],
  templateUrl: './weekly-matchup-comp.component.html',
  styleUrl: './weekly-matchup-comp.component.scss'
})
export class WeeklyMatchupCompComponent {
  transformedFixtureList: { weekNumber: number; fixture: FootballTeam[] }[] = [];

  constructor(private sharedDataService: SharedDataService) {

  }

  ngOnInit(): void {
    this.sharedDataService.fixtureList$.subscribe(value => {
      //Bu rxJs değişkenine bileşeni abone ediyoruz. StateManagement kütüphanelerindekine benzer bir yöntem..
      this.transformedFixtureList = value.map((fixture, index) => ({
        weekNumber: Math.floor(index / 2) + 1, // Haftayı hesapla
        fixture,
      }));
    });
  }

}
