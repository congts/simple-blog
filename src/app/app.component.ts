import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import {User} from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    isLoggedIn: boolean;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
    }

    ngOnInit() {
        this.authenticationService.currentUser.subscribe((user: User) => {
            console.log('current user', user);
            this.isLoggedIn = !!user;
        });
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
