import {Component, OnInit, Input} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ApiServices} from '../../services/api.services';
import {NavigationEnd, Router,  ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";

declare let $: any;

@Component({
  selector: 'app-top-tags',
  templateUrl: './topTags.component.html',
})
export class topTagsComponent implements OnInit {
  ENV = environment;
  mostSearchData: any = [];
  tagLoading = false;

  @Input() shop_slug: string;

  constructor(protected apiService: ApiServices, private router: Router, private http: HttpClient,) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {

      }
    });
  }
  ngOnInit(): void {
    this.getTopTags()
  }

  FormatText = (text, length) => {
    let newStr = '';

    if (text.length > length) {
      newStr = text.substr(0, length);
      newStr = newStr + '...';
    } else {
      newStr = text;
    }
    return newStr;
  };

  gotosearch = (searchTitle) => {
    this.router.navigate(['/search', searchTitle]);
  }
  getTopTags = () => {
    let _this = this;
    _this.tagLoading = true;
    this.apiService.mostSearch('').subscribe(res => {
      _this.tagLoading = false;
      if (res.status === 2000) {
        this.mostSearchData = res.data;
      } else {

      }
    });
  };
}

