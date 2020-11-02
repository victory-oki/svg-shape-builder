import { Injectable } from '@angular/core';
import { IArtboard, ILsState } from 'src/app/models/index.models';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  getLocalStorage():any[]{
   return JSON.parse(localStorage.getItem('artboards'))
  }

  setLocalStorage(state:any[]){
    localStorage.setItem('artboards', JSON.stringify(state))
  }

  pushToLocalStorage(value){
    let state = this.getLocalStorage()
    state.push(this.convertSubjectToValue(value))
    this.setLocalStorage(state)
  }

  updateLocalStorage(value,index){
    let state = this.getLocalStorage()
    let updatedValue = this.convertSubjectToValue(value)
    state[index] = updatedValue
    this.setLocalStorage(state)
  }

  deleteFromLocalStorage(index){
    let state = this.getLocalStorage()
    state.splice(index,1)
    this.setLocalStorage(state)
  }

  convertSubjectToValue(artboard:IArtboard):ILsState{
    return{
      shape$: `${(artboard.shape$.value)}`,
      fill$: artboard.fill$.value,
      stroke$: artboard.stroke$.value,
    }
  }
}

