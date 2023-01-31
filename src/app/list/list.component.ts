import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contacts.service';
import { MatOptionSelectionChange } from '@angular/material';
import { ICustomer } from '../models';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  public customers: ICustomer;
  constructor(private myService: ContactService) {}

  public async ngOnInit(): Promise<void> {
    this.customers = await this.myService.getCustomers('');
  }
  public async selected(
    event: MatOptionSelectionChange,
    customer: any
  ): Promise<void> {
    this.myService.onCustomerSelect.next(customer);
  }
}
