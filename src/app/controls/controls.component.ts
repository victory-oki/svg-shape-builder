import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { createCircle, createPolygon, createStar, generatePolygonPoints, generateStarPoints, createEllipse } from '../helper/control.helper';

import {
  tap,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from "rxjs/operators";
import { BaseComponent } from '../shared/base-component/base-component.component';
import { IArtboard, Ipoints } from '../models/index.models';
@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent extends BaseComponent implements OnInit,OnChanges,OnDestroy {
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
  showPointers$: BehaviorSubject<boolean>;
  constructor(private fb:FormBuilder) {
    super()
    this.shapeForm = this.fb.group({
      shapeType: ['circle', Validators.required],
      polygonNoOfSides: [''],
      polygonLengthOfSides: [''],
      starNoOfPoints: [''],
      starRadius: [''],
      circleCenterx: ['50',[Validators.required, Validators.max(100), Validators.min(0)]],
      circleCentery: ['50',[Validators.required, Validators.max(100), Validators.min(0)]],
      circleRadius: ['', [Validators.required, Validators.max(50), Validators.min(1)]],
      ellipseRadiusx: [''],
      ellipseRadiusy: [''],
      xCoordinate: [''],
      yCoordinate: [''],
      showGrid: [true],
      showPointers: [true],
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
    this.showPointers$ = this.artboard.showPointers$
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

  get starNoOfPoints(){
    return this.shapeForm.get('starNoOfPoints');
  }

  get starRadius(){
    return this.shapeForm.get('starRadius');
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

  get xCoordinate(){
    return this.shapeForm.get('xCoordinate');
  }

  get yCoordinate(){
    return this.shapeForm.get('yCoordinate');
  }

  get ellipseRadiusx(){
    return this.shapeForm.get('ellipseRadiusx');
  }

  get ellipseRadiusy(){
    return this.shapeForm.get('ellipseRadiusy');
  }

  get showGrid(){
    return this.shapeForm.get('showGrid');
  }

  get showPointers(){
    return this.shapeForm.get('showPointers');
  }

  onshapeChange({target:{value}}){
    this.currentShape$.next(value)
    this.shapeForm.setErrors({ 'invalid': true });
  }

  ngOnInit(): void {
    this.setPoint()
    this.onPointValueChange()
    this.setAndUpdateFormValidity()
    this.onPointerToggle()
    this.onHideOrShowGrid()
  }

  applyChanges(){
    let points = []
    switch(this.shapeType.value){
        case('circle'):
          let circle = createCircle(this.circleCenterx.value, this.circleCentery.value, this.circleRadius.value)
          this.shape$.next(circle)
          break;
        case('ellipse'):
          let ellipse = createEllipse(this.circleCenterx.value, this.circleCentery.value, this.ellipseRadiusx.value, this.ellipseRadiusy.value)
          this.shape$.next(ellipse)
          break;
        case('polygon'):
          points = generatePolygonPoints(this.polygonNoOfSides.value, 50, 50, this.polygonLengthOfSides.value)
          this.shape$.next(createPolygon(points))
          break;
        case('star'):
          points = generateStarPoints(this.starNoOfPoints.value, 50, 50, this.starRadius.value)
          this.shape$.next(createStar(points))
          break;
        default:
          console.log('nothing')
    }
    console.log("points >>>",points)
    this.shapePoints$.next(points)
  }

  onPointValueChange(){
    this.addSubscription(
      combineLatest([this.xCoordinate.valueChanges, this.yCoordinate.valueChanges])
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

    )
  }

  onFillColorChange(event){
    this.fill$.next(event);
    console.log(event, typeof event)
  }

  onHideOrShowGrid(){
    this.addSubscription(
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
    )
  }

  onPointerToggle(){
    this.addSubscription(
      this.showPointers.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((data) => {
          return of(data)
        })
      ).subscribe(
        (data)=>{
          this.showPointers$.next(data)
        }
      )
    )
  }

  onStrokeColorChange(event){
    this.stroke$.next(event);
    console.log(event, typeof event) 
  }

  setPoint(){
    this.addSubscription(
      this.selectedPoints$.subscribe(
        data=>{
          if(data){
            this.shapeForm.patchValue({
              xCoordinate: data.x,
              yCoordinate: data.y,
            })
          }
        }
      )
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
    let isNone = this.fill$.value === 'none'
    let fillTransparent = (this.fill$.value[3] === 'a'  && this.fill$.value.slice(this.fill$.value.length -3)=== ',0)')
    return fillTransparent || isNone
  }

  strokeFullTransparent(){
    let strokeTransparent = this.stroke$.value[3] === 'a' && this.stroke$.value.slice(this.stroke$.value.length -3)=== ',0)'
    return strokeTransparent
  }

  deleteArtboard(){
    this.onDeleteArtBoard.emit()
  }

  setAndUpdateFormValidity(){
    this.addSubscription(
      this.shapeType.valueChanges
      .subscribe(
        data=>{
          this.removeValidators(this.shapeForm);
          this.shapeForm.setErrors({ 'invalid': true });
          console.log(data)
          switch(data){
            case ('circle'):
              this.circleCenterx.setValidators([Validators.required, Validators.max(100), Validators.min(0)])
              this.circleCentery.setValidators([Validators.required, Validators.max(100), Validators.min(0)])
              this.circleRadius.setValidators([Validators.required, Validators.max(50), Validators.min(1)])
              this.shapeForm.patchValue({
                circleCenterx:'50',
                circleCentery: '50'
              })
              break;
            case ('ellipse'):
              this.circleCenterx.setValidators([Validators.required, Validators.max(100), Validators.min(0)])
              this.circleCentery.setValidators([Validators.required, Validators.max(100), Validators.min(0)])
              this.ellipseRadiusx.setValidators([Validators.required, Validators.max(50), Validators.min(1)])
              this.ellipseRadiusy.setValidators([Validators.required, Validators.max(50), Validators.min(1)])
                            this.shapeForm.patchValue({
                circleCenterx:'50',
                circleCentery: '50'
              })
              break;
            case ('polygon'):
              this.polygonNoOfSides.setValidators([Validators.required, Validators.max(15), Validators.min(3)])
              this.polygonLengthOfSides.setValidators([Validators.required, Validators.max(60), Validators.min(10)])
              break;
            case ('star'):
              this.starNoOfPoints.setValidators([Validators.required, Validators.max(15), Validators.min(4)])
              this.starRadius.setValidators([Validators.required, Validators.max(50), Validators.min(10)])
              break;
          }
          this.shapeForm.updateValueAndValidity()
        }
      )
    )
  }

  public removeValidators(form: FormGroup) {
    for (const key in form.controls) {
      if(!['shapeType','xCoordinate','yCoordinate'].includes(key)){
        form.get(key).clearValidators();
        form.get(key).updateValueAndValidity();
      }
   }
  }

  ngOnDestroy(){
    this.clearSubscription()
  }
}


