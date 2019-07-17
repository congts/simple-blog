import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PostService} from '../_services/post.service';
import {AlertService, AuthenticationService} from '../_services';
import {Post, User} from '../_models';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
    templateUrl: './create.component.html'
})
export class CreatePostComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<any> = new Subject();
    private currentUser: User;
    newForm: FormGroup;
    submitted = false;
    loading = false;

    constructor(private fb: FormBuilder,
                private router: Router,
                private postService: PostService,
                private authenticationService: AuthenticationService,
                private alertService: AlertService) {
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.newForm = this.fb.group({
            title: ['', Validators.required],
            content: ['', Validators.required],
            status: [1, Validators.required]
        });
    }

    get f() {
        return this.newForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.newForm.invalid) {
            return;
        }

        this.loading = true;
        const formValue: Post = this.newForm.value;
        this.postService.create({
            ...formValue,
            userUid: this.currentUser.uid
        })
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
            () => {
                this.alertService.success('Create post successful', true);
                this.router.navigate(['/']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
