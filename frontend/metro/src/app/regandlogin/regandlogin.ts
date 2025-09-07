import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-regandlogin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './regandlogin.html',
  styleUrls: ['./regandlogin.css']
})
export class Regandlogin {
  name = '';
  email = '';
  mobno = '';
  password = '';

  constructor(private http: HttpClient) {} // 👈 HttpClient injection

  save() {
    const formData = {
      name: this.name,
      email: this.email,
      mobno: this.mobno,
      password: this.password
    };

    this.http.post('http://localhost:3000/add', formData).subscribe(
      (response) => {
        console.log('Data sent successfully', response);
        alert('User Registered Successfully!');
        // Reset form after submit
        this.name = '';
        this.email = '';
        this.mobno = '';
        this.password = '';
      },
      (error) => {
        console.error('Error sending data', error);
      }
    );
  }
}
