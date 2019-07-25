import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from '@angular/fire/database';
import { ProductDataService } from '../services/product-data.service';
import { NgxXml2jsonService } from 'ngx-xml2json';

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
              private productdataservice: ProductDataService, private ngxXml2jsonService: NgxXml2jsonService) { }

  ngOnInit() {
  }

  uploadXML(event) {
    alert('Choose different file format');

    const id = 'dataset';
    this.ref = this.storage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
  }

  uploadXMLDocument(file) {
    const parser = new DOMParser();
    const xml = parser.parseFromString('<Month>Jan</Month><Sold>9</Sold></element>'
    + '<Month>Feb</Month><Sold>7</Sold>', 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);
    console.log(JSON.stringify(obj));
    console.log('Method Called External');
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
