import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPhotoTakePage } from './user-photo-take';

@NgModule({
  declarations: [
    UserPhotoTakePage,
  ],
  imports: [
    IonicPageModule.forChild(UserPhotoTakePage),
  ],
})
export class UserPhotoTakePageModule {}
