import { Component, ViewChild, OnInit } from '@angular/core';
import { Post } from "../../model/post";
import { PostService } from "../../services/post.service";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {
  dataSource: MatTableDataSource<Post>;
  displayedColumns: string[] = [
    'postId',
    'userId',
    'title',
    'body',
    'action',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  posts:Post[] = [];

  constructor(private postService: PostService) {
    this.postService.getPosts().subscribe((data: Post[]) => {
      this.posts = data;
      this.dataSource = new MatTableDataSource<Post>(this.posts);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
  }


  ngOnInit(): void {}

  delete(index: number, post: Post) {
    if(window.confirm('Do you want to go ahead?')) {
      const data = this.dataSource.data;

      data.splice(
        this.paginator.pageIndex * this.paginator.pageSize + index,
        1
      );

      this.dataSource.data = data;
      this.postService.deletePost(post.postId).subscribe();
    }
  }
}
