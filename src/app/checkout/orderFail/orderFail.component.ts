import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthServices} from '../../services/auth.services';
import {Store} from '@ngrx/store';

declare let $: any;

@Component({
  selector: 'app-order-fail',
  templateUrl: './orderFail.component.html',
})
export class orderFailComponent implements OnInit {
  ENV = environment;
  Auth = null;

  $store: any = null;
  constructor(private store: Store<{store}>, private router: Router, private http: HttpClient, protected authServices: AuthServices, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.$store = this.store.select("store").subscribe((data) => {
      this.Auth = data.auth;
    })
  }
  ngOnDestroy(){
    this.$store.unsubscribe();
  }

}
