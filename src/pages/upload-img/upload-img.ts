import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';
import { UserPhotoTakePage } from '../user-photo-take/user-photo-take';
import { LocalService } from '../../services/local.service';
import { ImageService } from '../../services/image.service';

/**
 * Generated class for the UploadImgPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload-img',
  templateUrl: 'upload-img.html',
})
export class UploadImgPage {
  //USER: iUser;
  base64Images: string[] = [];
  base64Image = '';
  newPhoto = false;
  hasNewAvatar: boolean = false;
  constructor(
    private navCtrl: NavController,
    //private crudService: CrudService,
    //private setGetService: SetgetService,
    private appService: AppService,
    private modalCtrl: ModalController,
    private dbService: DbService,
    private localService: LocalService,
    private imageService: ImageService,

  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadImgPage');
  }

  takePhoto() {
    this.selectPhotoByBrowser();
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
    this.dbService.avatarUpdateLink(this.localService.USER.Email, this.base64Image)
      .catch(err => {
        console.log(err);
      })
      .then((res: any) => {
        console.log(res);
        
      })
  }
}
