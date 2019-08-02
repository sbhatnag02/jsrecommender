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

  xml2Jsonobj: object;

  constructor(private router: Router, private http: HttpClient, private storage: AngularFireStorage,
              private productdataservice: ProductDataService) { }

  ngOnInit() {
  }

  openFile(event) {
    let input = event.target;
    let text = '';
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      text = fileReader.result.toString();
      console.log(text);
      
      let parseString = require('xml2js').parseString;
      parseString(text, function (err, result) {
        this.xml2Jsonobj = JSON.parse(JSON.stringify(result));
        console.log(this.xml2Jsonobj);
        console.dir(result);
      });

      const id = 'dataset';
      this.ref = this.storage.ref(id);
      this.task = this.ref.put(event.target.files[0]);
      this.uploadProgress = this.task.percentageChanges();

      this.uploadXML();
    };

    console.log(fileReader.readyState);
    fileReader.readAsText(input.files[0]);
    console.log(fileReader.readyState);

  }

  uploadXML() {
    console.log(this.xml2Jsonobj);
  }

  uploadXMLDocument(file) {
    console.log(file);
    const xmlText = new XMLSerializer().serializeToString(file);
    console.log(xmlText);
    // let fileReader = new FileReader();
    // fileReader.onload = function (e) {
    // };

    // fileReader.addEventListener("loadend", function() {
    //   file = document.getElementById('xmlUpload');
    // });

    // console.log(fileReader.readAsText(file));
  }

  uploadCSV(event) {
    this.file = event.target.files[0];
    this.uploadCSVDocument(this.file);

    const id = 'dataset';
    this.ref = this.storage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
  }

  upload(event) {
    this.file = event.target.files[0];
    this.uploadDocument(this.file);

    const id = 'dataset';
    this.ref = this.storage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
  }

  goToDashboard() {
    this.router.navigate(['dashboard']);
  }

  csvJSON(csvText) {
    var lines = csvText.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    console.log(headers);

    for (var i = 1; i < lines.length-1; i++) {
        var obj = {};
        var currentline = lines[i].split(",");
        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result;
  }

  uploadCSVDocument(file){
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      const fileReaderResult = fileReader.result.toString();
      console.log(fileReaderResult);

      const csvConvertedTtoJSON = this.csvJSON(fileReaderResult);
      let JSONStringify = JSON.stringify(csvConvertedTtoJSON);
      let JSONStringifyFormatted = JSONStringify.replace(/\\r/g, "");

      const data: string = JSON.parse(JSONStringifyFormatted);
      console.log(data);
      console.log(fileReader.result);
      this.productdataservice.addData(data);
      console.log('CSV Push Completed');
    };
    fileReader.readAsText(this.file);
  }

  uploadDocument(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
      const data: string = JSON.parse(fileReader.result.toString());
      console.log(data);
      this.productdataservice.addData(data);
      console.log('Data Push Completed');
    };

    fileReader.readAsText(this.file);
  }

}
