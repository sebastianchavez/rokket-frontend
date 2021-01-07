import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl;
  url = '/users/login';

  constructor(private http: HttpClient) { }

  login(request): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.url}`, request);
  }

}
