import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FormsModule } from '@angular/forms';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
// import { BaseArrayClassPage } from '../pages/base-array-class/base-array-class';
// import { PolygonPage } from '../pages/polygon/polygon';
// import { HtmlInfoWindowPage } from '../pages/html-info-window/html-info-window';
// import { MarkerClusterPage } from '../pages/marker-cluster/marker-cluster';
// import { GeocodingPage } from '../pages/geocoding/geocoding';
// import { PolylinePage } from '../pages/polyline/polyline';
// import { MarkerPage } from '../pages/marker/marker';
// import { CirclePage } from '../pages/circle/circle';
// import { GroundOverlayPage } fgrom '../pages/ground-overlay/ground-overlay';
// import { TileOverlayPage } from '../pages/tile-overlay/tile-overlay';
// import { KmlOverlayPage } from '../pages/kml-overlay/kml-overlay';
// import { StreetViewPage } from '../pages/street-view/street-view';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GoogleMaps } from "@ionic-native/google-maps";
// import { MapTestPage } from '../pages/map-test/map-test';

// From Dmap
import { LoadingService } from '../services/loading.service';
import { GmapService } from '../services/gmap.service';
import { LocalService } from '../services/local.service';
import { DbService } from '../services/db.service';
import { AppService } from '../services/app.service';
import { ImageService } from '../services/image.service';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { AgmCoreModule } from '@agm/core';
// firebase
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/messaging'
import { firebaseConfig } from '../config/firebase-config';
import { AutoCompleteModalPage } from '../pages/auto-complete-modal/auto-complete-modal';
import { AutoCompleteTwoModalPage } from '../pages/auto-complete-two-modal/auto-complete-two-modal';
firebase.initializeApp(firebaseConfig);
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    // BaseArrayClassPage,
    // PolygonPage,
    // HtmlInfoWindowPage,
    // MarkerClusterPage,
    // GeocodingPage,
    // PolylinePage,
    // MarkerPage,
    // CirclePage,
    // GroundOverlayPage,
    // TileOverlayPage,
    // KmlOverlayPage,
    // StreetViewPage,
    // MapTestPage,
    AutoCompleteModalPage,
    AutoCompleteTwoModalPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAf1-QYPFKYvSP4zsgd1rAPgGv_vsEWCzE',
      libraries: ['places']
    }),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    // BaseArrayClassPage,
    // PolygonPage,
    // HtmlInfoWindowPage,
    // MarkerClusterPage,
    // GeocodingPage,
    // PolylinePage,
    // MarkerPage,
    // CirclePage,
    // GroundOverlayPage,
    // TileOverlayPage,
    // KmlOverlayPage,
    // StreetViewPage,
    // MapTestPage,
    AutoCompleteModalPage,
    AutoCompleteTwoModalPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    // from Dmap
    LoadingService,
    GmapService,
    LocalService,
    DbService,
    AppService,
    ImageService,
    Geolocation,
  ]
})
export class AppModule { }
