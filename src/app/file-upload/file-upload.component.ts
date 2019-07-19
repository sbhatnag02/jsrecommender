import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from '@angular/fire/database';
import { ProductDataService } from '../services/product-data.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;

  file: any;

  constructor(private router: Router, private http: HttpClient, private storage: AngularFireStorage,
              private productdataservice: ProductDataService) { }

  ngOnInit() {
  }

  upload(event) {
    this.file = event.target.files[0];
    this.uploadDocument(this.file);

    const dataObj = {
      month: 'April',
      itemsSold: 3
    };
    // this.productdataservice.addData(event.target.files[0]);
    this.productdataservice.addData(dataObj);

    const id = 'dataset';
    this.ref = this.storage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
  }

  goToDashboard() {
    this.router.navigate(['dashboard']);
  }

  uploadDocument(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
      console.log(JSON.parse(fileReader.result.toString()));
    }
    fileReader.readAsText(this.file);
  }

}
