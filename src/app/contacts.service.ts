import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICustomer } from './models';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ContactService {
  private baseUrl: string = '../../assets/customers.json';

  onCustomerSelect: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient) {}

  public getCustomers(id: string): Promise<ICustomer> {
    const apiUrl: string = 'http://localhost:6969/Customers/';

    // var xhr = new XMLHttpRequest();
    // xhr.open('GET', 'http://localhost:6969/Customers/', true);
    // xhr.onreadystatechange = function () {
    //   if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
    //     var data = JSON.parse(xhr.responseText);
    //     console.log(data);
    //   }
    // };
    // xhr.send();

    return this.http.get<ICustomer>(apiUrl + id).toPromise();
  }
  putCustData(data: any) {
    return this.http.put(
      '../../assets/customers.json/${data.customer_id}',
      data
    );
  }
}
