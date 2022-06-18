import {Component, OnInit, NgZone, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from "@angular/forms";
import { PostService } from "../../services/post.service";
@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit {
  postForm: FormGroup;
  @ViewChild('resetPostForm') myNgForm;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private postService: PostService
  ) {
    this.postForm = this.formBuilder.group({
      body: [''],
      title: [''],
      userId: ['']
    })
  }
  ngOnInit() { }
  onSubmit(): any {
    if ( this.postForm.valid ) {
      this.postService.addPost(this.postForm.value)
        .subscribe(() => {
          console.log('Data added successfully!')
          this.ngZone.run(() => this.router.navigateByUrl('/posts-list'))
        });
    }
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.postForm.controls[controlName].hasError(errorName);
  };
}
