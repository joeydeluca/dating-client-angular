import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";

export class SharedService {
  public static showLoader: Subject<boolean> = new Subject<boolean>();
  public static showUpgradeButton: Subject<boolean> = new Subject<boolean>();
}
