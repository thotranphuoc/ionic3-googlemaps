import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalService } from '../../services/local.service';
import { LangService } from '../../services/lang.service';

/**
 * Generated class for the DmapHelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dmap-help',
  templateUrl: 'dmap-help.html',
})
export class DmapHelpPage {
  // FOR LANGUAGES UPDATE
  // 1. Set initialize EN
  LANG = 'VI';
  // 2. set initialized LANGUAGES
  LANGUAGES = {
    TITLE : { EN: 'Help', VI : 'Giúp đỡ'},
  };
  pageId = 'DmapHelpPage';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private localService: LocalService,
    private langService: LangService,
    ) {
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
    console.log('ionViewDidLoad DmapHelpPage');
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

}
