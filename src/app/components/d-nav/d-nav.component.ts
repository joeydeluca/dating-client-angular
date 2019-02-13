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

  constructor(
    private authService: AuthService) {
  }

  ngOnInit() {
    SharedService.showUpgradeButton.subscribe(val => this.showUpgradeButton = val);

    if (this.navType === 'MEMBER' && this.authService.getAuthContext()) {
      this.showUpgradeButton = !this.authService.getAuthContext().paid;
    }
  }
}

