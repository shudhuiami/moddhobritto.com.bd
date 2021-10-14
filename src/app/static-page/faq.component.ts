import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
declare let $: any;
@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
})
export class FaqComponent implements OnInit  {
    constructor( private router: Router) {

    }

  ngOnInit(): void {
      $('.category-nav').removeClass('show');
  }

}
