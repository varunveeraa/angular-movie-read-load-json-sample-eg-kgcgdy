import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICustomer } from './models';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ContactService {
  private baseUrl: string = '../../assets/customers.json';

  onCustomerSelect: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient) { }


  public getCustomers(id: string): Promise<ICustomer> {
    const apiUrl: string = '../../assets/customers.json';

    return this.http.get<ICustomer>(apiUrl + id).toPromise();
  }

}