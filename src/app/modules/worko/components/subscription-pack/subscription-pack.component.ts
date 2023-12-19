import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionPackService } from '../../services/subscription-pack.service';

@Component({
  selector: 'app-subscription-pack',
  templateUrl: './subscription-pack.component.html',
  styleUrls: ['./subscription-pack.component.scss']
})
export class SubscriptionPackComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
 
  subscriptionPack:any[]=[];
  subscriptionObj:any={

  }
  

  

  constructor( private subscriptionList : SubscriptionPackService){ }

  ngOnInit(): void {
    this.getSubscriptionDetails();
  }

  getSubscriptionDetails(){
      this.subscriptionList.getSubscription().subscribe({
        next:(Response) =>{
          console.log(Response);
          this.subscriptionPack = Response.data;
        },
        error : (error) =>{
          console.error(error);
        },
        complete : ()=>{

        }
       
      })
  }
  
}
