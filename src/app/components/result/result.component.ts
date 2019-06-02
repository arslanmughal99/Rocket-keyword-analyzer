import { Component, OnInit, NgZone } from '@angular/core';
import { ProcessService } from './../../services/process/process.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  private kwData;
  public filteredKwData;
  public totalCount: number;
  public searchString: string;

  constructor(private process: ProcessService, private router: Router, private zone: NgZone) { }

  ngOnInit() {
    this.kwData = this.process.getKeywordData;
    this.totalCount = this.process.totalCountkw;
    // this.filteredKwData = this.kwData;
    this.onSearch('');
  }

  onClickBack() {
    this.zone.run(() => this.router.navigateByUrl(''));
  }


  onSearch(searchString: string) {
    console.log('searching ...');
    if (!searchString) {
      this.filteredKwData = [... this.kwData];
      return;
    } else {
      this.filteredKwData = this.kwData.filter(kw => {
        if (kw.Keyword.match(searchString.toLowerCase())) {
          return kw;
        }
      });
    }
  }


}
