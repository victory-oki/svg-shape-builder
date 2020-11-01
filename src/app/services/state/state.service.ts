import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ipoints } from 'src/app/shape-builder/shape-builder.component';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() { }
}

export interface IState{
  artBoards:IArtboard[];
}

export interface IArtboard{
  shapePoints$:BehaviorSubject<Ipoints[]>;
  shape$:BehaviorSubject<any>;
  currentShape$:BehaviorSubject<string>;
  selectedPoints$:BehaviorSubject<any>
  fill$:BehaviorSubject<string>;
  stroke$:BehaviorSubject<string>;
  showGrid$:BehaviorSubject<boolean>;
}