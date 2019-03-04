import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationSettingPage } from './location-setting';

@NgModule({
  declarations: [
    LocationSettingPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationSettingPage),
  ],
})
export class LocationSettingPageModule {}
