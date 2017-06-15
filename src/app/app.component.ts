import { Component, OnInit } from '@angular/core';
import { Space } from './space.model';
import { Board } from './board.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  difficulties = [
    {
      name: 'Easy',
      x: 8,
      y: 8,
      bombs: 10
    },
    {
      name: 'Intermediate',
      x: 16,
      y: 16,
      bombs: 40
    },
    {
      name: 'Extreme Sunburn',
      x: 32,
      y: 16,
      bombs: 99
    }
  ];

  board: Board;
  difficulty: number = 0;
  didYouWin;

  ngOnInit(){
    this.genBoard();
  }

  onChange(optionFromMenu) {
    this.didYouWin = '';
    this.difficulty = parseInt(optionFromMenu,10);
    this.genBoard();
  }

  genBoard() {
    this.board = new Board(this.difficulties[this.difficulty]);
    for(let x = 0; x < this.board.difficulty.x; x++){
      this.board.array.push([]);
      for(let y = 0; y < this.board.difficulty.y; y++){
        this.board.array[x].push(new Space(x,y));
      }
    }
    this.board.genL();
  }

  genBombs(){
    for(let bombs = 0; bombs < this.board.difficulty.bombs; bombs++){
      let x:number, y:number;
      do {
        x = Math.floor(Math.random() * this.board.difficulty.x);
        y = Math.floor(Math.random() * this.board.difficulty.y);
      } while(this.board.isBomb(x, y));
      this.board.array[x][y].isBomb = true;
      this.board.bombs.push([x,y]);
    }
    this.countBombs();
    this.setBombs();
  }

  setBombs(){
    this.board.bombs.forEach((bomb)=>{
      this.board.setBombs(bomb[0], bomb[1], 9);
    });
  }

  countBombs(){
    this.board.bombs.forEach((bomb)=>{
      for(let i = bomb[0]-1; i < bomb[0]+2; i++){
        for(let n = bomb[1]-1; n < bomb[1]+2; n++){
          if(this.isValid(i, n)) this.board.addBomb(i,n);
        }
      }
    });
  }

  isValid(x:number, y:number){
    return x >= 0 && x < this.board.x && y >= 0 && y < this.board.y;
  }

  newBoard(space: Space){
      do {
        this.genBoard();
        this.genBombs();
      } while(this.board.bombCount(space.x, space.y) !== 0 || this.board.isBomb(space.x, space.y))
      this.board.isNew = false;
  }

  updateBoard(space: Space, event){
    if(event.button === 0){
      if(this.board.isNew) this.newBoard(space);
      if(this.board.array[space.x][space.y].status !== 'flagged'){
        if(space.isBomb){
          this.gameOver();
        } else {
          this.reveal(space.x,space.y)
          this.victory();
        }
      }
    }
  }

  gameOver(){
    for(let x = 0; x < this.board.x; x++){
      for(let y = 0; y < this.board.y; y++){
        this.board.reveal(x,y);
      }
    }
    this.didYouWin = 'GAME OVER'
  }

  victory(){
    if(this.board.hasWon()){
      this.didYouWin = 'Victory is yours!'
    }
  }

  reveal(x: number, y: number){
    if(
      this.isValid(x, y)
      && !this.board.isRevealed(x, y)
      && !this.board.isBomb(x, y) // not a bomb
      && this.board.array[x][y].status !== 'flagged' // not flagged
    ){
      this.board.reveal(x,y);

      if(this.board.bombCount(x,y) === 0){
        for(let i = x-1; i < x+2; i++){
          for(let n = y-1; n < y+2; n++){
            this.reveal(i, n);
          }
        }
      }
    }
  }

  flag(space: Space) {
    if(!this.board.isNew) this.board.toggleFlag(space.x, space.y);
  }
}
