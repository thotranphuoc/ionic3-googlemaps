import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ThrowStmt } from '@angular/compiler';
import { LocalService } from '../../services/local.service';
import { iUser } from '../../interfaces/user.interface';
import { DbService } from '../../services/db.service';
import { LangService } from '../../services/lang.service';

@IonicPage()
@Component({
  selector: 'page-location-question',
  templateUrl: 'location-question.html',
})
export class LocationQuestionPage {
  // FOR LANGUAGES UPDATE
  // 1. Set initialize EN
  LANG = 'VI';
  // 2. set initialized LANGUAGES
  LANGUAGES = {
    TITLE : { EN: 'Questions', VI : 'Câu hỏi'},
    btnLevel : { EN: 'Level', VI : 'Cấp'},
    btnHelp : { EN: 'Help', VI : 'Giúp đỡ'},
  };
  pageId = 'LocationQuestionPage';

  QUESTIONS: any[] = [];
  SHOWN_QUESTION;
  RESULT = '';
  USER: iUser;
  LEVELS: iLevel[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localService: LocalService,
    private dbService: DbService,
    private langService: LangService
  ) {
    this.QUESTIONS = this.navParams.data.QUESTIONS;
    this.SHOWN_QUESTION = this.QUESTIONS[0];
    this.SHOWN_QUESTION['imgdata'] = 'data:image/png;base64,' + this.SHOWN_QUESTION.image_description;
    this.USER = this.localService.USER;
    // this.RESULT = this.RESULT.concat(this.SHOWN_QUESTION.id + '-');
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
    console.log('ionViewDidLoad LocationQuestionPage');
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

  ionViewWillLoad(){
    this.getAllLevels()
  }

  nextQuest(YN, No) {
    // console.log( YN, No);
    let score = Number(this.SHOWN_QUESTION.score);
    this.USER.Score = (score + Number(this.USER.Score)).toString();
    this.USER.Level = this.updateLevel(this.USER);
    console.log(this.SHOWN_QUESTION.score, this.SHOWN_QUESTION.id, YN)
    let str = this.SHOWN_QUESTION.id + '-' + YN + ';';
    this.RESULT += str;
    if (No != '0' && No != '19') {
      // this.RESULT = this.RESULT.concat(No+'-'+YN+';')
      this.SHOWN_QUESTION = this.QUESTIONS.filter(Q => Q.id == No)[0];
      this.SHOWN_QUESTION['imgdata'] = 'data:image/png;base64,' + this.SHOWN_QUESTION.image_description;
    } else {
      // this.RESULT = this.RESULT.concat(YN+';')
      console.log('done');
      this.localService.STRING += this.RESULT;
      this.localService.USER = this.USER;
      this.navCtrl.pop();
    }
    console.log(this.RESULT);
  }


  getAllLevels() {
    this.dbService.levelsGet()
      .then((res: iLevel[]) => {
        console.log(res);
        this.LEVELS = res;
        console.log(this.LEVELS);
      })
  }

  updateLevel(USER: iUser){
    let userScore = Number(USER.Score);
    let n = this.LEVELS.length;
    for (let index = 0; index < n; index++) {
      if(userScore>= Number(this.LEVELS[n- index - 1].score)) return this.LEVELS[n- index -1].level;
      if(userScore <Number(this.LEVELS[0].score)) return '0';
    }
  }


doCancel()
{
  this.navCtrl.pop();
}



}

interface iLevel{
  id: string,
  level: string,
  name: string,
  score: string,
  active: string
}
