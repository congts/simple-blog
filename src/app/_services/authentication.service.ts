import {Injectable} from '@angular/core';
import {BehaviorSubject, from, Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserService} from './user.service';
import {User} from '../_models';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
    static STORAGE_KEY_USER = 'currentUser';

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;


    constructor(private afAuth: AngularFireAuth,
                private userService: UserService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return from(this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then((result) => {
                const user = result.user;
                this.userService.get(user.uid).subscribe((data) => {
                    const userData = data;
                    localStorage.setItem(AuthenticationService.STORAGE_KEY_USER, JSON.stringify({...userData, data: user}));
                    this.currentUserSubject.next({
                        uid: userData.uid,
                        email: userData.email,
                        role: userData.role,
                        data: user
                    });
                });
                return user;
            }).catch((error) => {
                throw error.message;
            }));
    }

    register(email: string, password: string, role: string) {
        return from(this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then((result) => {
                const user = result.user;
                const userData: User = {
                    uid: user.uid,
                    email: user.email,
                    role: role
                }
                this.userService.create(user.uid, userData).subscribe(() => {
                    localStorage.setItem(AuthenticationService.STORAGE_KEY_USER, JSON.stringify({...userData, data: user}));
                    this.currentUserSubject.next({
                        ...userData,
                        data: user
                    });
                });
                return of({...userData, data: user});
            }).catch((error) => {
                throw error.message;
            }));
    }

    logout() {
        this.afAuth.auth.signOut();
        localStorage.removeItem(AuthenticationService.STORAGE_KEY_USER);
        this.currentUserSubject.next(null);
    }
}
