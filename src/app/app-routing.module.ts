import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Buscador1Component } from './pais/pages/buscador1/buscador1.component';
import { Buscador2Component } from './pais/pages/buscador2/buscador2.component';
import { Buscador3Component } from './pais/pages/buscador3/buscador3.component';
import { VerPaisComponent } from './pais/pages/verPais/verPais.component';

const routes: Routes = [
  {
    path:'',
    component: Buscador1Component,
    pathMatch: 'full'
  },
  {
    path: 'buscador2',
    component: Buscador2Component,
    
  },
  {
    path: 'buscador3',
    component: Buscador3Component
  },
  {
        path: 'verPais/:id',
        component: VerPaisComponent
  },

  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
