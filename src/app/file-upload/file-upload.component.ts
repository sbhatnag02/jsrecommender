import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from '@angular/fire/database';
import { ProductDataService } from '../services/product-data.service';
import { DataObj } from '../file-upload/data-obj';

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
    // const data: DataObj = JSON.parse('{ "month: "Jan", "numProductsSold": 9 }');
    // console.log(data.month);
    // console.log(data.numProductsSold);

    const sampleData = {
      month: 'May',
      itemsSold: 4
    };
    this.productdataservice.addData(sampleData);

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
      const dataobj: DataObj[] = JSON.parse(fileReader.result.toString());
      console.log(dataobj);
    }
    fileReader.readAsText(this.file);
  }

}
