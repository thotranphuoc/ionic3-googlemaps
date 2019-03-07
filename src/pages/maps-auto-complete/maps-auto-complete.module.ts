import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapsAutoCompletePage } from './maps-auto-complete';

@NgModule({
  declarations: [
    MapsAutoCompletePage,
  ],
  imports: [
    IonicPageModule.forChild(MapsAutoCompletePage),
  ],
})
export class MapsAutoCompletePageModule {}
