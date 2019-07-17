import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';

// import { iShop } from '../../interfaces/shop.interface';
// import { ShopService } from '../../services/shop.service';
// import { ProxyService } from '../../services/proxy.service';
import { iLocation } from '../../interfaces/location.interface';
import { LangService } from '../../services/lang.service';
import { LocalService } from '../../services/local.service';

@IonicPage()
@Component({
  selector: 'page-pop-over',
  templateUrl: 'pop-over.html',
})
export class PopOverPage {
  // FOR LANGUAGES UPDATE
  // 1. Set initialize EN
  LANG = 'VI';
  // 2. set initialized LANGUAGES
  LANGUAGES = {
    btnDetail : { EN: 'Detail', VI : 'Xem chi tiết'},
  };
  pageId = 'LocationPage';
  data: any;
  LOCATION: iLocation = null;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private app: App,
    private viewCtrl: ViewController,
    private localService: LocalService,
    private langService: LangService,
    // private shopService: ShopService,
    // private proxyService: ProxyService
  ) {
    this.data = this.navParams.data;
    this.LOCATION = this.data.LOCATION;
    console.log(this.LOCATION);
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
    console.log('ionViewDidLoad PopOverPage');
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

  closePopover() {
    this.viewCtrl.dismiss().catch((err) => { console.log(err) });
  }

  go2Location() {
    this.closePopover();
    this.app.getRootNavs()[0].push('LocationPage', {LOCATION: this.LOCATION});
    // this.shopService.getShop(this.SHOP.SHOP_ID).then((res: any)=>{
    //   let _SHOP: iShop = res.SHOP;
    //   _SHOP.SHOP_IMAGES = this.proxyService.covertShortShopImages2Long(_SHOP.SHOP_ID);
    //   this.app.getRootNavs()[0].setRoot('ShopPage', {SHOP: _SHOP});
    // })

    
    

  }

}
