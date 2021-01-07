import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private baseUrl = environment.apiUrl;
  private url1 = '/animals/create';
  private url2 = '/animals/delete';
  private url3 = '/animals/get-all';
  private url4 = '/animals/save-image';

  constructor(private http: HttpClient) { }

  save(request): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.url1}`, request);
  }

  delete(id): Observable<any> {
    return this.http.delete(`${this.baseUrl}${this.url2}/${id}`);
  }

  getAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}${this.url3}`);
  }

  saveImage(request): Observable<any> {
    return this.http.put(`${this.baseUrl}${this.url4}`, request);
  }
}
