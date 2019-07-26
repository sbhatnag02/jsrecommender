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

  private foundUser: boolean = false;
  private currentUsersWithInfo = [];

  constructor(private database: AngularFireDatabase, private firebaseAuth: AngularFireAuth, 
              private firestore: AngularFirestore) {
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

  getRatingDataFromFirebase() {
    return this.ratingsList;
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
      this.getCurrentRatingInformation(userPreferences);
  }

  getChartPreferences(user) {
    let chartPrefernces = [];
    this.ratingsList.snapshotChanges().forEach(ratingsSnapshots => {
      ratingsSnapshots.forEach(ratingsSnapshot => {
        let ratingItem = ratingsSnapshot.payload.toJSON();
        if (this.checkUserMatch(user, ratingItem)) {
          console.log(ratingItem);
          return this.assignPreferences(ratingItem);
        }
        console.log(this.checkUserMatch(user, ratingItem));
      });
    });
  }

  assignPreferences(ratingItem) {
    let preferences = [];
    preferences = [['Bar', ratingItem.Bar], ['Doughnut', ratingItem.Doughnut], ['Line', ratingItem.Line],
    ['Pie', ratingItem.Pie], ['Polar', ratingItem.Polar], ['Radar', ratingItem.Radar]];
    return preferences;
  }

  checkUserMatch(user, ratingItem) {
    if (user === ratingItem.user) {
      return true;
    } else {
      return false;
    }
  }

  getCurrentRatingInformation(userPreferences) {
    const userList = [];
    this.ratingsList.snapshotChanges().forEach(ratingsSnapshots => {
      // If there is no rating data in the database
      const dataLength = ratingsSnapshots.length;
      let currentCount = 0;
      if(dataLength == 0) {
        this.addLocalRatingData(null, userPreferences, null);
      }

      ratingsSnapshots.forEach(ratingsSnapshot => {
        if(currentCount > dataLength){
          return userList;
        }
        let ratingItem = ratingsSnapshot.payload.toJSON();
        let ratingKey = ratingsSnapshot.key;
        this.addLocalRatingData(ratingItem, userPreferences, ratingKey);
        console.log(currentCount);
        currentCount++;
      });
      return userList;
    });
    return userList;
  }

  addLocalRatingData(ratingItem, userPreferences, ratingKey) {
    const currentUser = this.firebaseAuth.auth.currentUser.email;
    if(currentUser != null) {
      if(ratingItem == null){
        this.firebase = this.database.database.ref(this.userPreferencesPath);
        this.firebase.push(userPreferences);
        console.log('Ratings Data Push Successful');
      } else if (ratingItem.user == currentUser) {
        this.ratingsList.update(ratingKey, userPreferences);
        console.log('User already in system, data will be updated');
      } else {
        this.firebase = this.database.database.ref(this.userPreferencesPath);
        this.firebase.push(userPreferences);
        console.log('Ratings Data Push Successful');
      }
    }
  }

  updateUserRatingData(userPreferences, ratingKey) {
      this.firestore.doc(this.userPreferencesPath + ratingKey).update(userPreferences);
  }

  showUsers() {
    console.log(this.currentUsersWithInfo);
  }

  checkForUser(user) {
    if (this.currentUsersWithInfo.indexOf(user) == -1) {
      return false;
    } else {
      return true;
    }
  }

  clearCurrentUsers() {
    this.currentUsersWithInfo = [];
  }

}
