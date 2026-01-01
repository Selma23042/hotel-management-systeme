import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  providers: [DatePipe, DecimalPipe],
  templateUrl: './invoice-detail.html',
  styleUrls: ['./invoice-detail.scss']
})
export class InvoiceDetail implements OnInit {
  invoice: any = null;
  loading = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadInvoiceDetails(id);
  }

  loadInvoiceDetails(id: string): void {
    this.loading = true;
    // Chargez les détails de la facture
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  downloadPDF(): void {
    console.log('Téléchargement PDF...');
  }
}