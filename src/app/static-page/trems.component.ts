import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
declare let $: any;
@Component({
    selector: 'app-terms',
    templateUrl: './terms.component.html',
})
export class TremsComponent implements OnInit  {
    constructor( private router: Router) {

    }

  ngOnInit(): void {
      $('.category-nav').removeClass('show');
  }

}
