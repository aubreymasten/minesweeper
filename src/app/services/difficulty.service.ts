import { Injectable } from '@angular/core';
import { Difficulty } from '../models/difficulty.model';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Injectable()
export class DifficultyService {
  difficulties: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase) {
    this.difficulties = db.list('difficulties');
  }

  getDifficulties(){
    return this.difficulties;
  }
}
