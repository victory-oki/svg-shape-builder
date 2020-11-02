import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { IArtboard, ILsState, Ipoints } from '../models/index.models';
import { LocalstorageService } from '../services/localstorage/localstorage.service';

@Component({
  selector: 'app-shape-builder',
  templateUrl: './shape-builder.component.html',
  styleUrls: ['./shape-builder.component.scss']
})
export class ShapeBuilderComponent implements OnInit {
  shapePoints$:BehaviorSubject<Ipoints[]> = new BehaviorSubject([])
  shape$:BehaviorSubject<any> = new BehaviorSubject('')
  currentShape$:BehaviorSubject<string> = new BehaviorSubject('circle')
  shapeForm: FormGroup
  shape:string
  currentShape: any;
  artboards: IArtboard[] = [];
  state: IArtboard[] = []
  constructor(private fb:FormBuilder, private ls:LocalstorageService) { 
    this.InitializeArtboards()
  }

  ngOnInit(): void {
    
  }
  addNewArtBoard():void{
    let artboard = this.createNewArtBoard()
    this.artboards.push(artboard)
    this.ls.pushToLocalStorage(artboard)
  }

  createNewArtBoard():IArtboard{
    return {
      shapePoints$: new BehaviorSubject([]),
      shape$: new BehaviorSubject(''),
      currentShape$: new BehaviorSubject('circle'),
      selectedPoints$: new BehaviorSubject(''),
      fill$:new BehaviorSubject('none'),
      stroke$:new BehaviorSubject('#555'),
      showGrid$:new BehaviorSubject(true)
    }
  }

  deleteArtBoard(index):void{
    this.artboards.splice(index,1)
    this.ls.deleteFromLocalStorage(index)
  }

  InitializeArtboards():void{
    let artboards = this.ls.getLocalStorage()
    if(artboards){
      this.setState(artboards);
    }
    else{
      this.ls.setLocalStorage([])
      this.addNewArtBoard()
    }
  }

  updateLSPersistence(index){
    console.log(this.artboards[index])
    this.ls.updateLocalStorage(this.artboards[index],index)
  }

  setState(state:ILsState[]){
    let length = state.length
    for(let i=0; i < length ; i++){
      let artboard = this.createNewArtBoard()
      this.artboards.push(artboard)
      this.artboards[i].shape$.next(state[i].shape$)
      this.artboards[i].fill$.next(state[i].fill$)
      this.artboards[i].stroke$.next(state[i].stroke$)
    }
  }
} 
