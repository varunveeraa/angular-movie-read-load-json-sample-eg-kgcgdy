import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contacts.service';

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

  constructor(private myService: ContactService) {}

  public async ngOnInit(): Promise<void> {
    this.myService.onCustomerSelect.subscribe((value) => {
      this.CustId = value;
    });
    this.CustIdc = { ...this.CustId };
  }

  lilnigga() {
    let nigga = false;

    if (nigga == false) {
      alert(this.CustIdc);
    }
  }

  toggleDisplayDivIf() {
    this.isShowDivIf = !this.isShowDivIf;
  }

  updateCredApply() {
    this.totalRcvdAmt = this.credVal + this.amountReceived;
  }

  changeBal(i) {
    if (
      this.CustId.invoices[i].amount_received >
      this.CustId.invoices[i].actual_due
    ) {
      alert('enter valid amount');
      this.CustId.invoices[i].amount_received = 0;
    } else if (this.amountReceived === 0) {
      alert('enter amount received');
      this.CustId.invoices[i].amount_received = 0;
    } else if (this.findSum(false) > this.CustId.invoices[i].amount_received) {
      alert('insufficent funds');
      this.CustId.invoices[i].amount_received = 0;
    } else {
      this.CustId.invoices[i].balance -=
        this.CustId.invoices[i].amount_received;
      if (this.CustId.invoices[i].balance === 0) {
        this.CustId.invoices[i].payment_status = 'complete';
      } else if (
        this.CustId.invoices[i].balance > 0 &&
        this.CustId.invoices[i].balance != 0
      ) {
        this.CustId.invoices[i].payment_status = 'partially complete';
      }
    }
  }

  findSum(i) {
    let sum = 0;
    if (i == true) {
      for (let x = 0; x < this.CustId.invoices.length; x++) {
        sum += this.CustId.invoices[x].balance;
      }
      return sum;
    } else {
      for (let x = 0; x < this.CustId.invoices.length; x++) {
        sum += this.CustId.invoices[x].amount_received;
      }
      return sum;
    }
  }

  checkAmt() {
    if (this.amountReceived > this.CustId.amount_receivable) {
      this.CustId.credits +=
        this.amountReceived - this.CustId.amount_receivable;
    }
  }
}
