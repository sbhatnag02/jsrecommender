import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductDataService {
  private path = '/data';
  private firebase;
  private dataList: AngularFireList<any>;

  constructor(private database: AngularFireDatabase) {
    this.dataList = this.database.list('data');
   }

  addData(data){
    this.firebase = this.database.database.ref(this.path);
    this.dataList.push(data);
    console.log('Data Push was Successful');
  }

  getDataFromFirebase() {
    return this.dataList;
  }

  removeData($key: string) {
    this.dataList.remove($key);
  }

}
