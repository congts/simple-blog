import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '../_services/post.service';
import {Observable, Subject} from 'rxjs';
import {Post, PostStatus, RoleType, User} from '../_models';
import {AuthenticationService} from '../_services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<any> = new Subject();
    posts$: Observable<Post[]>;
    currentUser: User;
    sortByForm: FormGroup;
    postStatus = PostStatus;

    constructor(private fb: FormBuilder,
                private postService: PostService,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        this.authenticationService.currentUser.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe((user: User) => {
            this.currentUser = user;
            if (this.currentUser) {
                this.posts$ = this.postService.all({field: 'createdAt', direction: 'desc'});
            } else {
                this.posts$ = this.postService.getPublishedItems({field: 'createdAt', direction: 'desc'});
            }
        });
        this.sortByForm = this.fb.group({
            field: ['createdAt', Validators.required],
            direction: ['desc', Validators.required]
        });
        this.sortByForm.valueChanges.pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(data => {
            if (this.currentUser) {
                this.posts$ = this.postService.all(data);
            } else {
                this.posts$ = this.postService.getPublishedItems(data);
            }
        });
    }

    get directionValue() {
        return this.sortByForm.get('direction').value;
    }

    canEdit(post: Post) {
        return this.currentUser && (this.currentUser.role === RoleType.ADMIN || post.userUid === this.currentUser.uid);
    }

    changeDirection(direction: string) {
        this.sortByForm.get('direction').setValue(direction);
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
