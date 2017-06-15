

export class Board {
  bombs = [];
  array = [];
  isNew: boolean = true;
  constructor(public difficulty){}

  bombCount(x: number, y:number) {
    return this.array[x][y].bombCount;
  }

  addBomb(x: number, y: number) {
    this.array[x][y].bombCount += 1;
  }

  setBombs(x: number, y: number, bombs: number) {
    this.array[x][y].bombCount = bombs;
  }
}
