import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contacts.service';
import * as _ from 'lodash';
import * as cloneDeep from 'lodash';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],
})
export class DisplayComponent implements OnInit {
  public contacts: any;

  amountReceived: number = 0;

  searchInvoice: string;

  totalRcvdAmt: number;

  CustId: any;

  CustIdc: any;

  isShowDivIf = false;

  credVal: number = 0;

  showContent: any;

  constructor(private myService: ContactService) {}

  ///////////////////////////////////////////////////////////////////////

  public async ngOnInit(): Promise<void> {
    this.myService.onCustomerSelect.subscribe((value) => {
      this.CustId = value;
      // this.CustIdc = { ...this.CustId };
      // this.CustIdc = cloneDeep(this.CustId);
      this.CustIdc = JSON.parse(JSON.stringify(this.CustId));
    });
  }

  ///////////////////////////////////////////////////////////////////////

  lilnigga() {
    console.log(_.isEqual(this.CustIdc, this.CustId));
  }

  ///////////////////////////////////////////////////////////////////////

  toggleDisplayDivIf() {
    this.isShowDivIf = !this.isShowDivIf;
  }

  ///////////////////////////////////////////////////////////////////////

  updateCredApply() {
    this.totalRcvdAmt = this.credVal + this.amountReceived;
  }

  ///////////////////////////////////////////////////////////////////////

  changeBal(i) {
    if (
      this.CustIdc.invoices[i].amount_received >
      this.CustIdc.invoices[i].actual_due
    ) {
      alert('enter valid amount');
      this.CustIdc.invoices[i].amount_received = 0;
    } else if (this.amountReceived === 0) {
      alert('enter amount received');
      this.CustIdc.invoices[i].amount_received = 0;
    }
    // else if (this.findSum(false) > this.CustIdc.invoices[i].amount_received) {
    //   alert('insufficent funds');
    //   this.CustIdc.invoices[i].amount_received = 0;
    // }
    else {
      this.CustIdc.invoices[i].balance -=
        this.CustIdc.invoices[i].amount_received;
      if (this.CustIdc.invoices[i].balance === 0) {
        this.CustIdc.invoices[i].payment_status = 'complete';
      } else if (
        this.CustIdc.invoices[i].balance > 0 &&
        this.CustIdc.invoices[i].balance != 0
      ) {
        this.CustIdc.invoices[i].payment_status = 'partially complete';
      }
    }
  }

  ///////////////////////////////////////////////////////////////////////

  findSum(i) {
    let sum = 0;
    if (i == true) {
      for (let x = 0; x < this.CustIdc.invoices.length; x++) {
        sum += this.CustIdc.invoices[x].balance;
      }
      return sum;
    } else {
      for (let x = 0; x < this.CustIdc.invoices.length; x++) {
        sum += this.CustIdc.invoices[x].amount_received;
      }
      return sum;
    }
  }

  ///////////////////////////////////////////////////////////////////////

  checkAmt() {
    if (this.amountReceived > this.CustIdc.amount_receivable) {
      this.CustIdc.credits +=
        this.amountReceived - this.CustIdc.amount_receivable;
    }
  }

  ///////////////////////////////////////////////////////////////////////

  saveData() {
    this.CustId = { ...this.CustIdc };
    console.log(this.CustId);
  }
}
