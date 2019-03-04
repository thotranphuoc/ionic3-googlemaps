import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationSetPage } from './location-set';

@NgModule({
  declarations: [
    LocationSetPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationSetPage),
  ],
})
export class LocationSetPageModule {}
