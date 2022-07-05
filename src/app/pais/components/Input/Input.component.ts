import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-Input-Components',
  templateUrl: './Input.component.html',
  styleUrls: ['./Input.component.css']
})
export class InputComponent implements OnInit {


  termino: string = '';

  @Output() onEnter   : EventEmitter<string> = new EventEmitter();
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Input() placeholder: string = '';

  debounce: Subject<string> = new Subject();

  constructor() { }

  ngOnInit(): void {
    this.debounce
      .pipe(debounceTime(300))
      .subscribe( valor =>{
        this.onDebounce.emit(valor)
      })
  }

  buscar(){
    this.onEnter.emit (this.termino)

  }

  presionTeclado(){
    this.debounce.next(this.termino);
  }
 
}
