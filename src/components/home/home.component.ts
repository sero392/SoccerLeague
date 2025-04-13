import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FootballTeam } from '../../models/FootballTeam';
import { MatchSimulationService } from '../../services/match-simulation.service';
import { PointStatCompComponent } from './point-stat-comp/point-stat-comp.component';
import { WeeklyMatchupCompComponent } from './weekly-matchup-comp/weekly-matchup-comp.component';
import { CommonModule } from '@angular/common';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CardModule, TableModule, ButtonModule, PointStatCompComponent,WeeklyMatchupCompComponent],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  title = 'Soccer League';

  //#region Properties
  teams: FootballTeam[] = [
    new FootballTeam('Fenerbahçe', '/fb.png',5),
    new FootballTeam('Galatasaray', '/gs.png',5),
    new FootballTeam('Beşiktaş', '/bjk.png',4),
    new FootballTeam('Bursaspor', '/bs.png',3),
  ];

  weeks: number = 6; // Toplam hafta sayısı
  matchResults: Map<string, FootballTeam> = new Map<string, FootballTeam>(); // Maç sonuçları
  fixtureList: FootballTeam[][] = []; // Fikstür listesi
  startedWeek: number = 0; // Başlangıç haftası
  expectedWeek: number = 0; // Beklenen hafta
  isStartedLeague: Boolean = false;
  isCompeteLeague: Boolean = false; // Ligin tamamlanıp tamamlanmadığını kontrol etmek için değişken
  //#endregion

  constructor(
    private matchSimulationService: MatchSimulationService,
    private sharedDataService: SharedDataService
  ) {}

  //#region Public Methods

  //Sayfayı yenile
  refreshPage():void{
    window.location.reload(); //Statelerin içerisini silmeme rağmen referans tiplerden dolayı
    //ramde kalıyor o yüzden bende kesin çözüm sayfayı yeniletiyorum. Normalde yanlış bir yöntem.
  }

  // Ligi başlat ve bir hafta simüle et
  startSimulate(): void {
    this.initializeSimulation();
    this.simulateWeeks(this.startedWeek, this.startedWeek + 1);
    this.updateComponentState(true); // Haftalık fikstür için slice uygula
    this.incrementWeek();
  }

  // Tüm ligi simüle et
  playAllLeague(): void {
    this.initializeSimulation();
    this.simulateWeeks(0, this.weeks);
    this.updateComponentState(false); // Slice uygulanmayacak
  }

  //#endregion

  //#region Private Methods

  // Simülasyonu başlatmak için gerekli ayarları yapar
  private initializeSimulation(): void {
    this.isStartedLeague = true;
    this.matchSimulationService.setTeams(this.teams); // Takımları ayarla
  }

  // Belirtilen haftalar arasında maçları simüle eder
  private simulateWeeks(startWeek: number, endWeek: number): void {
    this.matchSimulationService.simulateLeague(this.weeks, startWeek, endWeek); // Maçları simüle et
    this.matchSimulationService.getDifferenceWithOtherTeams(this.weeks, endWeek); // Takımlar arasındaki farkı hesapla
  }

  // Component state'ini günceller
  private updateComponentState(applySlice: boolean): void {
    this.matchResults = this.matchSimulationService.getMatchResults(); // Maç sonuçlarını al

    // Eğer slice uygulanacaksa, haftalık fikstürü al
    if (applySlice) {
      this.fixtureList = this.matchSimulationService
        .getFixtureList()
        .slice(this.expectedWeek, this.expectedWeek + 2);
    } else {
      this.fixtureList = this.matchSimulationService.getFixtureList(); // Tüm fikstürü al
    }

    this.isCompeteLeague = this.matchSimulationService.isCompleteLeague; // Ligin tamamlanıp tamamlanmadığını kontrol et
    this.sharedDataService.updateFixtureList(this.fixtureList);
    this.sharedDataService.updateValue(this.matchResults); // Paylaşılan veriyi güncelle
  }

  // Haftaları ilerletir
  private incrementWeek(): void {
    this.expectedWeek += 2; // Haftalık fikstür 2'şer 2'şer ilerler
    this.startedWeek += 1; // Her simülasyonda bir hafta ilerle
  }

  //#endregion
}