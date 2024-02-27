import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { SpinnerService } from 'src/app/_service/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {

  isLoading$ = new Subject<boolean>();

  constructor(private readonly spinnerService: SpinnerService) {
    this.isLoading$ = this.spinnerService.isLoading$;
  }

}
