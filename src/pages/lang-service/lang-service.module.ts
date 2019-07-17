import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LangServicePage } from './lang-service';

@NgModule({
  declarations: [
    LangServicePage,
  ],
  imports: [
    IonicPageModule.forChild(LangServicePage),
  ],
})
export class LangServicePageModule {}
