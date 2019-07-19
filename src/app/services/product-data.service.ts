import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ProductDataService {
  private path = '/data';
  constructor(private database: AngularFireDatabase) { }

  addData(data){
    const obj = this.database.database.ref(this.path);
    obj.push(data);
    console.log('Data Push was Successful');
  }

}
