import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ImageService } from '../../services/image.service';

/**
 * Generated class for the UserPhotoTakePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-photo-take',
  templateUrl: 'user-photo-take.html',
})
export class UserPhotoTakePage {

  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private imageService: ImageService,
    private modalCtrl: ModalController
  ) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotosTakePage');
  }
}
