import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { IArtboard, IState } from '../services/state/state.service';

@Component({
  selector: 'app-shape-builder',
  templateUrl: './shape-builder.component.html',
  styleUrls: ['./shape-builder.component.scss']
})
export class ShapeBuilderComponent implements OnInit {
  @ViewChild('canvas') canvas: ElementRef<SVGGElement>;
  shapePoints$:BehaviorSubject<Ipoints[]> = new BehaviorSubject([])
  shape$:BehaviorSubject<any> = new BehaviorSubject('')
  currentShape$:BehaviorSubject<string> = new BehaviorSubject('circle')
  shapeForm: FormGroup
  shape:string
  currentShape: any;
  artboards: IArtboard[] = [this.createNewArtBoard()];
  constructor(private fb:FormBuilder) { 

  }

  ngOnInit(): void {
    
  }
  addNewArtBoard(){
    let artboard = this.createNewArtBoard()
    this.artboards.push(artboard)
  }

  createNewArtBoard():IArtboard{
    return {
      shapePoints$: new BehaviorSubject([]),
      shape$: new BehaviorSubject(''),
      currentShape$: new BehaviorSubject('circle')
    }
  }

}
export interface Ipoints{
  x:number;
  y:number;
}