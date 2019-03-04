import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';

// import { iShop } from '../../interfaces/shop.interface';
// import { ShopService } from '../../services/shop.service';
// import { ProxyService } from '../../services/proxy.service';
import { iLocation } from '../../interfaces/location.interface';

@IonicPage()
@Component({
  selector: 'page-pop-over',
  templateUrl: 'pop-over.html',
})
export class PopOverPage {
  data: any;
  LOCATION: iLocation = null;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private app: App,
    private viewCtrl: ViewController,
    // private shopService: ShopService,
    // private proxyService: ProxyService
  ) {
    this.data = this.navParams.data;
    this.LOCATION = this.data.LOCATION;
    console.log(this.LOCATION);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopOverPage');
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
