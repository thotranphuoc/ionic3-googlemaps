import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';
import { AppService } from '../../services/app.service';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  data: any;
  isBack: boolean = false;
  user_name: any = '';
  password: any = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dbService: DbService,
    private localService: LocalService,
    private appService: AppService,
    private storage: Storage,

  ) {
    this.data = this.navParams.data;
    if (typeof (this.data) !== 'undefined' && this.data.isBack) {
      this.isBack = true;
      console.log(this.isBack);
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    //kiem tra neu co gtri user name pass 
    this.user_name = "";
      this.password = "";
    this.storage.get('Username').then((val)=>{
      console.log(val);
      this.user_name = val;
    })
    this.storage.get('Password').then((val) => {
      console.log('Password:', val);
      this.password = val;
    });
    // try {
    //   this.storage.get('Username').then((val) => {
    //     console.log('User name:', val);
    //     this.user_name = val;
    //   });

    //   this.storage.get('Password').then((val) => {
    //     console.log('Password:', val);
    //     this.password = val;
    //   });
    // }
    // catch{
    //   this.user_name = "";
    //   this.password = "";
    // }

  }

  login(user, pass) {
    // let user = 'luan@gmail.com';
    // let pass = '12345678';
    this.dbService.userLogin(user, pass)
      .then((res: any) => {
        console.log(res);
        if (res.result == '1') {
          this.localService.USER = res;
          this.storage.set("Username", user);
          this.storage.set("Password", pass);

          let user_name = this.storage.get('Username').then((val) => {
            console.log('User name:', val);
          });

          let password = this.storage.get('Password').then((val) => {
            console.log('Password:', val);
          });

          //console.log("User name: " + this.storage.get("Username") + " - pass: " + this.storage.get("Password"));
          if (this.isBack) {
            this.navCtrl.pop()
          } else {
            this.navCtrl.setRoot('MapPage')
          }
        } else {
          // alert('Sai Tên đăng nhập hoặc mật khẩu, xin vui lòng thử lại.');
          this.appService.showAlert('', 'Sai Tên đăng nhập hoặc mật khẩu, xin vui lòng thử lại.')
        }


      })
      .catch(err => {
        console.log(err);
      })
  }

  donotLogin() {
    this.navCtrl.push('MapPage');
  }
  go2Register() {
    this.navCtrl.push('RegisterPage');
  }

  go2ForgotPass() {
    this.navCtrl.push('ForgotPwPage');
  }

}
