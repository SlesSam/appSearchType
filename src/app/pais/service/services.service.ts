import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Country } from '../interface/Country';
import { TvShows } from '../interface/TvShows';
@Injectable({
  providedIn: 'root'
})
export class Service {

  private API:string = 'https://restcountries.com/v3.1';

  private APISeries:string='https://api.tvmaze.com';

  constructor(private httpClient: HttpClient) { }

  buscarEstado(t:string):Observable<Country[]>{

    const api = `${this.API}/name/${t}`

   return this.httpClient.get<Country[]>(api)
  }


  // getSugerencias(palabra:string):Observable<Country[]>{
  //   const url = `${ this.API }/alpha/${ palabra }`;

  //   return this.httpClient.get<Country[]>(url)
  // }

  ///////////////////////SERIES service 

  buscarSerie(termino:string):Observable<TvShows[]>{
    const api = `${this.APISeries}/shows/${termino}`
    return this.httpClient.get<TvShows[]>(api)


  }

}
