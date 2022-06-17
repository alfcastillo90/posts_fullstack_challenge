import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsListComponent } from "./components/posts-list/posts-list.component";
import { AddPostComponent } from "./components/add-post/add-post.component";
import { PostDetailComponent } from "./components/post-detail/post-detail.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'add-post' },
  { path: 'posts-list', component: PostsListComponent },
  { path: 'add-post', component: AddPostComponent },
  { path: 'edit-post/:id', component: PostDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
