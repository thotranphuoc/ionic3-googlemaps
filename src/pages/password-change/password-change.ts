import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';
import { AppService } from '../../services/app.service';

/**
 * Generated class for the PasswordChangePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-password-change',
  templateUrl: 'password-change.html',
})
export class PasswordChangePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dbService: DbService,
    private localService: LocalService,
    private appService: AppService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordChangePage');
  }

  changePassword(old, new1, new2) {
    console.log(old, new1, new2);
    if (this.checkIfValid(old, new1, new2)) {
      let email = this.localService.USER.Email;
      // let email = 'luan@gmail.com'
      this.dbService.passwordChange(email, old, new1)
        .then((res: any) => {
          console.log(res);
          if(res.result == '1'){
            // alert('Thay đổi mật khẩu thành công');
            this.appService.showAlert('','Thay đổi mật khẩu thành công');
            this.navCtrl.setRoot('MapPage');
          }else{
            // alert('Lỗi, Xin vui lòng thử lại.');
            this.appService.showAlert('','Lỗi, Xin vui lòng thử lại.');
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  checkIfValid(old, new1, new2) {
    if (old.length < 1 || new1.length < 1 || new1.length < 1) {
      // alert('Chưa nhập dữ liệu');
      this.appService.showAlert('','Chưa nhập dữ liệu');
      return false;
    }
    if (new1 !== new2) {
      // alert('Password Không khóp');
      this.appService.showAlert('','Password Không khóp');
      return false;
    }
    return true;
  }

}
