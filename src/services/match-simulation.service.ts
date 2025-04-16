import { FootballTeam } from '../models/FootballTeam';
import Swal from 'sweetalert2'

export class MatchSimulationService {
  private teams: FootballTeam[] = []; // Takımlar
  private matchResults = new Map<string, FootballTeam>(); // Maç sonuçlarını tutacak harita
  private fixtureList: FootballTeam[][] = []; // Fikstür listesi

  public isCompleteLeague = false; // Ligin tamamlanıp tamamlanmadığını kontrol etmek için değişken

  //#region Sabitler
  private readonly WIN_POINTS = 3; // Galibiyet puanı
  private readonly DRAW_POINTS = 1; // Beraberlik puanı
  private readonly GOALS_ARRAY = [1,1,1,1,1,1,2,2,2,2,2,3,3,3,3,4,4,4,5,5];
  //#endregion

  //#region Private Metotlar

  // Rastgele gol sayısı üretme fonksiyonu
  private getRandomGoals(team: FootballTeam = new FootballTeam()): number {
    // return Math.floor(Math.random() * this.MAX_GOALS) + team.teamPower;
    const calulatedGoals = [...this.GOALS_ARRAY,...team.teamPower]
    return calulatedGoals[Math.floor(Math.random() * calulatedGoals.length)]
  }

  // Haftalık maçları simüle eder
  private simulateWeek(matches: FootballTeam[][]): void {
    matches.forEach((match) => {
      const [teamA, teamB] = match;
      this.simulateMatch(teamA, teamB);
      this.updateFixtureList(teamA, teamB);
      this.updateMatchResults(teamA, teamB);
    });
  }

  // Bir maçı simüle eder
  private simulateMatch(teamA: FootballTeam, teamB: FootballTeam): void {
    const goalsA = this.getRandomGoals(teamA);
    const goalsB = this.getRandomGoals(teamB);

    teamA.goalsScored += goalsA;
    teamA.goalsConceded += goalsB;
    teamA.weeklyGoalsScored = goalsA;

    teamB.goalsScored += goalsB;
    teamB.goalsConceded += goalsA;
    teamB.weeklyGoalsScored = goalsB;

    const pointsA = (+(goalsA > goalsB)) * this.WIN_POINTS + (+(goalsA === goalsB)) * this.DRAW_POINTS;
    const pointsB = (+(goalsB > goalsA)) * this.WIN_POINTS + (+(goalsB === goalsA)) * this.DRAW_POINTS;

    teamA.winRate += pointsA > pointsB ? 1 : 0;
    teamA.drawRate += pointsA === pointsB ? 1 : 0;
    teamA.lossRate += pointsA < pointsB ? 1 : 0;

    teamB.winRate += pointsB > pointsA ? 1 : 0;
    teamB.drawRate += pointsB === pointsA ? 1 : 0;
    teamB.lossRate += pointsB < pointsA ? 1 : 0;

    teamA.points += pointsA;
    teamB.points += pointsB;
  }

  // Fikstür listesine maç ekler
  private updateFixtureList(teamA: FootballTeam, teamB: FootballTeam): void {
    this.fixtureList.push([teamA, teamB]);
  }

  private calculateChampionsRate(weeks: number, expectedWeek: number): void {
    let remainingWeeks = weeks - expectedWeek;
    //Listedeki en yüksek puanı bul
    const maxPoints = Math.max(...Array.from(this.matchResults.values()).map((team) => team.points));

    this.matchResults.forEach((team) => {
      const potentialMaxPoints = team.points + remainingWeeks * this.WIN_POINTS;
      if (potentialMaxPoints < maxPoints) {
        team.championsRate = 0; // Şampiyon olma şansı yok
      } else {
        //Lig tamamlanmış demektir.
        remainingWeeks = remainingWeeks === 0 ? 1 : remainingWeeks;

        const pointDifference = maxPoints - team.points;
        const winProbability = 1 - pointDifference / (remainingWeeks * this.WIN_POINTS);
        team.championsRate = Number(Math.max(0, Math.min(100, winProbability * 100)).toFixed(2)); // Yüzdeye çevir
      }
    });
  }

  // Maç sonuçlarını günceller
  private updateMatchResults(teamA: FootballTeam, teamB: FootballTeam): void {
    this.matchResults.set(teamA.name, teamA);
    this.matchResults.set(teamB.name, teamB);
  }

  // Şampiyonu belirler
  private declareChampion(): void {
    const champion = Array.from(this.matchResults.values()).reduce((team1, team2) => {
      if (team1.points === team2.points) {
        if (team1.goalDifference === team2.goalDifference) {
          return team1.name.localeCompare(team2.name) < 0 ? team1 : team2;
        }
        return team1.goalDifference > team2.goalDifference ? team1 : team2;
      }
      return team1.points > team2.points ? team1 : team2;
    });

    Swal.fire({
      title: 'Şampiyon!',
      text: `${champion.name} - Puan: ${champion.points} - Avaraj: ${champion.goalDifference}`,
      imageUrl:'/champions.gif',
      imageWidth:200,
      imageHeight:150,
      showConfirmButton:false
    });
    this.isCompleteLeague = true;
  }

  //#endregion

  //#region Public Metotlar

  // Takımları ayarlar
  public setTeams(teams: FootballTeam[]): void {
    this.teams = teams;
  }

  // Maç sonuçlarını ve fikstürü sıfırlar
  public setEmptyResults(): void {
    this.matchResults.clear();
    this.fixtureList = [];
    this.isCompleteLeague = false;
  }

  // Maç sonuçlarını döndürür
  public getMatchResults(): Map<string, FootballTeam> {
    return this.matchResults;
  }

  // Fikstür listesini döndürür
  public getFixtureList(): FootballTeam[][] {
    return this.fixtureList;
  }

  // Ligi simüle eder
  public simulateLeague(weeks: number, startedWeek: number, expectedWeek: number): void {
    if (this.isCompleteLeague) {
      return;
    }
    const fixtures = this.generateLeagueFixtures(this.teams, weeks);

    for (let index = startedWeek; index < expectedWeek; index++) {
      this.simulateWeek(fixtures[index]);
    }
    this.calculateChampionsRate(weeks, expectedWeek);

    if (weeks <= expectedWeek) {
      this.declareChampion();
    }
  }

  // Fikstür oluşturma fonksiyonu (Round Robin Formatında)
  public generateLeagueFixtures(teams: FootballTeam[], totalWeeks: number): FootballTeam[][][] {
    if (teams.length % 2 !== 0) {
      teams.push(new FootballTeam('Bye')); // Tek sayıysa, bir takım her hafta boş geçer
    }

    const rounds: FootballTeam[][][] = [];
    const numRounds = teams.length - 1;
    const numMatchesPerRound = teams.length / 2;

    const teamList = [...teams];
    const fixedTeam = teamList[0];
    const rotatingTeams = teamList.slice(1);

    for (let round = 0; round < numRounds; round++) {
      const matches: FootballTeam[][] = [];
      matches.push([fixedTeam, rotatingTeams[round % rotatingTeams.length]]);

      for (let i = 1; i < numMatchesPerRound; i++) {
        const home = rotatingTeams[(round + i) % rotatingTeams.length];
        const away = rotatingTeams[(round + rotatingTeams.length - i) % rotatingTeams.length];
        matches.push([home, away]);
      }

      rounds.push(matches);
    }

    const reverseRounds = rounds.map((round) =>
      round.map(([home, away]) => [away, home])
    );
    return [...rounds, ...reverseRounds].slice(0, totalWeeks);
  }

  // Takımlar arasındaki farkı kontrol eder

  public getDifferenceWithOtherTeams(weeks: number = 0, expectedWeek: number = 0): void {
    const maxPoints = Math.max(...Array.from(this.matchResults.values()).map((team) => team.points));
    const remainingWeeks = weeks - expectedWeek;

    this.matchResults.forEach((team) => {
      const pointDifference = maxPoints - team.points;
      team.background = pointDifference > remainingWeeks * this.WIN_POINTS ? 'red' : 'none';
    });
  }

  //#endregion
}