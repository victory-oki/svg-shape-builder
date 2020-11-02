import { BehaviorSubject } from 'rxjs';

export interface IArtboard{
  shapePoints$:BehaviorSubject<Ipoints[]>;
  shape$:BehaviorSubject<any>;
  currentShape$:BehaviorSubject<string>;
  selectedPoints$:BehaviorSubject<any>
  fill$:BehaviorSubject<string>;
  stroke$:BehaviorSubject<string>;
  showGrid$:BehaviorSubject<boolean>;
  showPointers$ :BehaviorSubject<boolean>;
}

export interface ILsState{
  shape$: any;
  fill$: string;
  stroke$: string;
}

export interface Ipoints{
  x:number;
  y:number;
}