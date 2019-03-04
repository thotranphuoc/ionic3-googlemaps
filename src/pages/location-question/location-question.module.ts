import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationQuestionPage } from './location-question';

@NgModule({
  declarations: [
    LocationQuestionPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationQuestionPage),
  ],
})
export class LocationQuestionPageModule {}
