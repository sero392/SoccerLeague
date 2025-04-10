export class FootballTeam {
  name: string;
  points: number;
  winRate: number;
  drawRate: number;
  lossRate: number;
  goalsScored: number;
  goalsConceded: number;

  constructor(name: string = "") {
    this.name = name;
    this.points = 0;
    this.winRate = 0;
    this.drawRate = 0;
    this.lossRate = 0;
    this.goalsScored = 0;
    this.goalsConceded = 0;
  }

  // Averaj hesaplama fonksiyonu
  get goalDifference(): number {
    return this.goalsScored - this.goalsConceded;
  }
}
