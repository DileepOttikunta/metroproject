import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookticket',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './bookticket.html',
  styleUrls: ['./bookticket.css']
})
export class Bookticket implements OnInit {

  places: any[] = [];
  fromPlace: number | null = null;
  toPlace: number | null = null;
  ticketResponse: any = null;

  isExpired: boolean = false;
  intervalId: any;

  constructor(private http: HttpClient,public route:Router) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/routes').subscribe({
      next: (res) => this.places = res,
      error: (err) => console.error('Error fetching routes:', err)
    });
  }
back(){
this.route.navigate(['/dashb'])
}
  bookTicket() {
    if (!this.fromPlace || !this.toPlace) {
      alert('⚠️ Please select both From and To places');
      return;
    }

    if (this.fromPlace === this.toPlace) {
      alert('⚠️ From and To places cannot be the same');
      return;
    }

    const payload = {
      userid: 1,
      fplace: this.fromPlace,
      tplace: this.toPlace,
      issuetime: new Date().toISOString()
    };

    this.http.post<any>('http://localhost:3000/bookticket', payload).subscribe({
      next: (res) => {
        console.log('Ticket booked successfully', res);

        // 🔑 Add place names from local list
        const fromObj = this.places.find(p => p.refid === this.fromPlace);
        const toObj = this.places.find(p => p.refid === this.toPlace);

        this.ticketResponse = {
          ...res,
          fplaceName: fromObj ? fromObj.places : '',
          tplaceName: toObj ? toObj.places : ''
        };

        this.startExpiryCheck(res.issuetime);
      },
      error: (err) => console.error('Booking failed', err)
    });
  }

  startExpiryCheck(issuetime: string) {
    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      const issueDate = new Date(issuetime).getTime();
      const expiryDate = issueDate + (4 * 60 * 60 * 1000);
      const now = new Date().getTime();
      this.isExpired = now > expiryDate;
    }, 1000);
  }


  downloadTicket() {
    const ticketElement = document.getElementById('ticketCard');
    if (ticketElement) {
      html2canvas(ticketElement).then(canvas => {
        const link = document.createElement('a');
        link.download = 'ticket.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  }


}
