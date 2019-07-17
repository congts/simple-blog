import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, Router} from '@angular/router';
import {PostService} from '../_services/post.service';
import {Post, RoleType} from '../_models';
import {AuthenticationService} from '../_services';

@Injectable({
    providedIn: 'root'
})
export class EditPostResolver implements Resolve<any> {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private postService: PostService) {
    }

    resolve(route: ActivatedRouteSnapshot) {
        return new Promise((resolve) => {
            const userId = route.paramMap.get('id');
            if (!userId) {
                return resolve(null);
            } else {
                this.postService.get(userId)
                    .subscribe(
                        data => {
                            if (!this.canEdit(data)) {
                                this.router.navigate(['/']);
                                return;
                            }
                            resolve({...data, uid: userId});
                        }
                    );
            }
        });
    }

    canEdit(post: Post) {
        const currentUser = this.authenticationService.currentUserValue;
        return currentUser && (currentUser.role === RoleType.ADMIN || post.userUid === currentUser.uid);
    }
}
