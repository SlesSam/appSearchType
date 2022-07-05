import { Component, OnInit } from '@angular/core';
import { Country } from '../../interface/Country';
import { Service } from '../../service/services.service';


@Component({
  selector: 'app-buscador1',
  templateUrl: './buscador1.component.html',
  styleUrls: ['./buscador1.component.css']
})
export class Buscador1Component implements OnInit {

  hayError: boolean = false;
  countrys: Country[]=[];
  palabra:string = '';

  countrysSugeridos: Country[] = [];
  mostrarSugerencias: boolean = false;


  constructor(private paisServi: Service) { }

  
  ngOnInit(): void {
  }


  buscarPais(termino:string){
    this.palabra= termino

    this.paisServi.buscarEstado(termino)
    .subscribe((resPais)=>{
      this.countrys = resPais
      console.log(resPais);
      
    }, (err)=>{
      this.hayError = true
      this.countrys =[]
    });
    
  }


  sugerir(termino:string){
    this.mostrarSugerencias =true;
    this.palabra = termino

    this.paisServi.buscarEstado(termino)
    .subscribe(
      (paises) => {
        this.countrysSugeridos = paises.splice(0,5)
        console.log(paises)

      },
      (err) => {this.countrysSugeridos = [] 
      console.log(this.countrysSugeridos)}
    )
  }


  showSugerencias(termino:string){
      this.buscarPais(termino);
  }

}
