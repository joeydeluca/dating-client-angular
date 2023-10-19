import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {SharedService} from '../../services/shared.service';

@Component({
  selector: 'd-nav',
  templateUrl: './d-nav.component.html',
  styleUrls: ['./d-nav.component.css']
})
export class DNavComponent implements OnInit {
  @Input() navType = 'MEMBER';

  showUpgradeButton: boolean;
  frendtoken: String;

  constructor(
    private authService: AuthService, private window: Window) {
  }

  ngOnInit() {
    SharedService.showUpgradeButton.subscribe(val => this.showUpgradeButton = val);

    if (this.navType === 'MEMBER' && this.authService.getAuthContext()) {
      this.showUpgradeButton = !this.authService.getAuthContext().paid;
    }

    // if (this.navType === 'MEMBER') {
    //   this.authService.getFrendToken().subscribe((res) => {
    //     //this.saveAuthContextToLocal(res);
    //     this.frendtoken = res;
    //     try {
    //       (<any>this.window).initChat(this.frendtoken, 'www.uglyschmucks.com/frend-upgrade');
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   }, (error) => {console.log(error)});
    // }
  }
}

