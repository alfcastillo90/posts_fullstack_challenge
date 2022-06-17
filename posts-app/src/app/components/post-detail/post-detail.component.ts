import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from "@angular/forms";
import { PostService } from "../../services/post.service";
@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  getId: any;
  updateForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private postService: PostService
  ) {
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');
    this.postService.getPost(this.getId).subscribe(res => {
      this.updateForm.setValue({
        userId: res['userId'],
        title: res['title'],
        body: res['body']
      });
    });
    this.updateForm = this.formBuilder.group({
      userId: [''],
      title: [''],
      body: ['']
    })
  }
  ngOnInit() { }
  onUpdate(): any {
    this.postService.updatePost(this.getId, this.updateForm.value)
      .subscribe(() => {
        console.log('Data updated successfully!')
        this.ngZone.run(() => this.router.navigateByUrl('/posts-list'))
      })
  };
}
