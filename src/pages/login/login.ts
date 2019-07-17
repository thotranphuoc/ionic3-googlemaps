import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';
import { AppService } from '../../services/app.service';
import { timeout } from 'rxjs/operator/timeout';
import { LangService } from '../../services/lang.service';

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
  // FOR LANGUAGES UPDATE
  // 1. Set initialize EN
  LANG = 'VI';
  // 2. set initialized LANGUAGES
  LANGUAGES = {
    TITLE : { EN: 'Account Login', VI : 'Đăng nhập'},
    btnCancel : { EN: 'Cancel', VI : 'Huỷ'},
    btnLogin : { EN: 'LOG IN', VI : 'Đăng nhập'},
    btnRegister : { EN: 'Register', VI : 'Đăng ký'},
    btnForgotPassword : { EN: 'Forgot your password?', VI : 'Quên mật khẩu'},
    btnNotAccount : { EN: 'USE APP WITHOUT LOGGING IN ', VI : 'Sử dụng không cần đăng nhập'},
    placeholderUsername : { EN: 'Email', VI : 'Email'},
    placeholderPassword : { EN: 'Password', VI : 'Mật khẩu'},
    btnLang : { EN: 'Tiếng Việt', VI : 'English'},
  };
  pageId = 'LoginPage';

  ACCOUNT = {
    email: '',
    password: ''
  }

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
    private langService: LangService,

  ) {
    this.data = this.navParams.data;
    if (typeof (this.data) !== 'undefined' && this.data.isBack) {
      this.isBack = true;
      console.log(this.isBack);
    }
    this.ionViewDidLoad();
  }

  convertArray2Object() {
    let OBJ: any = {}
    try {
      if(this.localService.BASIC_INFOS.LANGUAGES[this.pageId]!=null)
      {
        let LANGUAGES: any[] = this.localService.BASIC_INFOS.LANGUAGES[this.pageId];
        LANGUAGES.forEach(L => {
          OBJ[L.KEY] = L
        })
        console.log(OBJ);
      }
    } catch (error) {
      OBJ=null;
    }
    
    
    return OBJ;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    setTimeout(() => {
      // 3. Get selected EN/VI
      this.LANG = this.langService.LANG;
      console.log(this.LANG);
      // 4. Get LANGUAGES from DB
      if(this.convertArray2Object() != null)
        this.LANGUAGES = this.convertArray2Object();
      console.log(this.LANGUAGES);
    }, 1000);
    
    
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
    if(!(this.user_name == ""))
      setTimeout( () => {
        console.log('chay toi settime');
        
        this.login(this.user_name, this.password);
      }, 500);



    
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

          // //console.log("User name: " + this.storage.get("Username") + " - pass: " + this.storage.get("Password"));
          // if (this.isBack) {
          //   this.navCtrl.pop()
          // } else {
          //   // this.navCtrl.setRoot('MapPage');
          //   // this.navCtrl.setRoot('MapNewPage'); // for native map
          //   this.navCtrl.setRoot('MapxPage');
          // }
          this.navCtrl.setRoot('MapxPage');
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
    this.navCtrl.setRoot('MapxPage');
  }
  go2Register() {
    this.navCtrl.push('RegisterPage');
  }

  go2ForgotPass() {
    this.navCtrl.push('ForgotPwPage');
  }

  go2ChangeLang(){
    if(this.LANG=='EN')
      {
        this.langService.LANG='VI';
        this.LANG='VI';
      }
      else{
        this.langService.LANG='EN';
        this.LANG='EN';
      }
  }

}
