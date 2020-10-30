import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shape-builder',
  templateUrl: './shape-builder.component.html',
  styleUrls: ['./shape-builder.component.scss']
})
export class ShapeBuilderComponent implements OnInit {
  @ViewChild('canvas') canvas: ElementRef<SVGGElement>;
  shapeForm: FormGroup
  constructor(private fb:FormBuilder) { 
    this.shapeForm = this.fb.group({
      shapeType: ['circle', Validators.required],
      polygonNoOfSides: [''],
      polygonLengthOfSides: [''],
      starNoOfSides: [''],
      starLengthOfSides: [''],
      circleCenter: [''],
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

  get circleCenter(){
    return this.shapeForm.get('circleCenter');
  }

  get circleRadius(){
    return this.shapeForm.get('circleRadius');
  }

  ngOnInit(): void {
  }

  createCircle(center, radius){
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", `${center}`);
    circle.setAttribute("cy", `${center}`);
    circle.setAttribute("r", `${radius}`);
    circle.classList.add('path')
    circle.setAttribute("fill", `none`);
    circle.setAttribute("stroke", `#555`);
    return circle
  }

  createPolygon(sides:number, x=50, y=50, r=20){
    let points:Ipoints[] = this.generatePolygonPoints(sides, x, y, r)
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    let pointStr = ''
    points.forEach((point,index)=>{
      pointStr += index===points.length-1? `${point.x} ${point.y}`: `${point.x} ${point.y},`
    })
    polygon.setAttribute("points", `${pointStr}`);
    polygon.classList.add('path');
    polygon.setAttribute("fill", `none`);
    polygon.setAttribute("stroke", `#555`);
    console.log("these are the points >>>", polygon)
    return polygon
  }

  createStar(sides:number, x=50, y=50, r=20){
    let points:Ipoints[] = this.generateStarPoints(sides, x, y, r)
    const star = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let pointStr = ''
    points.forEach((point,index)=>{
      pointStr += index===0? `M ${point.x} ${point.y} `: `L ${point.x} ${point.y} `
    })
    star.setAttribute("d", `${pointStr}z`);
    star.classList.add('path');
    star.setAttribute("fill", `none`);
    star.setAttribute("stroke", `#555`);
    console.log("these are the points >>>", star)
    return star
  }

  generatePolygonPoints(n,x,y,r):Ipoints[]{
    let points = [{x, y:y+r}];
    let theta = Math.PI/2;
    let dTheta = 2*Math.PI/n;

    for(let i=1; i < n; i++){
      theta += dTheta;
      points.push({ x:(x + r*Math.cos(theta)), y:(y + r*Math.sin(theta)) });
    }
    return points;
  }

  generateStarPoints(n,x,y,r):Ipoints[]{
    let points = [{x, y:y+r}];
    let theta = Math.PI/2;
    let innertheta = 2*Math.PI/(2*n);
    let dTheta = 2*Math.PI/n;
    points.push({ x:(x + (r/2)*Math.cos(theta + innertheta)), y:(y + (r/2)*Math.sin(theta + innertheta)) });
    for(let i=1; i < n+1; i++){
      theta += dTheta;
      points.push({ x:(x + r*Math.cos(theta)), y:(y + r*Math.sin(theta)) });
      points.push({ x:(x + (r/2)*Math.cos(theta + innertheta)), y:(y + (r/2)*Math.sin(theta + innertheta)) });
    }
    return points;
  }

  applyChanges(){
    switch(this.shapeType.value){
        case('circle'):
          let circle = this.createCircle(this.circleCenter.value, this.circleRadius.value)
          this.canvas.nativeElement.insertAdjacentElement('afterend', circle)
          console.log(circle)
          break;
        case('polygon'):
          let poly = this.createPolygon(this.polygonNoOfSides.value, 50, 50, this.polygonLengthOfSides.value)
          this.canvas.nativeElement.insertAdjacentElement('afterend', poly)
          break;
        case('star'):
          let star = this.createStar(this.starNoOfSides.value, 50, 50, this.starLengthOfSides.value)
          this.canvas.nativeElement.insertAdjacentElement('afterend', star)
          break;
        default:
          console.log('nothing')
    }
  }
}
export interface Ipoints{
  x:number;
  y:number;
}