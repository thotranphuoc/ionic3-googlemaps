import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { LocalService } from '../../services/local.service';
import { iUser } from '../../interfaces/user.interface';
import { DbService } from '../../services/db.service';
import { AppService } from '../../services/app.service';
import { ImageService } from '../../services/image.service';
import { LangService } from '../../services/lang.service';


@IonicPage()
@Component({
  selector: 'page-profile-update',
  templateUrl: 'profile-update.html',
})
export class ProfileUpdatePage {
  // FOR LANGUAGES UPDATE
  // 1. Set initialize EN
  LANG = 'VI';
  // 2. set initialized LANGUAGES
  LANGUAGES = {
    TITLE : { EN: 'Personal Information', VI : 'Cập nhật thông tin cá nhân'},
    btnCancel : { EN: 'Cancel', VI : 'Thoát'},
    btnUpdate : { EN: 'Update', VI : 'Sửa'},
    btnChangePassword : { EN: 'Change password', VI : 'Thay đổi mật khẩu'},
    btnForgotPassword : { EN: 'Forgot password', VI : 'Quên mật khẩu'},
    btnNotAccount : { EN: 'Use dont need login', VI : 'Sử dụng không cần đăng nhập'},
    placeholderFullName : { EN: 'Full Name', VI : 'Họ và tên'},
    placeholderScore : { EN: 'Score', VI : 'Điểm'},
    placeholderLevel : { EN: 'Level', VI : 'Cấp'},
    placeholderEmail : { EN: 'Email', VI : 'Email'},
    placeholderPhone : { EN: 'Phone number', VI : 'Số điện thoại'},
    placeholderAddress : { EN: 'Address', VI : 'Địa chỉ'},
    placeholderTeam : { EN: 'Team/Group', VI : 'Hội/nhóm'},
    placeholderIntroduction : { EN: 'Recommender\'s email address', VI : 'Email Người giới thiệu'},
  };
  pageId = 'ProfileUpdatePage';

  USER: iUser;
  base64Images = [];
  base64Image = '';
  //Image = '';
  hasNewAvatar: boolean = false;
  newPhoto = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dbService: DbService,
    private appService: AppService,
    private imageService: ImageService,
    private modalCtrl: ModalController,
    private localService: LocalService,
    private langService: LangService,
  ) {
    this.USER = this.localService.USER;
    console.log(this.USER);
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
    console.log('ionViewDidLoad ProfileUpdatePage');
    this.getAvatar(this.USER.Email);
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

  update() {
    console.log(this.USER);
    this.dbService.profileUpdate(this.USER.FullName, this.USER.Address, this.USER.Email, this.USER.Phone, this.USER.Team, this.USER.Introduction)
      .then((res: any) => {
        console.log(res);
        if (res.result == '1') {
          this.appService.presentToast('Cập nhật thành công', 5000);
          this.navCtrl.pop();
        } else {
          this.appService.presentToast('Lỗi, Xin vui lòng liên hệ với quản trị viên', 5000);
        }
      })
      .catch((err) => {
        this.appService.presentToast(err, 5000);
      })
  }

  cancel() {
    console.log('cancel');
    this.navCtrl.pop();
  }

  changePassword() {
    console.log('Change Password');
    this.navCtrl.push('PasswordChangePage');
  }

  /*takePhoto() {
    this.selectPhotoByBrowser();
  }
*/

takePhoto() {
  console.log('take Photo');
  let photosModal = this.modalCtrl.create('PhotoTakePage', { PHOTOS: this.base64Images });
  photosModal.onDidDismiss((data) => {
    console.log(data);
    this.base64Images = data.PHOTOS;
    this.hasNewAvatar = true;
    this.uploadImageThenUpdateURL();
  });
  photosModal.present()
    .then((res) => { console.log(res) })
    .catch((err) => { console.log(err) })
}

uploadImageThenUpdateURL() {
  // console.log(this.PROFILE);
  this.dbService.uploadBase64Image2FBReturnPromiseWithURL('Avatar/' + this.USER.Email, this.base64Images[0], this.USER.Email)
    .then((downloadURL: string) => {
      this.USER.Image = downloadURL;
      console.log(this.USER);
      // this.onUpdateProfile();
      this.updateAvatar();
    })
    .catch((err) => console.log(err));
}


  selectPhotoByBrowser() {
    console.log('start browsering or taking photo camera')
    document.getElementById('inputFile').click();
  }



  takePictureAndResizeByBrowser(event) {
    // this.base64ImagesThumbnail = [];
    // this.base64Images = [];
    // // FOR NORMAL IMG
    // let pro2 = this.imageService.resizeImagesFromChoosenFilesReturnPromiseWithArrayOfImageDataUrlsSizeSetable(event, 750, 750)
    // .then((imgDataUrls: string[]) => {
    //   setTimeout(() => {
    //     console.log(imgDataUrls);
    //     // this.base64Images = imgDataUrls;
    //     this.base64Images.push(imgDataUrls[0]);
    //   }, 2000)
    // })
    // .catch((err) => console.log(err))
    // FOR THUMBNAIL
    let pro1 = this.imageService.resizeImagesFromChoosenFilesReturnPromiseWithArrayOfImageDataUrlsSizeSetable(event, 120, 120)
      .then((imgDataUrls: string[]) => {
        setTimeout(() => {
          console.log(imgDataUrls);
          // this.base64ImagesThumbnail = imgDataUrls;
          this.base64Image = imgDataUrls[0]
          this.updateAvatar();
        }, 2000)
      })
      .catch((err) => console.log(err))


    // Promise.all([pro1]).then(() => {
    //   // this.base64Images.push(this.IMG_URL_DATA);
    //   // this.base64Images.push(this.THUM_URL_DATA);
    //   this.newPhoto = true;
    //   console.log('done');
    // })
    //   .catch((err) => {
    //     console.log(err);
    //     this.newPhoto = true;
    //   })
  }

  updateAvatar() {
    //this.base64Image = this.base64Image.replace(/^data:image\/(png|jpg);base64,/, "");
    this.dbService.avatarUpdateLink(this.USER.Email, this.USER.Image)
      .catch(err => {
        console.log(err);
      })
      .then((res: any) => {
        console.log(res);
        
      })
  }

  getAvatar(email) {
    this.dbService.avatarGet(email).then((res: any) => {
      console.log(res);
      this.base64Image = res.ImageBase;
    })
    .catch(err => {
      console.log(err);
    })
  }
}
