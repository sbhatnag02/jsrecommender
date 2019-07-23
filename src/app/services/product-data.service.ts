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
  private firebaseDatabase: AngularFireDatabase;

  constructor(private database: AngularFireDatabase) {
    this.dataList = this.database.list('data');
   }

  addData(data){
    this.firebase = this.database.database.ref(this.path);
    this.firebase.push(data);
    console.log('Data Push was Successful');
  }

  getDataFromFirebase() {
    return this.dataList;
  }

}
