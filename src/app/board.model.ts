

export class Board {
  x: number;
  y: number;
  flags: number;
  bombs = [];
  array = [];

  revealed: number = 0;
  isNew: boolean = true;
  constructor(public difficulty){}

  initialize(){
    this.x = this.array.length;
    this.y = this.array[0].length;
    this.flags = this.difficulty.bombs;
  }

  bombCount(x: number, y:number) {
    return this.array[x][y].bombCount;
  }

  addBomb(x: number, y: number) {
    this.array[x][y].bombCount += 1;
  }

  setBombs(x: number, y: number, bombs: number) {
    this.array[x][y].bombCount = bombs;
  }

  isBomb(x: number, y: number) {
    return this.array[x][y].isBomb;
  }

  hasWon(){
    return this.revealed === (this.array.length * this.array[0].length) - this.bombs.length;
  }

  reveal(x: number, y: number) {
    this.array[x][y].status = 'revealed';
    this.revealed += 1;
  }

  isRevealed(x: number, y: number) {
    return this.array[x][y].status === 'revealed';
  }

  toggleFlag(x: number, y: number) {
    if(this.array[x][y].status === 'flagged'){
      this.array[x][y].status = 'hidden';
      this.flags += 1;
    } else if(this.array[x][y].status === 'hidden' && this.flags > 0){
      this.array[x][y].status = 'flagged';
      this.flags -= 1;
    }
  }
}
