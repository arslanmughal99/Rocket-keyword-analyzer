import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResultComponent } from './components/result/result.component';
import { ErrorComponent } from './components/error/error.component';
import { OfflineFileComponent } from './components/offline-file/offline-file.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
  },
  {
    path: 'result',
    component: ResultComponent
  },

  {
    path: 'error',
    component: ErrorComponent
  },


  {
    path: 'offlinefile',
    component: OfflineFileComponent
  }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
exports: [RouterModule]
})
export class AppRoutingModule { }
