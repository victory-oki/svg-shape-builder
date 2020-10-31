import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { createCircle, createPolygon, createStar, generatePolygonPoints, generateStarPoints } from '../helper/control.helper';
import { Ipoints } from '../shape-builder/shape-builder.component';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  shapeForm: FormGroup
  @Input() shapePoints$:BehaviorSubject<Ipoints[]>
  @Input() shape$:BehaviorSubject<any>
  @Input() currentShape$:BehaviorSubject<string>
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
    })
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

  onshapeChange({target:{value}}){
    this.currentShape$.next(value)
  }

  ngOnInit(): void {
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
}


