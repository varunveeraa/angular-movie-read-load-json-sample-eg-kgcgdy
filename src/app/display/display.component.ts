import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contacts.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  public contacts: any;

  CustId: any;
  constructor(private myService: ContactService) { }

  public async ngOnInit(): Promise<void> {
    this.myService.onCustomerSelect.subscribe(value => {
      this.CustId = value;
    })
  }

  stringPrint() {
    return(JSON.stringify(this.CustId.invoice))
  }

}