import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { type Observable, BehaviorSubject } from "rxjs"
import { environment } from '../../environments/environment';


export interface Pharmacy {
  id: number
  name: string
  lat: number
  lng: number
  distance: number
}


    



@Injectable({ providedIn: "root" })
export class PharmacyService {

private baseUrl = environment.apiUrl + '/pharmacies';


  constructor(private readonly http: HttpClient) {}

  getNearby(lat: number, lng: number): Observable<Pharmacy[]> {
    return this.http.get<Pharmacy[]>(`${this.baseUrl}/nearby?lat=${lat}&lng=${lng}&limit=4`)
  }

  getPharmacies(): Observable<Pharmacy[]> {
    const response = this.http.get<Pharmacy[]>(`${this.baseUrl}`);
    console.log(response, "<-- response");
    return response;
  }


}