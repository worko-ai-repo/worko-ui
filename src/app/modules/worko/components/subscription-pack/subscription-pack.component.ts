import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionPackService } from '../../services/subscription-pack.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subscription-pack',
  templateUrl: './subscription-pack.component.html',
  styleUrls: ['./subscription-pack.component.scss']
})
export class SubscriptionPackComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() package: any;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Output() onError: EventEmitter<void> = new EventEmitter<void>();
  subscriptionList:any[]=[];

  subscriptionObj:any={
    SK:"",
    amount:0,
    details:"",
    duration:0,
    isActive:true,
    name:"",
    referralCount:0,
  }


  constructor( private subscriptionPack : SubscriptionPackService){}

  ngOnInit(): void {
    this.getSubcriptionPack()
    // throw new Error('Method not implemented.');

  }
 

  makeOrder(item: any){
    // const data = 'Hello from child component!';
    this.onSuccess.emit();
    // this.onError.emit();
  }
  getSubcriptionPack(){
    this.subscriptionPack.getSubscription().subscribe({
        next: (response) => {
          // console.log(response);
           this.subscriptionList = response;
            console.log(this.subscriptionList,"Hello")
        },
        error: (error) => {
          debugger;
          console.error(error);
          
          
        },
        complete: () => {
         
        }
      });
    }

}
