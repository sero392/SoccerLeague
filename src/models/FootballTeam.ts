export class FootballTeam {
  
  name: string;
  points: number = 0;//Toplam puan
  winRate: number = 0;//Kazanılan oyun sayısı
  drawRate: number = 0;//Berabere kalınan oyun sayısı
  lossRate: number = 0;//Kaybedilen oyun sayısı
  goalsScored: number = 0;//Toplam atılan gol sayısı
  goalsConceded: number = 0;//Toplam yenilen gol sayısı
  weeklyGoalsScored : number = 0;//Takımın o hafta attığı gol
  weekNumber : number = 0; //Karşılaşmanın Haftası
  teamPower: number[] = []; //Takımın gücü 0-5
  background: string = "none"; // Arka plan rengi için değişken
  championsRate:number = 0;//Takımın şampiyon olma yüzdesi
  icon:string = '';

  constructor(name: string = "",icon: string = "", teamPower : number[] = []) {
    this.name = name;
    this.icon = icon;
    this.teamPower = teamPower;
  }

  // Averaj hesaplama fonksiyonu
  get goalDifference(): number {
    return this.goalsScored - this.goalsConceded;
  }
}
