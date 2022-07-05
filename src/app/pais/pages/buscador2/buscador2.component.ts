import { Component, OnInit } from '@angular/core';
import { TvShows } from '../../interface/TvShows';
import { Service } from '../../service/services.service';

@Component({
  selector: 'app-buscador2',
  templateUrl: './buscador2.component.html',
  styleUrls: ['./buscador2.component.css']
})
export class Buscador2Component implements OnInit {

  hayError: boolean = false;
  showsSeries: TvShows[]=[];
  palabra:string = '';

  seriesSugeridos: TvShows[] = [];
  mostrarSugerencias: boolean = false;

  constructor(private series: Service) { }

  ngOnInit(): void {
  }

  buscarPais(termino:string){
    this.palabra= termino

    this.series.buscarSerie(termino)
    .subscribe((resSer)=>{
      this.showsSeries = resSer
      console.log(resSer);
      
    }, (err)=>{
      this.hayError = true
      this.showsSeries =[]
    });
    
  }


  sugerir(termino:string){
    this.mostrarSugerencias =true;
    this.palabra = termino

    this.series.buscarSerie(termino)
    .subscribe(
      (series) => {
        this.showsSeries = series.splice(0,5)
        console.log(series)

      },
      (err) => {this.seriesSugeridos = [] 
      console.log(this.seriesSugeridos)}
    )
  }


  showSugerencias(termino:string){
      this.buscarPais(termino);
  }

}
