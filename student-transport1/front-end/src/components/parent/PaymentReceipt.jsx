import React from 'react';

const PaymentReceipt = ({ receipt, onViewFile }) => {
  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  return (
    <div className="receipt-card">
      <div className="receipt-info">
        <i className={`fas ${receipt.fileUrl.endsWith('.pdf') ? 'fa-file-pdf' : 'fa-file-image'}`}></i>
        <div>
          <h4>Pago {months[receipt.month-1]} {receipt.year}</h4>
          <p>Tipo: {receipt.type==='both'?'Ida y vuelta':receipt.type==='pickup'?'Solo ida':'Solo vuelta'}</p>
          <p>Monto: ${receipt.amount}</p>
          <button className="btn-view-file" onClick={onViewFile}><i className="fas fa-eye"></i> Ver comprobante</button>
        </div>
      </div>
      <div className={`receipt-status status-${receipt.status}`}>{receipt.status === 'approved' ? 'Aprobado' : receipt.status === 'pending' ? 'Pendiente' : 'Rechazado'}</div>
    </div>
  );
};

export default PaymentReceipt;