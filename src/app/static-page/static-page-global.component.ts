import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ApiServices} from '../services/api.services';

declare let $: any;

@Component({
  selector: 'app-static-page-global',
  templateUrl: './static-page-global.component.html',
  styleUrls: ['./static-page.css']
})
export class StaticPageComponentGlobal implements OnInit {

  page_slug = '';
  details = null;

  constructor(private router: Router, private http: HttpClient, protected apiService: ApiServices, private route: ActivatedRoute) {
    this.page_slug = this.route.snapshot.paramMap.get('slug');
    router.events.subscribe((event) => {
      this.page_slug = this.route.snapshot.paramMap.get('slug');
      if (event instanceof NavigationEnd) {
        this.getPageDetail();
      }
    });
  }

  getPageDetail = () => {
    this.apiService.getSinglePageGlobal(this.page_slug).subscribe(res => {
      if (res.status === 2000) {
        this.details = res.data;
      }
    });
  }

  ngOnInit(): void {
    $('.category-nav').removeClass('show');
  }

}
