import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Post} from '../_models';
import {PostService} from '../_services/post.service';
import {AlertService, AuthenticationService} from '../_services';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
    templateUrl: './edit.component.html'
})
export class EditPostComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<any> = new Subject();
    editForm: FormGroup;
    item: Post;
    submitted = false;
    loading = false;

    constructor(private route: ActivatedRoute,
                private fb: FormBuilder,
                private postService: PostService,
                private authenticationService: AuthenticationService,
                private router: Router,
                private alertService: AlertService) {
    }

    ngOnInit() {
        this.route.data.subscribe(routeData => {
            const postData = routeData.data;
            if (postData) {
                this.item = postData;
                this.createForm();
            }
        });
    }

    createForm() {
        this.editForm = this.fb.group({
            title: [this.item.title, Validators.required],
            content: [this.item.content, Validators.required],
            status: [this.item.status, Validators.required]
        });
    }

    get f() {
        return this.editForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.editForm.invalid) {
            return;
        }

        this.loading = true;
        this.postService.update(this.item.uid, this.editForm.value)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                (data) => {
                    console.log('update response', data);
                    this.alertService.success('Update post successful', true);
                    this.router.navigate(['/']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    onDelete() {
        if (confirm('Are you sure to delete this post?')) {
            this.postService.delete(this.item.uid)
                .subscribe(
                    () => {
                        this.alertService.success('Delete post successful', true);
                        this.router.navigate(['/']);
                    },
                    error => {
                        this.alertService.error(error);
                    }
                );
        }
    }

    onCancel() {
        this.router.navigate(['/']);
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
