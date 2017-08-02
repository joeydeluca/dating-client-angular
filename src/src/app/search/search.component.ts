import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {UserService} from "../services/user.service";
import {MdSnackBar} from "@angular/material";

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private snackBar: MdSnackBar) {
  }

  ngOnInit(): void {
  }

}
