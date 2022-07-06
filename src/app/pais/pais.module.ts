import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Buscador1Component } from './pages/buscador1/buscador1.component';
import { Buscador2Component } from './pages/buscador2/buscador2.component';
import { Buscador3Component } from './pages/buscador3/buscador3.component';
import { InputComponent } from './components/FormPais/Input.component';
import { InformacionComponent } from './components/List-Pais/informacion.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    Buscador1Component,
    Buscador2Component,
    Buscador3Component,
    InputComponent,
    InformacionComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
    
    
  ],
  exports:[
    Buscador1Component,
    Buscador2Component,
    Buscador3Component

  ]
})
export class PaisModule { }
