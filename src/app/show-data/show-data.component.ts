import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contacts.service';


@Component({
  selector: 'app-show-data',
  templateUrl: './show-data.component.html',
  styleUrls: ['./show-data.component.css']
})
export class ShowDataComponent implements OnInit {

  CustId: any;

  constructor(private myService: ContactService) {}

  public async ngOnInit(): Promise<void> {
    this.myService.onCustomerSelect.subscribe((value) => {
      this.CustId = value;
    });
  }
  
}