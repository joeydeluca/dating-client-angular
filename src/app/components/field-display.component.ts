import {Component, Input, OnInit, OnChanges} from "@angular/core";
import {ProfileFieldService} from "../services/profile-field.service";

@Component({
  selector: 'field-display',
  template: `{{displayValue}}`
})
export class FieldDisplayComponent implements OnChanges {
  fields: object;
  displayValue: string;

  @Input() type: string;
  @Input() ids: any;

  constructor(private profileFieldService: ProfileFieldService) {
  }

  ngOnChanges(): void {
    this.profileFieldService.getProfileFields().subscribe(
      (result) => {
        this.fields = result;

        const field = this.fields[this.type];
        if(!field) {
          console.error('Profile field type does not exist: ' + this.type);
          this.displayValue = this.getNullFieldDisplay();
          return;
        }

        const options = field['options'];
        if(!options) {
          this.displayValue = this.getNullFieldDisplay();
          return;
        }

        options.forEach(option => {
          if(this.isValueInOptions(option)) {
            if(this.displayValue) {
              this.displayValue = ", "
            }
            this.displayValue = option.name;
          }
        });

        if(!this.displayValue) {
          this.displayValue = this.getNullFieldDisplay();
        }

      }, 
      (error) => {
        console.error(error);
      }
    );
  }

  private getNullFieldDisplay(): string {
    return "Contact me to find out";
  }

  private isValueInOptions(option: any): boolean {
    let isInOptions = false;
    if(Array.isArray(this.ids)) {
      this.ids.forEach(x => {
        if(x === option.id) {
          isInOptions = true;
          return;
        } 
      });
    }

    if(isInOptions) {
      return true;
    }

    return this.ids === option.id;
  }

  
}