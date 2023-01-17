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
  received_date: any;
  mode_of_payment: any;
  deposit_to: string;
  transaction_id: number;

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

  getChecked() {
    let obj = [];
    for (let i = 0; i < this.CustIdc.invoices.length; i++) {
      if (this.CustIdc.invoices[i].amount_received != 0) {
        obj.push({
          invoice_no: this.CustIdc.invoices[i].invoice_no,
          invoice_date: this.CustIdc.invoices[i].date,
          invoice_amount: this.CustIdc.invoices[i].invoice_amount,
          actual_due: this.CustIdc.invoices[i].actual_due,
          amount_received: this.CustIdc.invoices[i].amount_received,
          balance: this.CustIdc.invoices[i].balance,
          payment_status: this.CustIdc.invoices[i].payment_status,
        });
      }
    }
    return obj;
  }

  ///////////////////////////////////////////////////////////////////////

  saveData() {
    this.CustId = { ...this.CustIdc };
    let arr = {
      receipt_no: this.CustId.invoices.length + 209,
      amount_received: this.amountReceived,
      mode_of_payment: this.mode_of_payment,
      transaction_id: this.transaction_id,
      deposit_to: this.deposit_to,
      credit_redeemed: this.credVal,
      due_pending: this.findSum(true),
      invoices: this.getChecked(),
    };
    this.CustId.receipts.push(arr);
    console.log(this.CustId.receipts);
  }
}
