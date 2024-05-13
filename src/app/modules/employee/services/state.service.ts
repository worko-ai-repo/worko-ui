import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {


  firstTime:boolean = true;

  getState() {
    return this.firstTime;
  }

  setState(state:boolean) {
    this.firstTime = state;
  }
  
}
