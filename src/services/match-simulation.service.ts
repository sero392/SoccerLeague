import { FootballTeam } from '../models/FootballTteam';


export class MatchSimulationService {
  private teams: FootballTeam[] = []; // Takımlar
  private matchResults = new Map<string, FootballTeam>(); // Maç sonuçlarını tutacak array
  private fixtureList: FootballTeam[][] = [];


  setTeams(teams: FootballTeam[]): void {
    this.teams = teams;
  }

  public getMatchResults(): Map<string, FootballTeam> {
    return this.matchResults; // Maç sonuçlarını döndür
  }

  //Fikstür listesini döndür
  public getFixtureList(): FootballTeam[][] {
    return this.fixtureList; // Fixture listesini döndür
  }


  //Ligi simule eder
  public simulateLeague(weeks: number, startedWeek: number, expectedWeek: number): void {
    const fixtures = this.generateLeagueFixtures(this.teams, weeks);

    for (let index = startedWeek; index < expectedWeek; index++) {
      fixtures[index].forEach((match) => {
        // let teamA = Object.assign(new FootballTeam(''), match[0]);
        // let teamB = Object.assign(new FootballTeam(''), match[1]);
        let teamA = match[0];
        let teamB = match[1];

        const goalsA = this.getRandomGoals();
        const goalsB = this.getRandomGoals();

        teamA.goalsScored += goalsA;
        teamA.goalsConceded += goalsB;
        teamA.weeklyGoalsScored = goalsA; // Haftalık gol sayısını güncelle

        teamB.goalsScored += goalsB;
        teamB.goalsConceded += goalsA;
        teamB.weeklyGoalsScored = goalsB; // Haftalık gol sayısını güncelle

        // Puanlama işlemi
        const pointsA = +(goalsA > goalsB) * 3 + +(goalsA === goalsB);
        const pointsB = +(goalsB > goalsA) * 3 + +(goalsB === goalsA);

        teamA.winRate += pointsA > pointsB ? 1 : 0;
        teamA.drawRate += pointsA === pointsB ? 1 : 0;
        teamA.lossRate += pointsA < pointsB ? 1 : 0;


        teamB.winRate += pointsB > pointsA ? 1 : 0;
        teamB.drawRate += pointsB === pointsA ? 1 : 0;
        teamB.lossRate += pointsB < pointsA ? 1 : 0;

        teamA.points += pointsA;
        teamB.points += pointsB;

        this.fixtureList.push([teamA, teamB]); // Fixture listesini güncelle

        this.matchResults.set(teamA.name, teamA);
        this.matchResults.set(teamB.name, teamB);
      });

    }
  }

  // Rastgele gol sayısı üretme fonksiyonu
  private getRandomGoals(): number {
    return Math.floor(Math.random() * 5) + 1; // 1-5 arasında gol
  }

  // Fikstür oluşturma fonksiyonu (Round Robin Formatında)
  public generateLeagueFixtures(teams: FootballTeam[], totalWeeks: number): FootballTeam[][][] {
    ///Round Robin formatında maç takvimi oluşturma///

    if (teams.length % 2 !== 0) {
      teams.push(new FootballTeam('Bye')); // Tek sayıysa, bir takım her hafta boş geçer
    }

    const rounds: FootballTeam[][][] = [];
    // Toplam hafta sayısı, takımların sayısına göre hesaplanıyor
    const numRounds = teams.length - 1;
    //Hafta başına oynanacak maç sayısı
    const numMatchesPerRound = teams.length / 2;

    const teamList = [...teams]; // Takımlar sabit kalmasın
    const fixedTeam = teamList[0];
    const rotatingTeams = teamList.slice(1);

    for (let round = 0; round < numRounds; round++) {
      const matches: FootballTeam[][] = [];

      // Bir takım sabit kalacak, sabit takım hariç olan takımlardan,
      //  round % rotatingTeams.length kadar takım seçilecek
      // matches.push([fixedTeam, rotatingTeams[round % rotatingTeams.length]]);
      matches.push([fixedTeam, rotatingTeams[round % rotatingTeams.length]]);

      for (let i = 1; i < numMatchesPerRound; i++) {
        //2.round'da sabit olmayan diğer iki takım bulunuyor.
        const home = rotatingTeams[(round + i) % rotatingTeams.length];
        const away = rotatingTeams[(round + rotatingTeams.length - i) % rotatingTeams.length];
        matches.push([home, away]);

      }

      rounds.push(matches);
    }


    // 2. yarı karşılaşmalarını oluşturuyoruz
    const reverseRounds = rounds.map(round =>
      round.map(([home, away]) => [away, home])
    );


    //Tüm karşılaşmaları birleştiriyoruz
    const fullSchedule = [...rounds, ...reverseRounds];

    // Toplam hafta sayısına göre kesiyoruz
    return fullSchedule.slice(0, totalWeeks);
  }


}
