import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AutoCompleteModalPage } from './auto-complete-modal';

@NgModule({
  declarations: [
    AutoCompleteModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AutoCompleteModalPage),
  ],
})
export class AutoCompleteModalPageModule {}
