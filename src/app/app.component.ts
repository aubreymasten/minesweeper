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
  }

  genBombs(){
    for(let bombs = 0; bombs < this.board.difficulty.bombs; bombs++){
      let x:number, y:number;
      do {
        x = Math.floor(Math.random() * this.board.difficulty.x);
        y = Math.floor(Math.random() * this.board.difficulty.y);
      } while(this.board.array[x][y].isBomb);
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
    return x >= 0 && x < this.board.array.length && y >= 0 && y < this.board.array[0].length;
  }

  logBoard(){
    let line = '';
    for(let x = 0; x < this.board.array.length; x++){
      for(let y = 0; y < this.board.array[0].length; y++){
        if(this.board.array[x][y].isBomb){
          line = line.concat('B  ');
        } else {
          line = line.concat(`${this.board.array[x][y].bombCount}  `);
        }
      }
      // console.log(`${x}: ${line}`);
      line = '';
    }
  }

  updateBoard(space: Space){
    if(this.board.isNew) {
      do {
        this.genBoard();
        this.genBombs();
      } while(this.board.bombCount(space.x, space.y) !== 0 || this.board.array[space.x][space.y].isBomb)
      this.board.isNew = false;
    }
    if(this.board.array[space.x][space.y].clickedStatus !== 'flagged'){
      if(space.isBomb){
        this.gameOver();
      } else{
        this.reveal(space.x,space.y)
        space.isClicked = true;
        this.victory();
      }
    }
  }

  gameOver(){
    for(let x = 0; x < this.board.array.length; x++){
      for(let y = 0; y < this.board.array[0].length; y++){
        this.board.array[x][y].isClicked = true;
        this.board.array[x][y].clickedStatus = 'revealed';
      }
    }
    this.didYouWin = 'GAME OVER'
  }
  // TODO: check this out
  victory(){
    let totalClicked = 0;
    for(let x = 0; x < this.board.array.length; x++){
      for(let y = 0; y < this.board.array[0].length; y++){
        if(this.board.array[x][y].isClicked === true){
          totalClicked += 1;
        }
      }
    }

    if(totalClicked === ((this.difficulties[this.difficulty].x * this.difficulties[this.difficulty].y) - this.difficulties[this.difficulty].bombs)){
      this.didYouWin = 'Victory is yours!'
    }
  }

  reveal(x: number, y: number){
    if(x >= 0 && x < this.board.array.length && y >= 0 && y < this.board.array[0].length && !this.board.array[x][y].isClicked && !this.board.array[x][y].isBomb && this.board.array[x][y].clickedStatus !== 'flagged'){
      this.board.array[x][y].isClicked = true;
      this.board.array[x][y].clickedStatus = 'revealed';
      // TODO: add loop to reveal
      if(this.board.bombCount(x,y) === 0){
        this.reveal(x-1,y-1);
        this.reveal(x-1,y);
        this.reveal(x-1,y+1);

        this.reveal(x,y-1);
        this.reveal(x,y+1);

        this.reveal(x+1,y-1);
        this.reveal(x+1,y);
        this.reveal(x+1,y+1);
      }
    }
  }

// TODO: make this better
  flagThat(space: Space) {
    if(this.board.array[space.x][space.y].clickedStatus === 'flagged'){
      this.board.array[space.x][space.y].clickedStatus = 'hidden';
    }
    else if(this.board.array[space.x][space.y].clickedStatus === 'hidden'){
      this.board.array[space.x][space.y].clickedStatus = 'flagged';
    }
  }
}
