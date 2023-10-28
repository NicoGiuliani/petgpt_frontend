import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'
import { MyResponse } from './interfaces';

interface ResponseObject {
  [key: string]: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PetGPT';
  isLoading = false;
  result = '';
  searchTerm: string = '';
  searchResult: string = '';

  constructor(private http: HttpClient) {}

  sendDataToBackend = async () => {
    const url = `${environment.apiUrl}/api/send-data`
    this.isLoading = true;
    await this.http.post<MyResponse>(url, { data: this.searchTerm })
      .subscribe((response) => {
        this.isLoading = false;
        this.searchResult = response.message.content;
      });
  }

}
