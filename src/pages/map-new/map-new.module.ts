import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapNewPage } from './map-new';

@NgModule({
  declarations: [
    MapNewPage,
  ],
  imports: [
    IonicPageModule.forChild(MapNewPage),
  ],
})
export class MapNewPageModule {}
