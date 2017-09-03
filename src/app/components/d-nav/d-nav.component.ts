import {Component, Input, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {MdSnackBar} from "@angular/material";


@Component({
  selector: 'd-nav',
  templateUrl: './d-nav.component.html',
  styleUrls: ['./d-nav.component.css']
})
export class DNavComponent implements OnInit {  
  @Input() navType: string = "MEMBER";

  isPaid: boolean;

  constructor(
    private authService: AuthService,
    private snackBar: MdSnackBar,
    private router: Router) {
  }

  ngOnInit() {
    if(this.navType == "MEMBER") {
      this.isPaid = this.authService.getAuthContext().isPaid;
    }
  }

  logout(): void {
    this.authService.logout();
    this.snackBar.open('You have logged out', null, { duration: 4000, extraClasses: ['bg-success', 'snackbar'] });
    this.router.navigate(['/login']);
  }
}

