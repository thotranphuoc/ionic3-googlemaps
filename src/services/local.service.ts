import { Injectable } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { iPosition } from '../interfaces/position.interface';
import { iLocation } from '../interfaces/location.interface';
import { iUser } from '../interfaces/user.interface';
import { NavController } from 'ionic-angular/navigation/nav-controller';


@Injectable()


export class LocalService {
    loading: any;
    count: number = 0;
    LANGUAGES = [];
    LOCATIONTYPES = [];
    isLoading: boolean = false;
    BASIC_INFOS = null;
    constructor(
        private loadingCtrl: LoadingController,
        // private navCtrl: NavController
    ) { }

    // isBack = false;
    // doGoBack(){
    //     if(this.isBack){
    //         this.navCtrl.pop();
    //     }else{
    //         this.navCtrl.setRoot('MapPage');
    //     }
    // }
    USER: iUser = null;
    USER_DEFAULT: iUser = {
        Address: '',
        Email: '',
        FullName: '',
        GiftSort: '',
        Image: '',
        Level: '',
        NumberLocation: '',
        Password: '',
        Phone: '',
        Score: '',
        lat: '0',
        lng: '0',
        Team:'',
        Introduction:'',
    }
    STRING = '';
    USER_CURRENT_LOCATION: iPosition = null;

    LOCATION: iLocation = {
        Address: '',
        Date_Updated: '',
        Image: '',
        IsActive: '',
        Latitude: '',
        LocationID: '',
        LocationTypeID: '',
        LocationType_Ref: '',
        Longitude: '',
        Name: '',
        Name_en: '',
        Phone: '',
        Title: '',
        Url_Image: '',
        User_Phone: '',
        Note: '',
        Hide: 'false',

    };
    LOCATION_DEFAULT: iLocation = {
        Address: '',
        Date_Updated: '',
        Image: '',
        IsActive: '',
        Latitude: '',
        LocationID: '',
        LocationTypeID: '',
        LocationType_Ref: '',
        Longitude: '',
        Name: '',
        Name_en: '',
        Phone: '',
        Title: '',
        Url_Image: '',
        User_Phone: '',
        Note: '',
        Hide: 'false',
    }

    LOCATIONS: iLocation[] = [];
}