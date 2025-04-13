import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FootballTeam } from '../models/FootballTeam';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private pointStatValue = new BehaviorSubject<Map<string, FootballTeam>>(new Map<string, FootballTeam>); // ilk değer boş string
  private fixtureList = new BehaviorSubject<FootballTeam[][]>([]); // ilk değer boş string
  pointStatValue$ = this.pointStatValue.asObservable(); // dışarıdan sadece okunabilir
  fixtureList$ = this.fixtureList.asObservable();

  updateValue(newValue: Map<string, FootballTeam>) {
    this.pointStatValue.next(newValue);
  }
  updateFixtureList(newFixture: FootballTeam[][]) {
    this.fixtureList.next(newFixture);
  }

}
