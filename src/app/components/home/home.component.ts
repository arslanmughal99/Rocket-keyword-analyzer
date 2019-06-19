import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProcessService } from '../../services/process/process.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // Responsible to render "Invalid URL" message
  linkStatus: Boolean;
  processing: Boolean;
  stillLoading: Boolean;

  constructor(private process: ProcessService, private router: Router) {}

  ngOnInit() {
    this.linkStatus = true;
    this.processing = false;
    this.stillLoading = false;
    // this.router.navigateByUrl('/offlinefile');
  }

  // Display "Hold Tight, Still loading" message after x seconds
  checkStillLoading() {
    setTimeout(() => { this.stillLoading = true; }, 2000);
  }

  // Recive Form object on form submition
  onSubmit(form: NgForm) {
    if (this.process.validateUrl(form.value.link)) {
      this.linkStatus = true;
      this.processing = true;
      this.process.getSiteUrl(form.value.link, false);
      this.checkStillLoading();
    } else {
      this.linkStatus = false;
    }
  }

  onGoOffline(){
    this.router.navigateByUrl('/offlinefile');
  }

}
