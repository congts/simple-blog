import {TestBed, async, inject, fakeAsync} from '@angular/core/testing';
import {PostService} from './_services/post.service';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule, DocumentReference} from '@angular/fire/firestore';
import {Post, PostStatus} from './_models';
import {AuthenticationService} from './_services';

describe('App', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AngularFireModule.initializeApp(environment.firebase),
                AngularFireAuthModule,
                AngularFirestoreModule,
            ],
            providers: [AuthenticationService, PostService]
        });
    });

    it(
        'login successful',
        (done: DoneFn) => inject(
            [AuthenticationService],
            (authenticationService: AuthenticationService) => {
                authenticationService.login('admin@test.com', 'admin123')
                    .subscribe(
                        (user: firebase.User) => {
                            expect(user.uid).toBeTruthy();
                            done();
                        }
                    );
            }
        )()
    );

    it(
        'create post successful',
        (done: DoneFn) => inject(
            [PostService],
            (postService: PostService) => {
                const postData: Post = {
                    title: 'Test Title 1',
                    content: 'Test Content 1',
                    status: PostStatus.ENABLE,
                    userUid: 'BsfhisFyg4fSXvcJqYB6mVn37fZ2'
                };
                postService.create(postData).subscribe(
                    (documentReference: DocumentReference) => {
                        expect(documentReference.id).toBeTruthy();
                        done();
                    }
                );
            }
        )()
    );
    it(
        'update and view post successful',
        (done: DoneFn) => inject(
            [PostService],
            (postService: PostService) => {
                setTimeout(() => {
                    const newContent = 'Test Content 1 Update';
                    postService.all({field: 'createdAt', direction: 'desc'}).subscribe(data => {
                        const postUid = data[0].uid;
                        postService.update(postUid, {content: newContent}).subscribe(
                            () => {
                                postService.get(postUid).subscribe(
                                    (postData) => {
                                        expect(postData.content).toEqual(newContent);
                                        done();
                                    }
                                );
                            }
                        );
                    });
                }, 2000);
            }
        )()
    );
});
