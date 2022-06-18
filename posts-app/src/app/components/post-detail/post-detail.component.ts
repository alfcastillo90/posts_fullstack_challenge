import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from "../../services/post.service";

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  getId: any;
  updateForm: FormGroup;
  @ViewChild('resetPostForm') myNgForm;
  postForm: FormGroup;

  ngOnInit() {
    this.updateForm = this.formBuilder.group({
      userId: ['', [Validators.required]],
      title: ['', [Validators.required]],
      body: ['', [Validators.required]]
    })
  }

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private postService: PostService
  ) {
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.postService.getPost(this.getId).subscribe(res => {
      console.log(res);

      this.postForm = this.formBuilder.group({
        userId: [res.userId, [Validators.required]],
        title: [res.title, [Validators.required]],
        body: [res.body, [Validators.required]],
      });
    });
  }


  onUpdate(): any {
    if (window.confirm('Are you sure you want to update?')) {
      this.postService.updatePost(this.getId, this.updateForm.value)
        .subscribe(() => {
          console.log('Data updated successfully!')
          this.ngZone.run(() => this.router.navigateByUrl('/posts-list'))
        })
    }
  };

  public handleError = (controlName: string, errorName: string) => {
    return this.postForm.controls[controlName].hasError(errorName);
  };
}
