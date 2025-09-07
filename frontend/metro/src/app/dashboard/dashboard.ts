import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,           // 👈 make component standalone
  imports: [HttpClientModule], // 👈 import HttpClientModule here
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  username ='';
  ammount = 20;
  useremail = '';
  journeys: any[] = [];  // store journey history

  constructor(public route: Router, public httpclient: HttpClient) {}

  ngOnInit(): void {
    this.getProfileData();
  }

  getProfileData() {
    this.httpclient.get<any>('http://localhost:3000/userdata').subscribe(
      (response) => {
        console.log('Data received:', response);
        if (response && response.dbdata[3]) {
          this.username = response.dbdata.name 
          this.useremail = response.dbdata.email
        }
      },
      (error) => {
        console.error('Error fetching profile data:', error);
      }
    );
  }
}
