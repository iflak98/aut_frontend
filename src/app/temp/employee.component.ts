import { Component, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import{FormBuilder,FormGroup, Validators} from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { MatTable, MatTableDataSource} from '@angular/material/table';
import { EmployeeModel } from './employe.model';
import { RouterLinkWithHref } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit, AfterViewInit {

  formValue !: FormGroup;
  employeeModelObj: EmployeeModel=new EmployeeModel();
  employeeData! : any;
  showAdd!: boolean;
  showUpdate!: boolean;
  displayedColumns: string[] = ['id', 'name', 'email', 'designation', 'edit', 'delete'];
  regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  //dataSource1 = ELEMENT_DATA;
  public dataSource = new MatTableDataSource<EmployeeModel>();
 // dataSource: EmployeeModel[] = [];
  
  @ViewChild(MatSort)
  sort!: MatSort ;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private formbuilder: FormBuilder, private api: ApiService) { 
  
  }
  

  ngOnInit(): void {
    this.formValue=this.formbuilder.group({
      name : ['', [Validators.required, Validators.minLength(5)]],
      email : ['', [Validators.required, Validators.email, Validators.pattern(this.regexp)]],
      designation : ['', [Validators.required]]
    })
    this.getAllEmployee();
    
  
  }

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
  }
  
  clickAddEmployee(){
    this.formValue.reset()
    this.showAdd=true;
    this.showUpdate=false;
  }
postEmployeeDetails(){
  this.employeeModelObj.name=this.formValue.value.name;
  this.employeeModelObj.email=this.formValue.value.email;
  this.employeeModelObj.designation=this.formValue.value.designation;

  this.api.postEmployee(this.employeeModelObj)
  .subscribe(
    res=>{
    console.log('from' ,res);
    alert("Details Added Successfully")
    let ref =document.getElementById('cancel')
    ref?.click();
    this.formValue.reset();
    this.getAllEmployee();
  },
  err=>{
    alert("Something Went Wrong");
  })
}

getAllEmployee(){
  this.api.getEmployee()
  .subscribe(res=>{
    console.log("hello from get employee : "+res);
    this.employeeData= res;
    this.dataSource= new MatTableDataSource(res);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  })
}

deleteEmployee(row:any){
  this.api.deleteEmployee(row.id).subscribe(res=>{
    alert("Employee Deleted");
    this.getAllEmployee();
  })
}

onEdit(row: any){
  this.showAdd=false;
    this.showUpdate=true;
  this.employeeModelObj.id=row.id;
  this.formValue.controls['name'].setValue(row.name)
  this.formValue.controls['email'].setValue(row.email)
  this.formValue.controls['designation'].setValue(row.designation)
}

updateEmployeeDetails(){
  this.employeeModelObj.name=this.formValue.value.name;
  this.employeeModelObj.email=this.formValue.value.email;
  this.employeeModelObj.designation=this.formValue.value.designation;
  this.api.updateEmployee(this.employeeModelObj,this.employeeModelObj.id)
  .subscribe(res=>{
    alert("Updated Successfully")
    let ref =document.getElementById('cancel')
    ref?.click();
    this.formValue.reset();
    this.getAllEmployee();
  })
}

public doFilter = (value: string) => {
  this.dataSource.filter = value.trim().toLocaleLowerCase();
}
}
