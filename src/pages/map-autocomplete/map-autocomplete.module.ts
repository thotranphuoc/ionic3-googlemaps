import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapAutocompletePage } from './map-autocomplete';

@NgModule({
  declarations: [
    MapAutocompletePage,
  ],
  imports: [
    IonicPageModule.forChild(MapAutocompletePage),
  ],
  entryComponents: [
    MapAutocompletePage
  ],
})
export class MapAutocompletePageModule {}
