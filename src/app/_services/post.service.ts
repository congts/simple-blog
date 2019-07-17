import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {from, Observable} from 'rxjs';
import {OrderBy, Post, PostStatus, User} from '../_models';
import {formatDate} from '@angular/common';

@Injectable({
    providedIn: 'root'
})

export class PostService {
    protected path = 'posts';

    constructor(private db: AngularFirestore) {
    }

    all(orderBy: OrderBy): Observable<Post[]> {
        return this.db.collection<Post>(this.path,
            ref => ref.orderBy(orderBy.field, orderBy.direction))
            .valueChanges({idField: 'uid'});
    }

    getPublishedItems(orderBy: OrderBy) {
        return this.db.collection<Post>(this.path,
            ref => ref.where('status', '==', PostStatus.ENABLE)
                .orderBy(orderBy.field, orderBy.direction))
            .valueChanges({idField: 'uid'});
    }

    get(uid): Observable<Post> {
        return this.db.doc<Post>(`${this.path}/${uid}`).valueChanges();
    }

    create(data: Post) {
        data.createdAt = formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en');
        data.updatedAt = formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en');
        return from(this.db.collection<Post>(this.path).add(data));
    }

    update(id, data) {
        data.updatedAt = formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en');
        return from(this.db.collection<Post>(this.path).doc(id).update(data));
    }

    delete(id) {
        return from(this.db.collection<Post>(this.path).doc(id).delete());
    }
}
