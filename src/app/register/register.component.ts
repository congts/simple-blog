import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';

import {AlertService, AuthenticationService} from '../_services';
import {Subject} from 'rxjs';

@Component({
    templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<any> = new Subject();
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            role: ['user', Validators.required]
        });
    }

    get f() {
        return this.registerForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.register(
            this.registerForm.get('email').value,
            this.registerForm.get('password').value,
            this.registerForm.get('role').value
        )
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                () => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
