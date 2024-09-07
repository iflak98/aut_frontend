import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  baseApiUrl:string="http://localhost:3000"
  constructor(private http: HttpClient) { }

  getData(){
    return this.http.get(this.baseApiUrl+'/getData');
  }

  postData(pathName:string){
    return this.http.post(this.baseApiUrl+'/saveFilePath',pathName);
  }

  getReport(pathName:string){
    return this.http.post(this.baseApiUrl+'/generateCoverage',pathName);
  }

  generateMultiple(pathName:string){
    return this.http.post(this.baseApiUrl+'/generateMultiple',pathName);
  }

  generateSingle(pathName:string){
    return this.http.post(this.baseApiUrl+'/generateSingle',pathName);
  }

  getReportForSingle(pathName:string){
    return this.http.post(this.baseApiUrl+'/runTest/single',pathName);
  }


  getReportForMultiple(pathName:string){
    return this.http.post(this.baseApiUrl+'/runTest/multiple',pathName);
  }

  getLogs(){
    return this.http.get(this.baseApiUrl+'/logs');
  }
}
