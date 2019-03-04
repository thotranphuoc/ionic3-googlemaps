import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';
import { iUser } from '../../interfaces/user.interface';
import { isTrueProperty } from 'ionic-angular/util/util';
import { AppService } from '../../services/app.service';

/**
 * Generated class for the CommentAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comment-add',
  templateUrl: 'comment-add.html',
})
export class CommentAddPage {
  ID;
  USER: iUser;
  COMMENTS = [];
  CommentStr = '';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private dbService: DbService,
    private localService: LocalService,
    private appService: AppService
    ) {
      this.ID = this.navParams.get('LocationID');
      this.USER = this.localService.USER;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentAddPage');
    if(typeof(this.ID)!=='undefined'){
      this.getComments();
    }else{
      this.navCtrl.setRoot('MapPage');
    }
  }

  getComments(){
    let ID = this.ID
    this.COMMENTS = [];
    this.dbService.commentsGet(ID)
    .then((res: any)=>{
      console.log(res);
      this.COMMENTS = res;
    })
  }

  doAddComment(comment){
    console.log(comment);
    let d = new Date();
    this.dbService.commentAdd(this.localService.USER.FullName, this.ID, d.toString(), comment)
    .then((res: any)=>{
      console.log(res);
      this.CommentStr = '';
      this.getComments();
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  checkIfOK(comment: string){
    if(comment.trim().length<1) return false;
    // if(!this.USER){ return false};
    return true;
  }

  addComment(){
    if(this.checkIfOK(this.CommentStr)){
      if(this.localService.USER){
        this.doAddComment(this.CommentStr);
      }else{
        this.navCtrl.push('LoginPage',{isBack: true})
      }
    }else{
      this.appService.showAlert('Opps','Xin vui lòng điền thông tin trước khi hoàn tất');
    }
  }



}
