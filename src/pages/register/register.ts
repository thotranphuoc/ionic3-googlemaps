import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbService } from '../../services/db.service';
import { AppService } from '../../services/app.service';
import { LocalService } from '../../services/local.service';
import { LangService } from '../../services/lang.service';

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
  // FOR LANGUAGES UPDATE
  // 1. Set initialize EN
  LANG = 'VI';
  // 2. set initialized LANGUAGES
  LANGUAGES = {
    TITLE : { EN: 'Register', VI : 'Đăng ký'},
    btnRegister: { EN: 'Register', VI : 'Đăng ký'},

    placeholderFullName : { EN: 'Full Name', VI : 'Họ và tên'},
    placeholderPassword : { EN: 'Password', VI : 'Mật khẩu'},
    placeholderEmail : { EN: 'Email', VI : 'Email'},
    placeholderConfirmEmail : { EN: 'Confirm Email', VI : 'Confirm Email'},
    placeholderPhone : { EN: 'Phone number', VI : 'Số điện thoại'},
    placeholderAddress : { EN: 'Address', VI : 'Địa chỉ'},
    placeholderTeam : { EN: 'Team/Group', VI : 'Hội/nhóm'},
    placeholderIntroduction : { EN: 'Recommender\'s email address', VI : 'Email Người giới thiệu'},
    registerSuccess : { EN: 'Thank you for your registration. Please check your email and activate your account to complete the registration.', VI : 'Cảm ơn bạn đã đăng ký tài khoản tại D.Map. Vui lòng kiểm tra email, active tài khoản để hoàn thành việc đăng ký!'},
    registerFail : { EN: 'This username/email is taken. Please try another!', VI : 'Tài khoản đã được đăng ký, xin vui lòng chọn tài khoản khác!'},
    validateEmail : { EN: 'The email addresses do not match email', VI : 'Xác nhận Email không trùng khớp email'},
    validateEmpty : { EN: 'Please fill full information', VI : 'Xin vui lòng nhập đầy đủ thông tin'},
  };
  pageId = 'RegisterPage';

  fullname = '';
  matkhau = '';
  diachi = '';
  email = '';
  confirmemail = '';
  sodt = '';
  team ='';
  introduction='';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dbService: DbService,
    private appService: AppService,
    private localService: LocalService,
    private langService: LangService,
  ) {
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
    console.log('ionViewDidLoad RegisterPage');
    setTimeout(() => {
      // 3. Get selected EN/VI
      this.LANG = this.langService.LANG;
      console.log(this.LANG);
      // 4. Get LANGUAGES from DB
      if(this.convertArray2Object() != null)
        this.LANGUAGES = this.convertArray2Object();
      console.log(this.LANGUAGES);
    }, 1000);
  }

  register() {
    if(this.checkInput() == true){
      this.dbService.userNewRegister(this.fullname, this.matkhau, this.diachi, this.email, this.sodt, this.team, this.introduction)
      .catch(err => {
        console.log(err);
      })
      .then((res: any) => {
        console.log(res);
        if (res.result == '1') {
          // alert('Chúc mừng bạn đã đăng ký thành công tài khoản DMAP');
          this.appService.showAlert('', this.LANGUAGES.registerSuccess[this.LANG])
          this.navCtrl.setRoot('LoginPage')
        }
        else {
          this.appService.showAlert('', this.LANGUAGES.registerFail[this.LANG])
          // alert('Tài khoản đã được đăng ký, xin vui lòng chọn tài khoản khác');
        }
      })
    }
  }

  checkInput(){
    if(this.email=='' || this.fullname=='' || this.diachi=='')
    {
      this.appService.showAlert('', this.LANGUAGES.validateEmpty[this.LANG]);
      return false;
    }
    if(this.email != this.confirmemail)
    {
      this.appService.showAlert('', this.LANGUAGES.validateEmail[this.LANG]);
      return false;
    }
      
    return true;
  }

}
