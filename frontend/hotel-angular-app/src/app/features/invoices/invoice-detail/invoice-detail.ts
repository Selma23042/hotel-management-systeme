import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Services et modèles
import { InvoiceService } from '../../../core/services/invoice';
import { Invoice } from '../../../core/models/invoice.model';

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
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [DatePipe, DecimalPipe],
  templateUrl: './invoice-detail.html',
  styleUrls: ['./invoice-detail.scss']
})
export class InvoiceDetailComponent implements OnInit {
  invoice?: Invoice;
  loading = true;
  invoiceId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.params['id'];
    this.loadInvoiceDetails();
  }

  loadInvoiceDetails(): void {
    this.loading = true;
    
    this.invoiceService.getInvoiceById(+this.invoiceId).subscribe({
      next: (invoice) => {
        this.invoice = invoice;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement facture:', error);
        this.loading = false;
        this.showMessage('Erreur lors du chargement de la facture');
      }
    });

    // VERSION AVEC DONNÉES DE TEST (à utiliser si le backend n'est pas prêt)
    /*
    setTimeout(() => {
      this.invoice = {
        id: +this.invoiceId,
        invoiceNumber: `INV-2024-${this.invoiceId.padStart(6, '0')}`,
        bookingId: 123,
        customerId: 1,
        roomId: 101,
        checkInDate: new Date('2024-02-15'),
        checkOutDate: new Date('2024-02-20'),
        numberOfNights: 5,
        roomCharges: 500,
        taxAmount: 50,
        totalAmount: 550,
        status: 'PENDING',
        paymentMethod: null,
        paidAt: null,
        createdAt: new Date()
      };
      this.loading = false;
    }, 1000);
    */
  }

  downloadPDF(): void {
    if (!this.invoice) return;

    this.showMessage('Téléchargement du PDF en cours...');
    
    // Implémentation réelle avec le service
    // this.invoiceService.downloadInvoicePDF(this.invoice.id).subscribe({
    //   next: (blob) => {
    //     const url = window.URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = `${this.invoice!.invoiceNumber}.pdf`;
    //     link.click();
    //     window.URL.revokeObjectURL(url);
    //     this.showMessage('PDF téléchargé avec succès');
    //   },
    //   error: (error) => {
    //     console.error('Erreur téléchargement PDF:', error);
    //     this.showMessage('Erreur lors du téléchargement');
    //   }
    // });

    // Version temporaire : simulation
    setTimeout(() => {
      this.showMessage('Fonctionnalité PDF à venir');
    }, 1000);
  }

  printInvoice(): void {
    // Imprimer la section de la facture
    const printContent = document.getElementById('invoice-printable');
    if (!printContent) return;

    const WindowPrt = window.open('', '', 'width=900,height=650');
    if (!WindowPrt) return;

    WindowPrt.document.write(`
      <html>
        <head>
          <title>Facture ${this.invoice?.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .invoice-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .company-info h2 { margin: 0; color: #3f51b5; }
            .invoice-info { text-align: right; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; }
            .text-right { text-align: right; }
            .totals-section { text-align: right; margin-top: 30px; }
            .total-line { display: flex; justify-content: flex-end; padding: 8px 0; }
            .total-line span:first-child { margin-right: 50px; }
            .grand-total { font-size: 1.2em; font-weight: bold; border-top: 2px solid #333; padding-top: 15px; }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    WindowPrt.document.close();
    WindowPrt.focus();
    
    setTimeout(() => {
      WindowPrt.print();
      WindowPrt.close();
    }, 250);
  }

  processPayment(paymentMethod: string): void {
    if (!this.invoice) return;

    if (confirm(`Confirmer le paiement par ${this.getPaymentMethodLabel(paymentMethod)} ?`)) {
      const paymentRequest = {
        paymentMethod: paymentMethod
      };

      this.invoiceService.processPayment(this.invoice.id, paymentRequest).subscribe({
        next: (updatedInvoice) => {
          this.invoice = updatedInvoice;
          this.showMessage('Paiement effectué avec succès !');
        },
        error: (error) => {
          console.error('Erreur paiement:', error);
          this.showMessage('Erreur lors du paiement');
        }
      });
    }
  }

  cancelInvoice(): void {
    if (!this.invoice) return;

    if (confirm('Êtes-vous sûr de vouloir annuler cette facture ?')) {
      this.invoiceService.cancelInvoice(this.invoice.id).subscribe({
        next: (updatedInvoice) => {
          this.invoice = updatedInvoice;
          this.showMessage('Facture annulée');
        },
        error: (error) => {
          console.error('Erreur annulation:', error);
          this.showMessage('Erreur lors de l\'annulation');
        }
      });
    }
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

  getPaymentMethodLabel(method: string | null | undefined): string {
    if (!method) return 'N/A';
    
    const labels: { [key: string]: string } = {
      'CASH': 'Espèces',
      'CREDIT_CARD': 'Carte bancaire',
      'BANK_TRANSFER': 'Virement bancaire',
      'CHECK': 'Chèque'
    };
    return labels[method] || method;
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}