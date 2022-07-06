import { Component, Input, OnInit } from '@angular/core';
import { Country } from '../../interface/Country';

@Component({
  selector: 'app-informacionComponent',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.css']
})
export class InformacionComponent implements OnInit {

  constructor() { }
  @Input() countrys: any[] =[];
  ngOnInit(): void {
  }

}
