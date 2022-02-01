import { ApiserviceService } from './../apiservice.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {

  constructor(private service: ApiserviceService) { }

  readData: any;

  ngOnInit(): void {
    this.service.getAllData().subscribe((res) => {
      console.log(res, "res==>");

      this.readData = res.data;
    });
  }

}
