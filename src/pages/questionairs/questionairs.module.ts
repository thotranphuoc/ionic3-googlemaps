import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionairsPage } from './questionairs';

@NgModule({
  declarations: [
    QuestionairsPage,
  ],
  imports: [
    IonicPageModule.forChild(QuestionairsPage),
  ],
})
export class QuestionairsPageModule {}
