import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Country } from '../../interface/Country';
import { Service } from "../../service/services.service";

@Component({
    selector: 'app-ver-pais',
    templateUrl: './ver-pais.component.html',
    styles: [
    ]
  })
  export class VerPaisComponent implements OnInit {



    constructor(
      private activeRoute: ActivatedRoute,
      private service:Service
    ){}

    country!:Country;
    ngOnInit(): void {

      



        
    }

    getS(id:string){

      this.service.getSugerencias(id)
          .subscribe( resp=> this.country = resp )
          
    }
}