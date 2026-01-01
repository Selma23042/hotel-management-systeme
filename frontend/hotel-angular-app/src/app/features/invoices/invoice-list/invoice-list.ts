import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Services et modèles
import { InvoiceService } from '../../../core/services/invoice';
import { Invoice } from '../../../core/models/invoice.model';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [DatePipe, DecimalPipe],
  templateUrl: './invoice-list.html',
  styleUrls: ['./invoice-list.scss']
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  loading = true;
  selectedStatus: string = 'ALL';

  displayedColumns: string[] = ['invoiceNumber', 'bookingId', 'dates', 'amount', 'status', 'actions'];

  constructor(
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    this.invoiceService.getAllInvoices().subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showMessage('Erreur lors du chargement des factures');
      }
    });
  }

  applyFilter(): void {
    if (this.selectedStatus === 'ALL') {
      this.filteredInvoices = this.invoices;
    } else {
      this.filteredInvoices = this.invoices.filter(
        invoice => invoice.status === this.selectedStatus
      );
    }
  }

  onStatusChange(): void {
    this.applyFilter();
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'PENDING': 'En attente',
      'PAID': 'Payée',
      'CANCELLED': 'Annulée',
      'OVERDUE': 'En retard'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'PENDING': 'status-warn',
      'PAID': 'status-success',
      'CANCELLED': 'status-error',
      'OVERDUE': 'status-warn'
    };
    return colors[status] || 'status-primary';
  }

  downloadInvoice(invoice: Invoice): void {
    this.showMessage('Téléchargement de la facture...');
    // Implémentation du téléchargement PDF à venir
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}