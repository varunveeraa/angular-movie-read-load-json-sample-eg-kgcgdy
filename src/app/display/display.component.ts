import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contacts.service';
import { MatTableModule } from '@angular/material/table';
import * as _ from 'lodash';
import * as cloneDeep from 'lodash';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],
})
export class DisplayComponent implements OnInit {
  CustId: any;
  CustIdc: any;

  public contacts: any;

  amountReceived: number = 0;
  received_date: string;
  mode_of_payment: string;
  deposit_to: string;
  transaction_id: number;

  searchInvoice: string;

  isShowDivIf = false;
  isShowDiv = false;

  credVal: number = 0;

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

  toggleDisplayDivIf() {
    this.isShowDivIf = !this.isShowDivIf;
  }

  // toggleDisplayDiv() {
  //   this.isShowDiv = !this.isShowDiv;
  // }

  ///////////////////////////////////////////////////////////////////////

  updateCredApply() {
    if (this.credVal > this.CustIdc.credits) {
      alert('insufficient credits');
      this.credVal = 0;
    } else {
      this.amountReceived += this.credVal;
      this.CustIdc.credits -= this.credVal;
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

  changeBal(i) {
    if (
      this.CustIdc.invoices[i].amount_received <=
      this.CustIdc.invoices[i].actual_due
    ) {
      if (this.amountReceived != 0) {
        if (this.findSum(false) <= this.amountReceived) {
          this.CustIdc.invoices[i].balance =
            this.CustIdc.invoices[i].actual_due -
            this.CustIdc.invoices[i].amount_received;
          if (this.CustIdc.invoices[i].balance === 0) {
            this.CustIdc.invoices[i].payment_status = 'complete';
          } else if (
            this.CustIdc.invoices[i].balance > 0 &&
            this.CustIdc.invoices[i].balance != 0
          ) {
            this.CustIdc.invoices[i].payment_status = 'partially complete';
          }
        } else {
          alert('insufficient funds!');
          this.CustIdc.invoices[i].amount_received = 0;
        }
      } else {
        alert('enter received amount!');
        this.CustIdc.invoices[i].amount_received = 0;
      }
    } else {
      alert('dont enter value more than required!');
      this.CustIdc.invoices[i].amount_received = 0;
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
          date: this.CustIdc.invoices[i].date
        });
      }
    }
    return obj;
  }

  ///////////////////////////////////////////////////////////////////////

  saveData() {
    if (this.amountReceived != 0) {
      if (this.mode_of_payment != '') {
        if (this.deposit_to != '') {
          if (this.transaction_id != 0) {
            this.CustId = { ...this.CustIdc };
            let arr = {
              receipt_no: this.CustId.invoices.length + 209,
              amount_received: this.amountReceived,
              mode_of_payment: this.mode_of_payment,
              transaction_id: this.transaction_id,
              deposit_to: this.deposit_to,
              credit_redeemed: this.credVal,
              due_pending: this.findSum(true),
              invoices: this.getChecked()
            };
            this.CustId.receipts.push(arr);
            console.log(this.CustId.receipts);
            this.isShowDiv = true;
          } else {
            alert('enter transaction id');
          }
        } else {
          alert('enter deposit to');
        }
      } else {
        alert('enter mode of payment');
      }
    } else {
      alert('enter received amount');
    }
  }
}
