import { Injectable } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';


@Injectable()


export class DbService {
    loading: any;
    count: number = 0;
    isLoading: boolean = false;
    constructor(
        private loadingCtrl: LoadingController,
        private httpClient: HttpClient
    ) { }

   
    getLocations(){
        return this.httpClient.get('http://www.drdvietnam.org/bandotiepcan/service?action=getAllLocation').toPromise()
        // .subscribe((res)=>{
        //     console.log(res);
        // })
    }

    getLocation(ID: string){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=getLocation&LocationID='+ID;
        console.log(url);
        return this.httpClient.get(url).toPromise();
    }

    getInformation(ID: string){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=getInformation&ID='+ID;
        console.log(url);
        return this.httpClient.get(url).toPromise();
    }

    getAllQuestionTypes(){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=getAllQuestionType'
        return this.httpClient.get(url).toPromise();
    }

    getAllQuestionsOfType(ID: string){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=getQuestionList&question_type='+ID;
        return this.httpClient.get(url).toPromise();
    }

    getAllLocationTypes(){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=getAllLocationType'
        return this.httpClient.get(url).toPromise();
    }

    locationNewAdd(Latitude,Longitude,Title,Address,Phone,User_Phone,LocationType_Ref,Qtype,QStar,QA,Active, Note, Hide){
       // http://www.drdvietnam.org/bandotiepcan/service?action=insertLocation&Latitude=10&Longitude=100&Title=Title&Address=Address&Phone=Phone&User_Phone=User_Phone&LocationType_Ref=1&Star=3&QuestionType=1;2;3&QuestionAnswer=1-co;2-khong;3-co
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=insertLocationV2&Latitude='+Latitude+'&Longitude='+Longitude+'&Title='+Title+'&Address='+Address+'&Phone='+Phone+'&User_Phone='+User_Phone+'&LocationType_Ref='+LocationType_Ref+'&QuestionType='+Qtype+'&Star='+QStar+'&QuestionAnswer='+QA+'&Active='+Active +'&Note='+Note +'&Hide='+Hide;
        console.log(url);
        return this.httpClient.get(url).toPromise();
    }
    locationNewAddActive(LocationID)
    {
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=UpdateLocation&LocationID='+LocationID;
        console.log(url);
        return this.httpClient.get(url).toPromise();
    }
    locationNewAddAllActive(User_Phone)
    {
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=UpdateAllLocation&phone='+User_Phone;
        console.log(url);
        return this.httpClient.get(url).toPromise();
    }
    userLogin(user: string, pw: string){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=login&email='+user+'&password='+pw;
        return this.httpClient.get(url).toPromise();
    }

    userNewRegister(fullname, matkhau, diachi, email, sodt){
        let url = "http://www.drdvietnam.org/bandotiepcan/service?action=insert&fullname=" + fullname + "&password=" + matkhau +"&address="+diachi+"&email="+email+"&telephone="+sodt;
        return this.httpClient.get(url).toPromise();
    }

    passwordChange(email: string, oldPassword: string, newPassword: string){
        let url = "http://www.drdvietnam.org/bandotiepcan/service?action=changepass&email="+email+"&passwordold="+oldPassword+"&password="+newPassword;
        return this.httpClient.get(url).toPromise();
    }

    passwordForgetEmailSend(email: string){
        let url ="http://www.drdvietnam.org/bandotiepcan/service?action=forgotpass&email="+email;
        return this.httpClient.get(url).toPromise();
    }

    profileUpdate(fullname: string, address: string, email: string, telephone: string){
        let url ='http://www.drdvietnam.org/bandotiepcan/service?action=updateUser&fullname='+fullname+'&address='+address+'&email='+email+'&telephone='+telephone;
        return this.httpClient.get(url).toPromise(); 
    }

    levelsGet(){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=getAllLevel';
        return this.httpClient.get(url).toPromise(); 
    }

    levelUpdate(Email, Level){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=update_Level&Email='+Email+'&Level='+Level;
        return this.httpClient.get(url).toPromise(); 
    }

    scoreUpdate(Email, Score){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=update_Score&Email='+Email+'&Score='+Score;
        return this.httpClient.get(url).toPromise(); 
    }

    commentAdd(FullName: string, LocationID: string,Date_Comment: string,comment: string ){
        let url='http://www.drdvietnam.org/bandotiepcan/service?action=insertComment&FullName='+FullName+'&LocationID='+LocationID+'&Comment='+comment+'&Date_Comment='+ Date_Comment;
        return this.httpClient.get(url).toPromise(); 
    }

    commentsGet(ID: string){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=getAllComment&LocationID='+ID;
        return this.httpClient.get(url).toPromise(); 
    }

    /*avatarUpdate(email: string, data64: string){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=ChangeImageInformation&email='+email+'&avata='+data64;
        return this.httpClient.get(url).toPromise();
    }
    */
   avatarUpdateLink(email: string, link: string){
    let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=ChangeLinkImageInformation&email='+email+'&link='+link;
    console.log(url);    
    return this.httpClient.get(url).toPromise();
}
    avatarGet(email: string){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=GetImageInformation&email='+email;
        return this.httpClient.get(url).toPromise();
    }

    locationValidationDetailGet(ID){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=getLocationInfoDetail&LocationID='+ID;
        return this.httpClient.get(url).toPromise();
    }

    locationOfUserGet(email: string){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=getLocationUser&email='+email;
        return this.httpClient.get(url).toPromise();
    }

    locationTempOfUserGet(email: string){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=getLocationTempUser&email='+email;
        return this.httpClient.get(url).toPromise();
    }

    locationTypeSettingsGet(email){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=getAllUserLoctionType&email='+email;
        return this.httpClient.get(url).toPromise();
    }

    locationTypeSetUpdate(email, phone, stringSet){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=setAllUserLoctionType&email='+email+'&phone='+phone+'&LocationType='+stringSet ;
        return this.httpClient.get(url).toPromise();
    }

    locationUserSet(email, lat, lng){
        let url = 'http://www.drdvietnam.org/bandotiepcan/service?action=SetLocationUser&email='+email+'&lat='+lat+'&lng='+lng;
        return this.httpClient.get(url).toPromise();
    }



    //VERIFIED: upload one image, return url
    uploadBase64Image2FBReturnPromiseWithURL(path: string, imageData: string, name: string) {
        return new Promise((resolve, reject) => {
            let storageRef = firebase.storage().ref(path + '/' + name);
            let uploadTask = storageRef.putString(imageData, 'data_url');
            uploadTask.on('state_changed', (snapshot: any)=>{
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(progress);
            },(error)=>{
                console.log(error);
                reject(error);
            },()=>{
                // completed
                uploadTask.snapshot.ref.getDownloadURL()
                .then((downloadURL => {
                    console.log(downloadURL);
                    resolve(downloadURL);
                }))
                .catch((err) => {
                    reject(err);
                })
            })
            
        })
    }
    
}