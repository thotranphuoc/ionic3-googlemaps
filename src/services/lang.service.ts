import { Injectable } from '@angular/core';
import { LocalService } from './local.service';

@Injectable()


export class LangService {
     LANGUAGES: string[] = ['EN', 'VI'];
     index: any = '0';
     LANG: string = 'VI';
     constructor( private localService: LocalService){

     }
     setLanguage(index: number, LANG: string) {
          this.index = index;
          this.LANG = LANG;
     }

     pricesUpdate: any = {
          A1: { EN: 'Above knee prosthese', VI: '' },
          A2: { EN: 'Below knee prosthese', VI: '' },
          A3: { EN: 'Below knee prosthese with high corset', VI: '' },
          A4: { EN: 'Trans-Tibal, short stump with hight', VI: '' },
          A5: { EN: 'Knee disarticulaation prosthese', VI: '' },
          A6: { EN: 'KMC', VI: '' },
          A7: { EN: 'Mang nhua cang', VI: '' },
          B1: { EN: 'Above knee prosthese', VI: '' },
          B2: { EN: 'Below knee prosthese', VI: '' },
          B3: { EN: 'Below knee prosthese with high corset', VI: '' },
          B4: { EN: 'Trans-Tibal, short stump with hight', VI: '' },
          B5: { EN: 'Knee disarticulaation prosthese', VI: '' },
          B6: { EN: 'KMC', VI: '' },
          B7: { EN: 'Mang nhua cang', VI: '' },
          C1: { EN: 'Above knee prosthese', VI: '' },
          C2: { EN: 'Below knee prosthese', VI: '' },
          C3: { EN: 'Below knee prosthese with high corset', VI: '' },
     }

     getLanguagesObjectFromPageId(pageId: string){
          let LANGUAGES: any[] = this.localService.LANGUAGES[pageId];
          return this.convertArray2Object(LANGUAGES)
     }

     convertArray2Object(LANGUAGES: any[]) {
          
          let OBJ: any = {}
          console.log('convert Array');
          console.log(LANGUAGES);
          LANGUAGES.forEach(L => {
               OBJ[L.KEY] = L
          })
          console.log(OBJ);
          return OBJ;
     }

     convertObject2Array(OBJ: any) {
          let KEYS = Object.keys(OBJ);
          let ARR = [];
          KEYS.forEach(KEY => {
               let ITEM = OBJ[KEY];
               ITEM['KEY'] = KEY;
               ARR.push(ITEM);
          });
          return ARR;
     }




}