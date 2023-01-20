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

  amountReceived: number = null;
  received_date: string = '';
  mode_of_payment: string = '';
  deposit_to: string = '';
  transaction_id: number = null;

  // searchInvoice: string = '';
  // searchParams = { invoice: '' };

  isShowDivIf = false;
  isShowDiv = false;
  isShowDiv1 = false;

  credVal: number = null;
  totalAmt: number = 0;

  upTbl: boolean = false;

  constructor(private myService: ContactService) {}

  ///////////////////////////////////////////////////////////////////////

  public async ngOnInit(): Promise<void> {
    this.myService.onCustomerSelect.subscribe((value) => {
      this.CustId = value;
      // this.CustIdc = { ...this.CustId };
      // this.CustIdc = cloneDeep(this.CustId);
      this.CustIdc = JSON.parse(JSON.stringify(this.CustId));
      this.isShowDiv1 = true;
    });
  }

  ///////////////////////////////////////////////////////////////////////

  toggleDisplayDivIf() {
    this.isShowDivIf = !this.isShowDivIf;
  }

  // toggleDisplay() {
  //   this.isShowDiv = !this.isShowDiv;
  // }

  ///////////////////////////////////////////////////////////////////////

  revertForm() {
    this.CustIdc = this.CustId;
    this.amountReceived = null;
    this.received_date = '';
    this.mode_of_payment = '';
    this.deposit_to = '';
    this.transaction_id = null;
    this.credVal = null;
    this.totalAmt = 0;
    for (let i = 0; this.CustIdc.invoices.length; i++) {
      this.CustIdc.invoices[i].amount_received = 0;
    }
  }

  ///////////////////////////////////////////////////////////////////////

  updateCredApply() {
    if (this.credVal > this.CustIdc.credits) {
      alert('insufficient credits');
      this.credVal = 0;
    } else {
      this.totalAmt += this.credVal;
      this.CustIdc.credits -= this.credVal;
    }
  }

  ///////////////////////////////////////////////////////////////////////

  // search() {
  //   let filter = { invoice: this.searchInvoice.trim() };
  //   this.searchParams = filter;
  // }

  ///////////////////////////////////////////////////////////////////////

  checkAmt() {
    this.totalAmt += this.amountReceived;
    if (this.amountReceived > this.CustIdc.amount_receivable) {
      if (confirm('add excessive to credits?')) {
        this.CustIdc.credits +=
          this.amountReceived - this.CustIdc.amount_receivable;
        alert('credit updated');
      }
    }
    this.upTbl = false;
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
      if (this.amountReceived != null) {
        if (this.findSum(false) <= this.totalAmt) {
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
          date: this.CustIdc.invoices[i].date,
        });
      }
    }
    return obj;
  }

  ///////////////////////////////////////////////////////////////////////

  saveData() {
    if (this.amountReceived != null) {
      if (this.mode_of_payment != '') {
        if (this.deposit_to != '') {
          if (this.received_date != '') {
            if (this.transaction_id != null) {
              if (this.findSum(false) != 0) {
                this.CustId = { ...this.CustIdc };
                this.CustId.amount_receivable = this.findSum(true);
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
                this.isShowDiv = true;
                this.upTbl = true;
                this.CustIdc = { ...this.CustId };
                this.revertForm();
              } else {
                alert('select invoices');
              }
            } else {
              alert('enter transaction id');
            }
          } else {
            alert('enter transaction date');
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
