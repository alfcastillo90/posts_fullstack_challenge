import { Component, OnInit } from '@angular/core';
import { Post } from "../../model/post";
import { PostService } from "../../services/post.service";

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {

  posts:Post[] = [];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.getPosts().subscribe(res => {
      console.log(res)
      this.posts = res as Post[];
    });
  }

  delete(id:any, i:any) {
    console.log(id);
    if(window.confirm('Do you want to go ahead?')) {
      this.postService.deletePost(id).subscribe((res) => {
        this.posts.splice(i, 1);
      })
    }
  }
}
