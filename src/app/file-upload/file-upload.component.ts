import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  fileData: File = null;
  selectedFiles: FileList;

  constructor(private router: Router, private http: HttpClient, private storage: AngularFireStorage) { }

  ngOnInit() {
  }

  fileProgress(fileInput: any) {
    this.fileData = <File> fileInput.target.files[0];
  }

  uploadFile(event) {
    const file: FileList = event.target.files;
    const selectedFile = file.item(0);
    const filePath = 'gs://js-recommender.appspot.com/uploads';
    const task = this.storage.upload(filePath, file);
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.fileData);
    this.http.post('gs://js-recommender.appspot.com/', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(events => {
      if(events.type == HttpEventType.UploadProgress) {
          console.log('Upload progress: ', Math.round(events.loaded / events.total * 100) + '%');
      } else if(events.type === HttpEventType.Response) {
          console.log(events);
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['dashboard']);
  }

}
