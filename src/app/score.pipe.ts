import { Pipe, PipeTransform } from '@angular/core';
import { Score } from './score.model';

@Pipe({
  name: 'score',
  pure: false
})
export class ScorePipe implements PipeTransform {
  transform(input: Score[], args) {
    return input.filter(function(s){return s.difficulty === args}).sort(function(a,b){
      if (a.score < b.score) return -1;
      if (a.score > b.score) return 1;
      else return 0;
    });
  }

}
