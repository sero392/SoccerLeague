import { FootballTeam } from '../models/FootballTteam';

export class MatchSimulationService {
  private teams: FootballTeam[];
  private previousMatchups: Set<string>; // Geçmiş eşleşmeleri tutacak set
  private matchResults: string[] = []; // Maç sonuçlarını tutacak array

  constructor() {
    this.teams = [];
    this.previousMatchups = new Set(); // Geçmiş eşleşmeleri başlatıyoruz
    this.matchResults = []; // Maç sonuçlarını başlatıyoruz
  }

  setTeams(teams: FootballTeam[]): void {
    this.teams = teams;
  }
  
  private getRandomGoals(): number {
    return Math.floor(Math.random() * 5); // 0-4 arasında gol
  }

  private generateMatchKey(teamA: FootballTeam, teamB: FootballTeam): string {
    // Takımların adlarını sıralayarak eşleşme anahtarı oluşturuyoruz
    return [teamA.name, teamB.name].sort().join('-');
  }

  private simulateMatch(teamA: FootballTeam, teamB: FootballTeam): void {
    const goalsA = this.getRandomGoals();
    const goalsB = this.getRandomGoals();

    teamA.goalsScored += goalsA;
    teamA.goalsConceded += goalsB;

    teamB.goalsScored += goalsB;
    teamB.goalsConceded += goalsA;

    // Puanlama işlemi
    const pointsA = +(goalsA > goalsB) * 3 + +(goalsA === goalsB);
    const pointsB = +(goalsB > goalsA) * 3 + +(goalsB === goalsA);

    teamA.points += pointsA;
    teamB.points += pointsB;

    // Maç sonucunu kaydet
    this.matchResults.push(`${teamA.name} ${goalsA} - ${goalsB} ${teamB.name}`);
  }

  private shuffleTeams(): FootballTeam[] {
    // Takımları karıştır
    for (let i = this.teams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.teams[i], this.teams[j]] = [this.teams[j], this.teams[i]]; // Eşleşmeleri karıştır
    }
    return this.teams;
  }

  private simulateWeek(): void {
    const shuffledTeams = this.shuffleTeams();
    const weekMatchups: string[] = []; // Haftanın maçlarını tutacak array

    for (let i = 0; i < shuffledTeams.length; i += 2) {
      const teamA = shuffledTeams[i];
      const teamB = shuffledTeams[i + 1];
      const matchKey = this.generateMatchKey(teamA, teamB);

      // Önceki hafta bu eşleşme olduysa, tekrar yapma
      if (this.previousMatchups.has(matchKey)) {
        i -= 2; // Sonraki takımları kaydırarak eşleşmeyi değiştirelim
        continue;
      }

      // Eşleşmeyi kaydet
      this.previousMatchups.add(matchKey);
      weekMatchups.push(matchKey);

      // Maçı simüle et
      this.simulateMatch(teamA, teamB);
    }
  }

  public simulateLeague(weeks: number): void {
    for (let week = 1; week <= weeks; week++) {
      console.log(`Week ${week}:`);
      this.simulateWeek();
      this.printTeamStats();
    }
  }
  public getMatchResults(): string[] {
    return this.matchResults; // Maç sonuçlarını döndür
}
  private printTeamStats(): void {
    this.teams.forEach((team) => {
      console.log(
        `${team.name} - Points: ${team.points}, Goals Scored: ${team.goalsScored}, Goals Conceded: ${team.goalsConceded}`
      );
    });
  }
}
