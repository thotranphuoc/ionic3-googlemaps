import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationHistoryPage } from './location-history';

@NgModule({
  declarations: [
    LocationHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationHistoryPage),
  ],
})
export class LocationHistoryPageModule {}
