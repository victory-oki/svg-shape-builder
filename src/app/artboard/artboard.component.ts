import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { IArtboard } from '../services/state/state.service';
import { Ipoints } from '../shape-builder/shape-builder.component';

@Component({
  selector: 'app-artboard',
  templateUrl: './artboard.component.html',
  styleUrls: ['./artboard.component.scss']
})
export class ArtboardComponent implements OnInit, OnChanges {
  @ViewChild('canvas') canvas: ElementRef<SVGGElement>;
  @Input() artboard:IArtboard
  @Input() title
  shapePoints$:BehaviorSubject<Ipoints[]>
  shape$:BehaviorSubject<any>
  currentShape$:BehaviorSubject<string>
  selectedPoints$: BehaviorSubject<any>;
  selectedIndex = -1;
  fill$: BehaviorSubject<string>;
  stroke$: BehaviorSubject<string>;
  showGrid$: BehaviorSubject<boolean>;
  constructor() { 
  }

  ngOnInit(): void {
    this.shape$.asObservable().subscribe(
      data=>{
        if(data){
          this.canvas.nativeElement.innerHTML = ''
          this.canvas.nativeElement.insertAdjacentElement('beforeend', data)
        }
      }
    )
    this.onColorChange()
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
  selectPoint(point, index){
    this.selectedIndex = this.selectedIndex !== index? index : -1
    if(this.selectedIndex === -1){
      this.selectedPoints$.next('')
    }
    else{
      console.log({...point, index})
      this.selectedPoints$.next({...point, index})
    }
  }
  onColorChange(){
    combineLatest([this.fill$, this.stroke$, this.shape$])
    .pipe(
      distinctUntilChanged(),
      debounceTime(500),
      switchMap((data) => {
        return of(data)
      })
    ).subscribe(
      ([fill,stroke])=>{
        console.log(fill,stroke);
        if(this.canvas.nativeElement.firstChild){
          (this.canvas.nativeElement.firstChild as HTMLElement).setAttribute('fill',fill);
          (this.canvas.nativeElement.firstChild as HTMLElement).setAttribute('stroke',stroke)
        }
      }
    )
  }
}
