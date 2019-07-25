import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductDataService {
  private dataPath = '/data';
  private userPreferencesPath = '/ratings';
  private firebase;

  private dataList: AngularFireList<any>;
  private ratingsList: AngularFireList<any>;

  constructor(private database: AngularFireDatabase, private firebaseAuth: AngularFireAuth) {
    this.dataList = this.database.list('data');
    this.ratingsList = this.database.list('ratings');
   }

  addData(data){
    this.firebase = this.database.database.ref(this.dataPath);
    this.firebase.push(data);
    console.log('Data Push was Successful');
  }

  getDataFromFirebase() {
    return this.dataList;
  }

  removeData($key: string) {
    this.dataList.remove($key);
  }

  getCurrentUser() {
    const currentUser = this.firebaseAuth.auth.currentUser;
    if (currentUser != null) {
      return currentUser.email;
    } else{
      return null;
    }
  }

  addUserPreferences(userPreferences) {
    const currentUser = this.getCurrentUser();
    if (currentUser != null) {
      const userInformation = this.ratingsList;

      userInformation.snapshotChanges().forEach(ratingSnapshots => {
        let currentUsersWithInfo = [];
        ratingSnapshots.forEach(ratingSnapshot => {
          let ratingSet = ratingSnapshot.payload.val();
          console.log(ratingSet);

          if(currentUsersWithInfo.indexOf(ratingSet.user) == -1){
            console.log(ratingSet.user);
            currentUsersWithInfo.push(ratingSet.user);
          }

        });
        console.log(currentUsersWithInfo);
      });
    }
    this.firebase = this.database.database.ref(this.userPreferencesPath);
    this.firebase.push(userPreferences);
    console.log('Ratings Push was Successful');
  }

}
