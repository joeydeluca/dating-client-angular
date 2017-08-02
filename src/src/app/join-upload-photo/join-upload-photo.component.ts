import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {UserService} from "../services/user.service";
import {MdSnackBar} from "@angular/material";

@Component({
  selector: 'join-upload-photo',
  templateUrl: './join-upload-photo.component.html',
  styleUrls: ['./join-upload-photo.component.css']
})
export class JoinUploadPhotoComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private snackBar: MdSnackBar) {
  }

  ngOnInit(): void {
  }

}
