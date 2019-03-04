import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the QuestionairsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-questionairs',
  templateUrl: 'questionairs.html',
})
export class QuestionairsPage {
  QUESTIONS: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.QUESTIONS = this.navParams.data.QUESTIONS;
    console.log(this.QUESTIONS);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuestionairsPage');
  }

}
