import React, { useState, useEffect } from 'react';
import { api } from '../../../api';
import UploadPaymentModal from '../../modals/UploadPaymentModal';
import PaymentReceipt     from '../../PaymentReceipt';

const PaymentInfo = () => {
  const [receipts, setReceipts] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState('all');
  const [serviceType, setServiceType] = useState('both');
  const [amount, setAmount] = useState(120);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data:user }, { data:recs }] = await Promise.all([api.get('/auth/me'), api.get('/receipts')]);
      setServiceType(user.serviceType||'both');
      setAmount(user.serviceType==='pickup'||user.serviceType==='dropoff'?80:120);
      setReceipts(recs);
    })();
  }, []);

  const handleServiceChange = e => {
    const type = e.target.value;
    const amt = type==='both'?120:80;
    api.put('/auth/me',{ serviceType:type });
    setServiceType(type); setAmount(amt);
  };

  const filtered = receipts.filter(r => r.year===year && (month==='all'||r.month===parseInt(month)));
  const handleUpload = newFile => { const form=new FormData(); form.append('file',newFile.file); form.append('year',newFile.year); form.append('month',newFile.month); form.append('type',serviceType); api.post('/receipts',form,{headers:{'Content-Type':'multipart/form-data'}}).then(res=>setReceipts(prev=>[res.data,...prev])); setShowUpload(false); };

  return (
    <div className="info-section">
      <h1>Comprobantes de pago</h1>
      <div className="payment-filters d-flex flex-wrap gap-3">
        <div className="filter-group">
          <label>Tipo de servicio:</label>
          <select className="form-select" value={serviceType} onChange={handleServiceChange}>
            <option value="both">Ida y vuelta</option>
            <option value="pickup">Solo ida</option>
            <option value="dropoff">Solo vuelta</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Monto:</label>
          <input type="text" className="form-control" value={`$${amount}`} readOnly />
        </div>
        <div className="filter-group">
          <label>Año:</label>
          <select className="form-select" value={year} onChange={e=>setYear(parseInt(e.target.value))}><option value={2025}>2025</option><option value={2024}>2024</option></select>
        </div>
        <div className="filter-group">
          <label>Mes:</label>
          <select className="form-select" value={month} onChange={e=>setMonth(e.target.value)}><option value="all">Todos</option>{[...Array(12).keys()].map(i=><option key={i+1} value={i+1}>{['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][i]}</option>)}</select>
        </div>
        <button className="btn btn-success align-self-end" onClick={()=>setShowUpload(true)}><i className="fas fa-upload"></i> Subir comprobante</button>
      </div>
      <div className="receipts-list">
        {filtered.length ? filtered.map(r=>(<PaymentReceipt key={r._id} receipt={r} onViewFile={()=>window.open(r.fileUrl,'_blank')} />)) : <p>No hay comprobantes en esta fecha.</p>}
      </div>
      <UploadPaymentModal show={showUpload} onHide={()=>setShowUpload(false)} onUpload={handleUpload} />
    </div>
  );
};

export default PaymentInfo;