import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  MarkerCluster,
  Marker
} from "@ionic-native/google-maps";
import { DbService } from '../../services/db.service';


/**
 * Generated class for the MapMainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map-main',
  templateUrl: 'map-main.html',
})
export class MapMainPage {
map: GoogleMap;
LOCATIONS = [];
  constructor(
    private dbService: DbService
  ) {
  }
  ionViewWillEnter() {
    
  }
  ionViewDidLoad() {
    this.dbService.getLocations_location().then((res: any) => {
      this.LOCATIONS = res;
      console.log('res',this.LOCATIONS);
      this.loadMap();
    }).catch();
  }

  loadMap() {
    console.log('loadmap', this.LOCATIONS)
    this.map = GoogleMaps.create('map_canvas', {
      'camera': {
        'target': {
          "lat": 10.7891915,
          "lng": 106.7405075
        },
        'zoom': 10
      }
    });
    this.addCluster();
  }

  addCluster() {
    console.log('Cluster', this.LOCATIONS);
    this.map.addMarkerCluster({
      markers: this.LOCATIONS,
      icons: [
        {
          min: 3,
          max: 9,
          url: "./assets/markercluster/small.png",
          label: {
            color: "white"
          }
        },
        {
          min: 10,
          url: "./assets/markercluster/large.png",
          label: {
            color: "white"
          }
        }
      ]
    }).then((markerCluster: MarkerCluster) =>{
      console.log('test 2',markerCluster);
      markerCluster.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {
        let marker: Marker = params[1];
        marker.setTitle(marker.get("name"));
        marker.setSnippet(marker.get("address"));
        marker.showInfoWindow();
      });
    })

  }

  
dummyData(){
  this.dbService.getLocations_location().then((res: any) => {
    this.LOCATIONS = res;
    console.log('res',this.LOCATIONS);

    console.log('vardum', this.dummyData1());
  }).catch();
  /*
  return new Promise((resolve, reject) => {
    this.dbService.getLocations_location()
      .then((res: any) => {
        console.log('Location get',res);
        this.LOCATIONS = res;
        resolve();
      })
      .catch(err => {
        console.log(err);
        reject(err);
      })
  })
  */
}
dummyData1() {
    return [
      {
        "position": {
          "lat": 10.780482,
          "lng": 106.70223
        },
        "name": "Bệnh viện nhi đồng 2",
        "address": "14 Lý Tự Trọng, P. Bến Nghé, Q. 1, Tp. HCM",
        "icon": "assets/markercluster/marker.png"
        },
        {
        "position": {
        "lat": 10.779495,
        "lng": 106.68199
        },
        "name": "Bệnh viện da liễu",
        "address": "2 Nguyễn Thông, P. 6, Q. 3, Tp. HCM",
        "icon": "assets/markercluster/marker.png"
        },
        {
        "position": {
        "lat": 10.757663,
        "lng": 106.6587537
        },
        "name": "Bệnh viện Chợ Rẫy",
        "address": "201B Nguyễn Chí Thanh, phường 12, quận 5",
        "icon": "assets/markercluster/marker.png"
        },
        {
        "position": {
        "lat": 10.37211,
        "lng": 106.453621
        },
        "name": "Phòng khám đa khoa Hoà Hảo",
        "address": "254 Hoà Hảo, phường 4, quận 10, HCM",
        "icon": "assets/markercluster/marker.png"
        },
        {
        "position": {
        "lat": 10.7685558,
        "lng": 106.6843567
        },
        "name": "Bệnh viện Từ Dũ",
        "address": "106 Cống Quỳnh, Phạm Ngũ Lão, Quận 1, TP. HCM",
        "icon": "assets/markercluster/marker.png"
        }
    ]
  }

}
