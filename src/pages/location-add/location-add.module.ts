import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationAddPage } from './location-add';

@NgModule({
  declarations: [
    LocationAddPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationAddPage),
  ],
})
export class LocationAddPageModule {}
