import { BreakpointObserver } from '@angular/cdk/layout';
import { Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppServiceService } from '../service/app-service.service';
import { LoaderService, SnackbarConfig } from '../service/loader.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  path: string ="";
  response!: any;
  reportPath: string = '';
  res!:any;
  showFirstOptionCard:boolean=false;
  showPathCardForSingle:boolean=false;
  showPathCardForMultiple:boolean=false;
  showPathCard: boolean = false;
  fileName: string[]=[];
  showReport: boolean = false;

  @ViewChild('matProgressSpinner') matProgressSpinner!: TemplateRef<any>;
  @ViewChild('files') filesContent!: TemplateRef<any>;

  constructor(private service:AppServiceService,private sanitizer:DomSanitizer, private loaderService:LoaderService, private overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private breakpointObserver: BreakpointObserver,
    private _snackBar: MatSnackBar,
    private router: Router, private dialog: MatDialog) { }
 
  isLoading: boolean = false;
  ngOnInit(): void {
    this.getDataFromAPI();
    this.loaderService.getIsProgreesing().subscribe({
      next: (data: boolean) => {
        if (data) {
          this.isLoading = data;
          this.overlaySpinner();
        } else {
          this.isLoading = data;
          this.closeSpinner();
        }
      }
    });

    this.loaderService.getIsFileLoaded().subscribe({
      next: (data: SnackbarConfig) => {
        if (data.isVisible) {
          this.openSnackBar(data);
          setTimeout(() => {
            this.router.navigate(['/dashboard']);

          }, 3000);
        }
      }
    })

    
  }

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    backdropClass: 'loading-overlay',
    panelClass: 'center',
    positionStrategy: this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically(),
  });


  getDataFromAPI(){
    this.service.getData().subscribe((data) => {
      console.log(data);
      
    }, (error) =>{
      console.log(error);
    }
    )
  }

  processingMessage='';
  generateForMultiple(){
    this.response=null;
    this.loaderService.setIsProgressing(true);
    this.processingMessage='Generatiom test cases...';
    this.service.generateMultiple(this.path).subscribe((data:any)=>{
      this.response=data;
      this.fileName=[];
      for(let i=0;i<this.response.files.length;i++){
        this.fileName.push(this.response.files[i].substring((this.response.files[i].lastIndexOf('/')+1)));

      }
      this.loaderService.setIsProgressing(false);
    },(error:HttpErrorResponse)=>{
      this.loaderService.setIsProgressing(false);
      this._snackBar.open(error.error.message,'',{
        horizontalPosition:'center',
        verticalPosition:'top',
        duration:3000,
        panelClass:'danger'
      })
    })
  }

  generateForSingle(){
    this.loaderService.setIsProgressing(true);
    this.processingMessage='Generatiom test cases...';
    this.service.generateSingle(this.path).subscribe((data:any)=>{
      this.response=data;
      this.fileName=[];
      for(let i=0;i<this.response.files.length;i++){
        this.fileName.push(this.response.files[i].substring((this.response.files[i].lastIndexOf('/')+1)));

      }
      this.loaderService.setIsProgressing(false);
    },(error:HttpErrorResponse)=>{
      this.loaderService.setIsProgressing(false);
      this._snackBar.open(error.error.message,'',{
        horizontalPosition:'center',
        verticalPosition:'top',
        duration:3000,
        panelClass:'danger'
      })
    })
  }

  runTestForSingle(){
    this.loaderService.setIsProgressing(true);
    this.processingMessage='Running test ...';
    this.service.getReportForSingle(this.path).subscribe((data:any)=>{
      this.res=data;
      this.loaderService.setIsProgressing(false);
    },(error:HttpErrorResponse)=>{
      this.loaderService.setIsProgressing(false);
    })
  }

  runTestForMultiple(){
    this.loaderService.setIsProgressing(true);
    this.processingMessage='Running test ...';
    this.service.getReportForMultiple(this.path).subscribe((data:any)=>{
      this.res=data;
      this.loaderService.setIsProgressing(false);
    },(error:HttpErrorResponse)=>{
      this.loaderService.setIsProgressing(false);
    })
  }

  onSubmitClick(){
    console.log(this.path);
    this.loaderService.setIsProgressing(true);
    this.service.postData(this.path).subscribe(data=>{
      console.log(data);
      this.response= data;
      console.log(this.response.files);
      for(let i=0;i<this.response.files.length;i++){
        this.fileName.push(this.response.files[i].substring((this.response.files[i].lastIndexOf('/')+1)));
      }
      this.loaderService.setIsProgressing(false);
    }, (error) =>{
      console.log(error);
    }
    );

  }

  onRunTestClick(){
    this.loaderService.setIsProgressing(true);
    this.service.getReport(this.path).subscribe(data =>{
      console.log(data);
      this.res = data;
      this.reportPath = this.res.path;
      console.log(this.res.path);
      this.loaderService.setIsProgressing(false);
      this.showReport = true;
    }, (error)=>{
      console.log(error);
      this.loaderService.setIsProgressing(false);
      
    }
    );
  }

  getlink():SafeUrl {
    // window.open(this.sanitizer.bypassSecurityTrustUrl(this.reportPath).toString(), "_blank");
    return this.sanitizer.bypassSecurityTrustUrl(this.reportPath);
}

externalWindow:Window|null=null;
  onReportClick(){
    this.service.getReport(this.path).subscribe(data=>{
      this.externalWindow=window.open('http://localhost:8000', '_blank');
    })
    
  }


  onBtnClick(){
    this.showPathCard = true;
  }

  overlaySpinner() {
    let spinnerportal = new TemplatePortal(
      this.matProgressSpinner,
      this._viewContainerRef
    );

    this.overlayRef.attach(spinnerportal);
  }
  closeSpinner() {
    this.overlayRef.detach();
  }

  openSnackBar(data: SnackbarConfig) {
    this._snackBar.open(data.text, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: data.duration,
      panelClass: 'success'
    });
    this.loaderService.setIsFileLoaded({
      isVisible: false,
      text: ''
    });
  }


  openFilesDialog(){
    const dialogRef = this.dialog.open(this.filesContent,{
      width: '1000px',
      height: '500px',
      disableClose: true,
    });
  }

}
