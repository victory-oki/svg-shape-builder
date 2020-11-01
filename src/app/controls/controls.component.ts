import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { createCircle, createPolygon, createStar, generatePolygonPoints, generateStarPoints } from '../helper/control.helper';
import { IArtboard } from '../services/state/state.service';
import { Ipoints } from '../shape-builder/shape-builder.component';
import {
  tap,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from "rxjs/operators";
@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit,OnChanges {
  shapeForm: FormGroup
  @Input() artboard:IArtboard
  @Input() index:number
  @Output() onDeleteArtBoard = new EventEmitter()
  shapePoints$:BehaviorSubject<Ipoints[]>
  shape$:BehaviorSubject<any>
  currentShape$:BehaviorSubject<string>
  selectedPoints$: BehaviorSubject<any>;
  fill$: BehaviorSubject<string>;
  stroke$: BehaviorSubject<string>;
  showGrid$: BehaviorSubject<boolean>;
  constructor(private fb:FormBuilder) {
    this.shapeForm = this.fb.group({
      shapeType: ['circle', Validators.required],
      polygonNoOfSides: [''],
      polygonLengthOfSides: [''],
      starNoOfSides: [''],
      starLengthOfSides: [''],
      circleCenterx: [''],
      circleCentery: [''],
      circleRadius: [''],
      xCoordinaate: [''],
      yCoordinaate: [''],
      showGrid: [`true`],
    })
  }
  ngOnChanges(){
    this.shapePoints$ = this.artboard.shapePoints$
    this.shape$ = this.artboard.shape$
    this.currentShape$ = this.artboard.currentShape$
    this.selectedPoints$ = this.artboard.selectedPoints$   
    this.fill$ = this.artboard.fill$
    this.stroke$ = this.artboard.stroke$
    this.showGrid$ = this.artboard.showGrid$
  }
  get shapeType(){ 
    return this.shapeForm.get('shapeType');
  }

  get polygonNoOfSides(){
    return this.shapeForm.get('polygonNoOfSides');
  }

  get polygonLengthOfSides(){
    return this.shapeForm.get('polygonLengthOfSides');
  }

  get starNoOfSides(){
    return this.shapeForm.get('starNoOfSides');
  }

  get starLengthOfSides(){
    return this.shapeForm.get('starLengthOfSides');
  }

  get circleCenterx(){
    return this.shapeForm.get('circleCenterx');
  }

  get circleCentery(){
    return this.shapeForm.get('circleCentery');
  }

  get circleRadius(){
    return this.shapeForm.get('circleRadius');
  }

  get xCoordinaate(){
    return this.shapeForm.get('xCoordinaate');
  }

  get yCoordinaate(){
    return this.shapeForm.get('yCoordinaate');
  }

  get showGrid(){
    return this.shapeForm.get('showGrid');
  }

  onshapeChange({target:{value}}){
    this.currentShape$.next(value)
  }

  ngOnInit(): void {
    this.setPoint()
    this.onPointValueChange()
    this.onHideOrShowGrid()
  }

  applyChanges(){
    let points = []
    switch(this.shapeType.value){
        case('circle'):
          let circle = createCircle(this.circleCenterx.value, this.circleCentery.value, this.circleRadius.value)
          this.shape$.next(circle)
          break;
        case('polygon'):
          points = generatePolygonPoints(this.polygonNoOfSides.value, 50, 50, this.polygonLengthOfSides.value)
          this.shape$.next(createPolygon(points))
          break;
        case('star'):
          points = generateStarPoints(this.starNoOfSides.value, 50, 50, this.starLengthOfSides.value)
          this.shape$.next(createStar(points))
          break;
        default:
          console.log('nothing')
    }
    console.log("points >>>",points)
    this.shapePoints$.next(points)
  }

  onPointValueChange(){
    combineLatest([this.xCoordinaate.valueChanges, this.yCoordinaate.valueChanges])
    .pipe(
      distinctUntilChanged(),
      debounceTime(500),
      switchMap((data) => {
        return of(data)
      })
    ).subscribe(
      data=>{
        let index = this.selectedPoints$.value.index
        let curPoints = this.shapePoints$.value
        const [x, y] = data
        console.log(x,y,index)
        let oldx =  curPoints[index].x
        let oldy =  curPoints[index].y
        if(!this.isSamePoints(oldx, oldy, x ,y)){
          let newPoints = curPoints
          newPoints[index] = {x,y}
          this.reconstuctShape(newPoints)
        }
      }
    )
  }

  onFillColorChange(event){
    this.fill$.next(event);
    console.log(event, typeof event)
  }

  onHideOrShowGrid(){
    this.showGrid.valueChanges    
    .pipe(
      distinctUntilChanged(),
      debounceTime(500),
      switchMap((data) => {
        return of(data)
      })
    ).subscribe(
      data=>{
        console.log(data)
        this.showGrid$.next(data)
      }
    )
  }
  onStrokeColorChange(event){
    this.stroke$.next(event);
    console.log(event, typeof event) 
  }

  setPoint(){
    this.selectedPoints$.subscribe(
      data=>{
        if(data){
          this.shapeForm.patchValue({
            xCoordinaate: data.x,
            yCoordinaate: data.y,
          })
        }
      }
    )
  }

  reconstuctShape(points){
      switch(this.shapeType.value){
        case('polygon'):
          this.shape$.next(createPolygon(points))
          break;
        case('star'):
          this.shape$.next(createStar(points))
          break;
        default:
          console.log('nothing')
      }
      this.shapePoints$.next(points)
  }

  isSamePoints(x,y,newx,newy){
      return x===newx && y === newy
  }
  fillFullTransparent(){
    let fillTransparent = this.fill$.value[3] === 'a'  && this.fill$.value.slice(this.fill$.value.length -3)=== ',0)'
    return fillTransparent
  }
  strokeFullTransparent(){
    let strokeTransparent = this.stroke$.value[3] === 'a' && this.stroke$.value.slice(this.stroke$.value.length -3)=== ',0)'
    return strokeTransparent
  }
  deleteArtboard(){
    this.onDeleteArtBoard.emit()
  }
}


