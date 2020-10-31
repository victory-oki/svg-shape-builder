import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ipoints } from '../shape-builder/shape-builder.component';

@Component({
  selector: 'app-artboard',
  templateUrl: './artboard.component.html',
  styleUrls: ['./artboard.component.scss']
})
export class ArtboardComponent implements OnInit {
  @ViewChild('canvas') canvas: ElementRef<SVGGElement>;
  @Input() title
  @Input() shapePoints$:BehaviorSubject<Ipoints[]>
  @Input() shape$:BehaviorSubject<any>
  @Input() currentShape$:BehaviorSubject<string>
  constructor() { }

  ngOnInit(): void {
    this.shape$.asObservable().subscribe(
      data=>{
        if(data){
          this.canvas.nativeElement.innerHTML = ''
          this.canvas.nativeElement.insertAdjacentElement('beforeend', data)
        }
      }
    )
  }
  selectPoint(point){
    console.log(point)
  }
}
