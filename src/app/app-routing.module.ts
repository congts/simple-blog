import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {CreatePostComponent} from './post/create.component';
import {EditPostComponent} from './post/edit.component';
import {EditPostResolver} from './post/edit.resolver';
import {AuthGuard} from './_guards';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'new-post', component: CreatePostComponent, canActivate: [AuthGuard] },
    { path: 'edit-post/:id', component: EditPostComponent, resolve: {data: EditPostResolver} },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
