import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


export const generateInvoicePDF = (invoice) => {
  try {
    console.log('Starting PDF generation for invoice:', invoice);
    
    const doc = new jsPDF();
    
    // Company/User Info (Top)
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 20, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('FreelanceFlow', 20, 30);
    doc.text('Your Business Name', 20, 35);
    doc.text('your@email.com', 20, 40);
    
    // Invoice Number & Date (Top Right)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Invoice #${invoice.invoiceNumber}`, 140, 20);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 140, 25);
    doc.text(`Due: ${new Date(invoice.dueDate).toLocaleDateString()}`, 140, 30);
    
    // Status Badge
    const statusColors = {
      paid: { bg: [209, 250, 229], text: [6, 95, 70] },
      pending: { bg: [254, 243, 199], text: [146, 64, 14] },
      overdue: { bg: [254, 226, 226], text: [153, 27, 27] }
    };
    
    const color = statusColors[invoice.status];
    doc.setFillColor(...color.bg);
    doc.setTextColor(...color.text);
    doc.rect(140, 35, 30, 7, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.status.toUpperCase(), 155, 40, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    
    // Bill To Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', 20, 55);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.client.name, 20, 62);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.client.email, 20, 67);
    if (invoice.client.phone) {
      doc.text(invoice.client.phone, 20, 72);
    }
    if (invoice.client.address) {
      const addressLines = doc.splitTextToSize(invoice.client.address, 80);
      doc.text(addressLines, 20, invoice.client.phone ? 77 : 72);
    }
    
    // Line Items Table
    console.log('Adding line items table...');
    const tableData = invoice.items.map(item => [
      item.description,
      item.quantity.toString(),
      `${invoice.currency} ${item.rate.toFixed(2)}`,
      `${invoice.currency} ${item.amount.toFixed(2)}`
    ]);
    
    autoTable(doc, {
        startY: 90,
        head: [['Description', 'Qty', 'Rate', 'Amount']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [102, 126, 234],
          fontSize: 10,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 20, halign: 'center' },
          2: { cellWidth: 40, halign: 'right' },
          3: { cellWidth: 40, halign: 'right' }
        }
      })

    
    // Totals Section
    const finalY = doc.lastAutoTable.finalY + 10;
    const totalPaid = invoice.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const amountDue = invoice.total - totalPaid;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Subtotal
    doc.text('Subtotal:', 130, finalY);
    doc.text(`${invoice.currency} ${invoice.total.toFixed(2)}`, 180, finalY, { align: 'right' });
    
    // Paid
    if (totalPaid > 0) {
      doc.setTextColor(16, 185, 129);
      doc.text('Paid:', 130, finalY + 7);
      doc.text(`-${invoice.currency} ${totalPaid.toFixed(2)}`, 180, finalY + 7, { align: 'right' });
      doc.setTextColor(0, 0, 0);
    }
    
    // Amount Due
    doc.setDrawColor(229, 231, 235);
    doc.line(130, finalY + (totalPaid > 0 ? 12 : 5), 180, finalY + (totalPaid > 0 ? 12 : 5));
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Amount Due:', 130, finalY + (totalPaid > 0 ? 20 : 13));
    doc.text(`${invoice.currency} ${amountDue.toFixed(2)}`, 180, finalY + (totalPaid > 0 ? 20 : 13), { align: 'right' });
    
    // Payment History (if any)
    if (invoice.payments && invoice.payments.length > 0) {
      console.log('Adding payment history...');
      const paymentY = finalY + 35;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Payment History', 20, paymentY);
      
      const paymentData = invoice.payments.map(payment => [
        new Date(payment.paidAt).toLocaleDateString(),
        `${payment.currency} ${payment.amount.toFixed(2)}`,
        'Paid'
      ]);

      autoTable(doc, {
        startY: paymentY + 5,
        head: [['Date', 'Amount', 'Status']],
        body: paymentData,
        theme: 'plain',
        headStyles: {
          fillColor: [249, 250, 251],
          textColor: [107, 114, 128],
          fontSize: 9,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 9,
          cellPadding: 4
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 40 },
          2: { cellWidth: 30 }
        }
      })
    }
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    doc.text('Thank you for your business!', 105, pageHeight - 20, { align: 'center' });
    doc.text('Generated by FreelanceFlow', 105, pageHeight - 15, { align: 'center' });
    
    // Save the PDF
    console.log('Saving PDF...');
    doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
    console.log('PDF saved successfully!');
    
  } catch (error) {
    console.error('ERROR generating PDF:', error);
    alert('Failed to generate PDF: ' + error.message);
  }
};