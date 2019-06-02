import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProcessService } from './../../services/process/process.service';


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  public errorReason;

  constructor(private route: Router, private process: ProcessService) { }

  ngOnInit() {
    this.errorReason = this.process.errDetails;
  }


  onRouteBack() {
    this.route.navigate(['/']);
  }

}
