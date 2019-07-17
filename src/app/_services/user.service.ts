import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {from} from 'rxjs';
import {User} from '../_models';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    protected path = 'users';

    constructor(private db: AngularFirestore) {
    }

    get(uid) {
        return this.db.doc<User>(`${this.path}/${uid}`).valueChanges();
    }

    create(uid, data: User) {
        return from(this.db.doc<User>(`${this.path}/${uid}`).set(data, { merge: true }));
    }

    update(id: string, data: User) {
        return from(this.db.collection<User>(this.path).doc(id).update(data));
    }

    delete(id) {
        return from(this.db.collection<User>(this.path).doc(id).delete());
    }
}
