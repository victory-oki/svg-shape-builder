import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { IArtboard, Ipoints } from '../models/index.models';
import { BaseComponent } from '../shared/base-component/base-component.component';

@Component({
  selector: 'app-artboard',
  templateUrl: './artboard.component.html',
  styleUrls: ['./artboard.component.scss']
})
export class ArtboardComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas: ElementRef<SVGGElement>;
  @Input() artboard:IArtboard
  @Input() title
  @Output() onUpdateLSPersistence = new EventEmitter();
  shapePoints$:BehaviorSubject<Ipoints[]>
  shape$:BehaviorSubject<any>
  currentShape$:BehaviorSubject<string>
  selectedPoints$: BehaviorSubject<any>;
  selectedIndex = -1;
  fill$: BehaviorSubject<string>;
  stroke$: BehaviorSubject<string>;
  showGrid$: BehaviorSubject<boolean>;
  showPointers$: BehaviorSubject<boolean>;
  constructor() { 
    super()
  }

  ngOnInit(): void {
    this.onColorChange();
    this.updateLsPersistence();
  }

  ngAfterViewInit(){
    this.onShapeChange();
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
    this.addSubscription(
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
    )
  }

  onShapeChange(){
    this.addSubscription(
      this.shape$.subscribe(
        data=>{
          if(data){
            this.canvas.nativeElement.innerHTML = ''
            console.log(typeof data,data)
            let shape:SVGElement = document.createElementNS("http://www.w3.org/2000/svg", null);
            this.canvas.nativeElement.insertAdjacentElement('beforeend', shape);
            (this.canvas.nativeElement.firstChild as HTMLElement).outerHTML = data
          }
        }
      )
    )
  }

  updateLsPersistence(){
    this.addSubscription(
      combineLatest([this.fill$, this.stroke$, this.shape$, this.showGrid$])
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((data) => {
          return of(data)
        })
      ).subscribe(
        _=>{
          this.onUpdateLSPersistence.emit()
        }
      )
    )
  }

  ngOnDestroy(){
    this.clearSubscription()
  }
}
