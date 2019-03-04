import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestEditPage } from './request-edit';

@NgModule({
  declarations: [
    RequestEditPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestEditPage),
  ],
})
export class RequestEditPageModule {}
