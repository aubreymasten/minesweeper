import { Component, OnInit } from '@angular/core';
import { Space } from './space.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  colors: string[] = ['red','orange','green','blue','pink','salmon','darkgray','black'];
  board = [];
  bombs = [];
  difficulties = [
    {
      name: 'beginner',
      x: 8,
      y: 8,
      bombs: 10
    },
    {
      name: 'intermediate',
      x: 16,
      y: 16,
      bombs: 40
    },
    {
      name: 'expert',
      x: 32,
      y: 16,
      bombs: 99
    }
  ]
  difficulty: number = 0;
  initialClick: boolean = true;
  didYouWin;
  ngOnInit(){
    this.genBoard();
  }

  onChange(optionFromMenu) {
    this.didYouWin = '';
    this.difficulty = parseInt(optionFromMenu,10);
    this.genBoard();
    this.initialClick = true;
  }

  genBoard() {
    this.board.length = 0;
    let difficulty = this.difficulties[this.difficulty];
    for(let x = 0; x < difficulty.x; x++){
      this.board.push([]);
      for(let y = 0; y < difficulty.y; y++){
        this.board[x].push(new Space(x,y));
      }
    }
    this.logBoard();
  }

  genBombs(){
    let bombCount = this.difficulties[this.difficulty].bombs
    let xMax = this.difficulties[this.difficulty].x;
    let yMax = this.difficulties[this.difficulty].y;
    this.bombs.length = 0;
    for(let bombs = 0; bombs < bombCount; bombs++){
      let x:number, y:number;
      do {
        x = Math.floor(Math.random() * xMax);
        y = Math.floor(Math.random() * yMax);
      } while(this.board[x][y].isBomb);
      this.board[x][y].isBomb = true;
      this.bombs.push([x,y]);
    }
    this.countBombs();
    this.setBombs();
  }

  setBombs(){
    this.bombs.forEach((bomb)=>{
      this.board[bomb[0]][bomb[1]].bombCount = 9;
    });
  }

  countBombs(){
    this.bombs.forEach((bomb)=>{
      for(let i = bomb[0]-1; i < bomb[0]+2; i++){
        for(let n = bomb[1]-1; n < bomb[1]+2; n++){
          if(this.isValid(i, n)) this.board[i][n].bombCount += 1;
        }
      }
    });
  }

  isValid(x:number, y:number){
    return x >= 0 && x < this.board.length && y >= 0 && y < this.board[0].length;
  }

  logBoard(){
    let line = '';
    for(let x = 0; x < this.board.length; x++){
      for(let y = 0; y < this.board[0].length; y++){
        if(this.board[x][y].isBomb){
          line = line.concat('B  ');
        } else {
          line = line.concat(`${this.board[x][y].bombCount}  `);
        }
      }
      // console.log(`${x}: ${line}`);
      line = '';
    }
  }

  updateBoard(space: Space){
    if(this.initialClick) {
      do {
        this.genBoard();
        this.genBombs();
      } while(this.board[space.x][space.y].bombCount !== 0 || this.board[space.x][space.y].isBomb)
      this.initialClick = false;
    }
    if(this.board[space.x][space.y].clickedStatus !== 'flagged'){
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
    for(let x = 0; x < this.board.length; x++){
      for(let y = 0; y < this.board[0].length; y++){
        this.board[x][y].isClicked = true;
        this.board[x][y].clickedStatus = 'revealed';
      }
    }
    this.didYouWin = 'GAME OVER'
  }

  victory(){
    let totalClicked = 0;
    for(let x = 0; x < this.board.length; x++){
      for(let y = 0; y < this.board[0].length; y++){
        if(this.board[x][y].isClicked === true){
          totalClicked += 1;
        }
      }
    }

    if(totalClicked === ((this.difficulties[this.difficulty].x * this.difficulties[this.difficulty].y) - this.difficulties[this.difficulty].bombs)){
      this.didYouWin = 'Victory is yours!'
    }
  }

  reveal(x: number, y: number){
    if(x >= 0 && x < this.board.length && y >= 0 && y < this.board[0].length && !this.board[x][y].isClicked && !this.board[x][y].isBomb && this.board[x][y].clickedStatus !== 'flagged'){
      this.board[x][y].isClicked = true;
      this.board[x][y].clickedStatus = 'revealed';
      if(this.board[x][y].bombCount === 0){
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

  getColor(index: string){
    return this.colors[parseInt(index,10)];
  }

  flagThat(space: Space) {
    if(this.board[space.x][space.y].clickedStatus === 'flagged'){
      this.board[space.x][space.y].clickedStatus = 'hidden';
    }
    else if(this.board[space.x][space.y].clickedStatus === 'hidden'){
      this.board[space.x][space.y].clickedStatus = 'flagged';
    }
  }
}
