import { Component, OnInit } from '@angular/core';
import {ipcRenderer} from 'electron';
import { ProcessService } from '../../services/process/process.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offline-file',
  templateUrl: './offline-file.component.html',
  styleUrls: ['./offline-file.component.scss']
})
export class OfflineFileComponent implements OnInit {
  
  public isFileValid = true;

  constructor(private process: ProcessService, private router: Router) { }

  ngOnInit() {

  }

  testFileType(link:string){
    let validExt:string = 'html';
    let _rawExt: string[] = link.split('.');
    let ext: string = _rawExt[_rawExt.length - 1];
    if(ext === validExt) {
      return true
    }else{
      return false;
    };
  }

  onFileDrop(e){
    e.preventDefault()
    const path = e.dataTransfer.items[0].getAsFile().path;
    if(this.testFileType(path)){
      this.process.getSiteUrl(path, true);
      return;
    }
    this.isFileValid = false;
    return;
  }

  onDragOver(event: Event){
    event.stopPropagation();
    event.preventDefault();
  }

  onSwitchOnline(){
    this.router.navigateByUrl('/');
  }

}
