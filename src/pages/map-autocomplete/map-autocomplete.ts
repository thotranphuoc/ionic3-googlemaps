import { ViewController } from 'ionic-angular/navigation/view-controller';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, Platform, ModalController } from 'ionic-angular';
import {Component, ElementRef, HostListener, NgZone, ViewChild} from '@angular/core';
import {AgmMap} from '@agm/core';
import {MAP_STYLE} from '../../config/config';
import {AutoCompleteModalPage} from '../auto-complete-modal/auto-complete-modal';
declare var google: any;
/**
 * Generated class for the MapAutocompletePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map-autocomplete',
  templateUrl: 'map-autocomplete.html',
})


export class MapAutocompletePage {
  address;

  constructor(
    private navCtrl:  NavController,
    private modalCtrl: ModalController
  ) {
    this.address = {
      place: ''
    };
  }

  showAddressModal () {
    let modal = this.modalCtrl.create(AutoCompleteModalPage);
    let me = this;
    modal.onDidDismiss(data => {
      this.address.place = data;
    });
    modal.present();
  }
}
