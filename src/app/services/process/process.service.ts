import { Injectable, NgZone } from '@angular/core';
import { ipcRenderer, remote } from 'electron';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  private kwData: Object;
  private totalCount: number;
  private errDetail;

  // Regular expression to validate a URL
  private regEx: RegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

  constructor(private router: Router, private zone: NgZone) { }


  processUrlSignal(url: string, isLocal:boolean = false) {
    ipcRenderer.send('any-err-view', null);
    ipcRenderer.send('siteUrl', isLocal ,url);

    ipcRenderer.once('error-occure', (e, err) => {
      this.removeAllListiners();
      this.errDetail = { code: 'CANNOT REACH :(' };
      this.zone.run(() => { this.router.navigateByUrl('error', { replaceUrl: true }); });
    });

    ipcRenderer.once('yes-view-err', (e, err) => {
      this.removeAllListiners();
      this.errDetail = err;
      this.zone.run(() => this.router.navigateByUrl('error', { replaceUrl: true }));
    });

    ipcRenderer.once('keyword-details', (e, result) => {
      this.kwData = _.reverse(result.data);
      this.totalCount = result.total;
      this.removeAllListiners();
      this.zone.run(() => this.router.navigateByUrl('result', { replaceUrl: true }));
    });
  }


  removeAllListiners() {
      ipcRenderer.removeAllListeners('keyword-details');
      ipcRenderer.removeAllListeners('error-occure');
      ipcRenderer.removeAllListeners('yes-view-err');
  }

  getSiteUrl(url: string, isLocal: boolean) {
    this.processUrlSignal(url, isLocal);
  }

  get getKeywordData() {
    return this.kwData;
  }

  get totalCountkw() {
    return this.totalCount;
  }

  get errDetails() {
    return this.errDetail;
  }

    // Test the submited URL against the Regular expression  => bool
    validateUrl(url: string) {
      const linkStatus = this.regEx.test(url);
      return linkStatus;
    }

}
