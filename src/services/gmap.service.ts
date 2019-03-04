import { Injectable } from '@angular/core';
import { LoadingController, Loading, PopoverController } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { LocalService } from './local.service';
import { iPosition } from '../interfaces/position.interface';
import { iLocation } from '../interfaces/location.interface';
import { AppService } from './app.service';

declare var google: any;
@Injectable()


export class GmapService {
    loading: any;
    count: number = 0;
    isLoading: boolean = false;
    currentUserPosition: iPosition = null;
    bluecirle: string = '../assets/imgs/bluecircle.png';
    constructor(
        private popoverCtrl: PopoverController,
        private loadingCtrl: LoadingController,
        private localService: LocalService,
        private appService: AppService
    ) { }

    getCurrentLocation() {
        console.log('gmapSer.getcurrentLocation');
        console.log(navigator, navigator.geolocation);
        // alert(navigator.geolocation)
        return new Promise((resolve, reject) => {
            if (this.localService.USER_CURRENT_LOCATION) {
                resolve(this.localService.USER_CURRENT_LOCATION)
            } else {
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition((position)=>{
                        console.log('Curent location', position);
                        let pos = { lat: position.coords.latitude, lng: position.coords.longitude };
                        this.updateCurrentLocation(pos);
                        resolve(pos);
                    },(err)=>{
                        alert(err.message);
                        console.log({ MSG: 'navigator.geolocation not available' })
                        let pos = { lat: 10.780482, lng: 106.70223 };
                        this.updateCurrentLocation(pos);
                        this.appService.showToastWithCloseButton('Vui lòng bật định vị sau đó khởi động lại ứng dụng 2');
                        resolve(pos)
                    })
                    // navigator.geolocation.getCurrentPosition(position => {
                    //     console.log('Curent location', position);
                    //     let pos = { lat: position.coords.latitude, lng: position.coords.longitude };
                    //     this.updateCurrentLocation(pos);
                    //     resolve(pos);
                    // }, err => {
                    //     console.log({ MSG: 'navigator.geolocation not available' })
                    //     let pos = { lat: 10.780482, lng: 106.70223 };
                    //     this.updateCurrentLocation(pos);
                    //     this.appService.showToastWithCloseButton('Vui lòng bật định vị sau đó khởi động lại ứng dụng 2');
                    //     resolve(pos)
                    // })
                } else {
                    console.log('navigator not allowed')
                    let pos = { lat: 10.780482, lng: 106.70223 };
                    this.updateCurrentLocation(pos);
                    this.appService.showToastWithCloseButton('Vui lòng bật định vị sau đó khởi động lại ứng dụng 1')
                    resolve(pos)
                }
            }
        })
    }

    

    updateCurrentLocation(position) {
        this.currentUserPosition = position;
        this.localService.USER_CURRENT_LOCATION = position;
    }

    initMap(mapElement, mapOptions) {
        return new Promise((resolve, reject) => {
            let map: any;
            if (typeof (google) !== 'undefined') {
                map = new google.maps.Map(mapElement, mapOptions);
                resolve(map);
            } else {
                reject({ message: 'google is undefined' });
            }
        })
    }

    addBlueDotToMap(map: any, position: any) {
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: this.bluecirle
        });
    }

    addMarkerWithImageToMapWithIDReturnPromiseWithMarker(map, position: iPosition, LOCATION: iLocation) {
        return new Promise((resolve, reject) => {
            let pos = new google.maps.LatLng(position.lat, position.lng);
            let image = {
                url: LOCATION.Url_Image,
                // This marker is 20 pixels wide by 32 pixels high.
                // size: new google.maps.Size(75, 56),
                // The origin for this image is (0, 0).
                // origin: new google.maps.Point(37, 28),
                // The anchor for this image is the base of the flagpole at (0, 32).
                // anchor: new google.maps.Point(0, 26),
                scaledSize: new google.maps.Size(45, 53),
            };
            let marker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: image
            })

            marker.addListener('click', () => {
                console.log(LOCATION);
                // let popover = this.popoverCtrl.create('PopOverPage', LOCATION).present();

                this.popoverCtrl.create('PopOverPage', { LOCATION: LOCATION }).present()
                    .then((res) => { console.log(res); })
                    .catch((err) => {
                        console.log(err);
                    })
            })
        })
    }

    addMarkerWithImageToMapWithIDReturnPromiseWithMarkerWithoutRoute2Location(map, position: iPosition, LOCATION: iLocation) {
        return new Promise((resolve, reject) => {
            let pos = new google.maps.LatLng(position.lat, position.lng);
            let image = {
                url: LOCATION.Url_Image,
                // This marker is 20 pixels wide by 32 pixels high.
                // size: new google.maps.Size(75, 56),
                // The origin for this image is (0, 0).
                // origin: new google.maps.Point(37, 28),
                // The anchor for this image is the base of the flagpole at (0, 32).
                // anchor: new google.maps.Point(0, 26),
                scaledSize: new google.maps.Size(45, 53),
            };
            let marker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: image
            })
        })
    }

    drawDirection(map, DEPARTURE: iPosition, DESTINATION: iPosition) {
        let departure = new google.maps.LatLng(DEPARTURE.lat, DEPARTURE.lng);
        let destination = new google.maps.LatLng(DESTINATION.lat, DESTINATION.lng);
        return new Promise((resolve, reject) => {
            let directionsService = new google.maps.DirectionsService;
            let directionsDisplay = new google.maps.DirectionsRenderer({
                preserveViewport: true
            })
            // directionsDisplay.preserveViewport = fales;
            directionsDisplay.setMap(map);

            directionsService.route({
                origin: departure,
                destination: destination,
                travelMode: 'DRIVING'
            }, (response, status) => {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                    console.log(directionsDisplay.getDirections());
                    let DISTANCE = this.calcDistance(directionsDisplay.getDirections());
                    resolve({ DISTANCE: DISTANCE, RESULT: 'OK' });
                } else {
                    this.appService.showAlert('', 'Yêu cầu chỉ đường không thành công ' + status)
                    // alert('Yêu cầu chỉ đường không thành công ' + status);
                    reject({ RESULT: 'Failed', ERROR: status });
                }
            })
            
        })
        // this.calculateAndDisplayRoute(directionsService, directionsDisplay, DEPARTURE, DESTINATION){

        // }
    }
    calcDistance(result) {
        var total = 0;
        var myRoute = result.routes[0];
        for (var index = 0; index < myRoute.legs.length; index++) {
            total += myRoute.legs[index].distance.value;
        }
        total = total / 1000;
        console.log('Distance in km :', total);
        return total;
    }
}