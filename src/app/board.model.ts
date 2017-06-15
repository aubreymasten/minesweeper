

export class Board {
  x: number;
  y: number;
  bombs = [];
  array = [];
  revealed: number = 0;
  isNew: boolean = true;
  constructor(public difficulty){}

  genL(){
    this.x = this.array.length;
    this.y = this.array[0].length;
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
    if(!this.isRevealed(x, y)) this.array[x][y].status = this.array[x][y].status === 'flagged' ? 'hidden' : 'flagged';
  }
}
