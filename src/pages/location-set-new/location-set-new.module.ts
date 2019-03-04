import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationSetNewPage } from './location-set-new';

@NgModule({
  declarations: [
    LocationSetNewPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationSetNewPage),
  ],
})
export class LocationSetNewPageModule {}
