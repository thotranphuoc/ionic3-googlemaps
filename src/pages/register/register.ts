import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbService } from '../../services/db.service';
import { AppService } from '../../services/app.service';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  fullname = '';
  matkhau = '';
  diachi = '';
  email = '';
  sodt = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dbService: DbService,
    private appService: AppService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register() {
    this.dbService.userNewRegister(this.fullname, this.matkhau, this.diachi, this.email, this.sodt)
      .catch(err => {
        console.log(err);
      })
      .then((res: any) => {
        console.log(res);
        if (res.result == '1') {
          // alert('Chúc mừng bạn đã đăng ký thành công tài khoản DMAP');
          this.appService.showAlert('', 'Chúc mừng bạn đã đăng ký thành công tài khoản DMAP')
          this.navCtrl.setRoot('LoginPage')
        }
        else {
          this.appService.showAlert('', 'Tài khoản đã được đăng ký, xin vui lòng chọn tài khoản khác')
          // alert('Tài khoản đã được đăng ký, xin vui lòng chọn tài khoản khác');
        }
      })
  }

}
