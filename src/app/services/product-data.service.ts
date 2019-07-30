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
  private currentUserIndex = 0;

  private allUserRatings = [];
  private similarityRating = 0;

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
    let userFound = false;
    let ratingKey = '';
    const userList = [];

    this.ratingsList.snapshotChanges().forEach(ratingsSnapshots => {
      ratingsSnapshots.forEach(ratingsSnapshot => {
        const ratingItem = ratingsSnapshot.payload.toJSON();

        if(this.getUser(ratingItem) == this.getCurrentUser()) {
          console.log('User Data Exists, will be updated');
          ratingKey = ratingsSnapshot.key;
          userFound = true;
        }
      });

      if (userFound) {
        this.updateRatingData(ratingKey, userPreferences);
      } else {
        this.addRatingData(userPreferences);
      }
    });
  }

  getAllRatings() {
    let index = 0;
    this.ratingsList.snapshotChanges().forEach(ratingsSnapshots => {
      ratingsSnapshots.forEach(ratingsSnapshot => {
        const ratingItem = ratingsSnapshot.payload.toJSON();
        this.allUserRatings[index] = this.getRatingsFromItem(ratingItem);
        index++;
      });
      this.showAllRatings();
      this.computeRatingSimilarity();
    });
  }

  findIndexOfCurrentUser() {
    let i = 0;
    let currentUserIndex = 0;

    while (i < this.allUserRatings.length) {
      const currentUser = this.getCurrentUser();
      if (this.allUserRatings[i][this.allUserRatings[i].length - 1] == currentUser){
        currentUserIndex = i;
        return currentUserIndex;
      }
      i++;
    }
  }

  computeRatingSimilarity() {
    let currentUserInfoIndex = this.findIndexOfCurrentUser();
    let mostSimilarUserIndex = 0;
    let euclideanDistanceSum = Number.MAX_SAFE_INTEGER;
    let count = 0;

    let i = 0;
    while(i < this.allUserRatings.length){
      if(i != currentUserInfoIndex) {
        let j = 0; let currentEuclideanDistanceSum = 0; count = 0;
        while(j < this.allUserRatings[i].length - 1) {
          if(this.allUserRatings[i][j] != 0 &&  this.allUserRatings[currentUserInfoIndex][j] != 0) {
            currentEuclideanDistanceSum += Math.pow((this.allUserRatings[i][j] - this.allUserRatings[currentUserInfoIndex][j]), 2);
            console.log(this.allUserRatings[i][j] - this.allUserRatings[currentUserInfoIndex][j]);
          }
          j++;
          count++;
        }
        let newEuclideanSum = Number.MAX_SAFE_INTEGER;
        if(count != 0){
          newEuclideanSum = Math.sqrt(currentEuclideanDistanceSum) / (count);
          newEuclideanSum = 1/(1+newEuclideanSum);
        }
        if(newEuclideanSum < euclideanDistanceSum) {
          euclideanDistanceSum = newEuclideanSum;
          mostSimilarUserIndex = i;
          console.log(mostSimilarUserIndex);
        }
        console.log(this.allUserRatings[i]);
        console.log(euclideanDistanceSum);
      }
      i++;
    }
    this.similarityRating = euclideanDistanceSum;
    return mostSimilarUserIndex;
  }

  predictPreference(graphIndex) {
    const similarityScore = this.similarityRating;
    console.log(this.allUserRatings[this.computeRatingSimilarity()][graphIndex]);
    const predictedScore = Math.round(similarityScore * (this.allUserRatings[this.computeRatingSimilarity()][graphIndex]));
    return predictedScore;
  }

  showAllRatings() {
    console.log(this.allUserRatings);
  }

  getRatingsFromItem(ratingItem) {
    return [ratingItem.Bar, ratingItem.Doughnut, ratingItem.Line,
    ratingItem.Pie, ratingItem.Polar, ratingItem.Radar, ratingItem.user];
  }

  updateRatingData(ratingKey, updatedPreferences) {
    this.ratingsList.update(ratingKey, updatedPreferences);
  }

  getUser(ratingItem) {
    return ratingItem.user;
  }

  getChartPreferences(user) {
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

  addRatingData(userPreferences) {
    this.firebase = this.database.database.ref(this.userPreferencesPath);
    this.firebase.push(userPreferences);
    console.log('Ratings Data Push Successful');
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
