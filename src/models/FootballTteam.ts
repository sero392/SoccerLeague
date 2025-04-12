export class FootballTeam {
  
  name: string;
  points: number = 0;
  winRate: number = 0;
  drawRate: number = 0;
  lossRate: number = 0;
  goalsScored: number = 0;
  goalsConceded: number = 0;
  weeklyGoalsScored : number = 0;
  background: string = "none"; // Arka plan rengi için değişken

  constructor(name: string = "") {
    this.name = name;
  }

  // Averaj hesaplama fonksiyonu
  get goalDifference(): number {
    return this.goalsScored - this.goalsConceded;
  }
}
