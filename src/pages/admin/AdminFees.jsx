import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card, CardContent, CardHeader, Button, Badge, Input, Modal, Select } from '../../components/ui';
import { Plus, DollarSign, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';
import './AdminFees.css';

export const AdminFees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [form, setForm] = useState({ studentId: '', totalAmount: '', dueDate: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    const f = await api.getFees();
    const s = await api.getStudents();
    setFees(f);
    setStudents(s);
  };

  useEffect(() => { fetchAll(); }, []);

  const getStudentName = (userId) => students.find(s => s.userId === userId)?.name || userId;

  const totalCollected = fees.reduce((s, f) => s + f.paidAmount, 0);
  const totalDue = fees.reduce((s, f) => s + (f.totalAmount - f.paidAmount), 0);
  const totalBilled = fees.reduce((s, f) => s + f.totalAmount, 0);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createFeeRecord(form);
      await fetchAll();
      setIsAddOpen(false);
      setForm({ studentId: '', totalAmount: '', dueDate: '' });
    } finally { setLoading(false); }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createFeePayment(selectedFee.studentId, payAmount);
      await fetchAll();
      setIsPayOpen(false);
      setMsg(`✅ Payment of ₹${payAmount} recorded!`);
      setTimeout(() => setMsg(''), 3000);
    } finally { setLoading(false); }
  };

  const openPay = (fee) => {
    setSelectedFee(fee);
    setPayAmount('');
    setIsPayOpen(true);
  };

  return (
    <div className="admin-fees-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fee Management</h1>
          <p className="page-subtitle">Track student fee plans, payments, and dues.</p>
        </div>
        <Button size="lg" onClick={() => setIsAddOpen(true)}>
          <Plus size={18} style={{ marginRight: 8 }} /> Add Fee Plan
        </Button>
      </div>

      {msg && <div className="form-success">{msg}</div>}

      {/* KPI */}
      <div className="stats-grid">
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div><p className="stat-label">Total Billed</p><h3 className="stat-value">₹{totalBilled.toLocaleString()}</h3></div>
            <div className="stat-icon bg-blue"><DollarSign size={24} /></div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div><p className="stat-label">Collected</p><h3 className="stat-value">₹{totalCollected.toLocaleString()}</h3></div>
            <div className="stat-icon bg-green"><TrendingUp size={24} /></div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div><p className="stat-label">Outstanding</p><h3 className="stat-value">₹{totalDue.toLocaleString()}</h3></div>
            <div className="stat-icon bg-orange"><AlertCircle size={24} /></div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Table */}
      <Card>
        <div className="table-responsive">
          <table className="ui-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {fees.map(fee => {
                const due = fee.totalAmount - fee.paidAmount;
                return (
                  <tr key={fee.id}>
                    <td>
                      <div className="user-info">
                        <div className="avatar-sm">{getStudentName(fee.studentId).charAt(0)}</div>
                        <span>{getStudentName(fee.studentId)}</span>
                      </div>
                    </td>
                    <td>₹{fee.totalAmount.toLocaleString()}</td>
                    <td className="text-success">₹{fee.paidAmount.toLocaleString()}</td>
                    <td className={due > 0 ? 'text-danger' : 'text-success'}>₹{due.toLocaleString()}</td>
                    <td>{fee.dueDate}</td>
                    <td>
                      <Badge variant={fee.status === 'Paid' ? 'success' : fee.status === 'Partial' ? 'warning' : 'danger'}>
                        {fee.status}
                      </Badge>
                    </td>
                    <td>
                      {fee.status !== 'Paid' && (
                        <Button size="md" onClick={() => openPay(fee)}>
                          <CreditCard size={14} style={{ marginRight: 6 }} /> Record Payment
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {fees.length === 0 && <div className="empty-state">No fee records yet.</div>}
        </div>
      </Card>

      {/* Payment History */}
      {fees.some(f => f.history?.length > 0) && (
        <Card>
          <CardHeader title="Payment History" subtitle="All receipts" />
          <CardContent>
            <div className="table-responsive">
              <table className="ui-table">
                <thead>
                  <tr><th>Receipt</th><th>Student</th><th>Amount</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {fees.flatMap(f => (f.history || []).map(h => ({
                    ...h, studentName: getStudentName(f.studentId)
                  }))).sort((a, b) => new Date(b.date) - new Date(a.date)).map((h, i) => (
                    <tr key={i}>
                      <td><code>{h.receipt}</code></td>
                      <td>{h.studentName}</td>
                      <td className="text-success">₹{Number(h.amount).toLocaleString()}</td>
                      <td>{new Date(h.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Fee Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create Fee Plan">
        <form onSubmit={handleCreate} className="complex-form">
          <Select label="Student" name="studentId" value={form.studentId}
            onChange={e => setForm(p => ({ ...p, studentId: e.target.value }))} required
            options={students.map(s => ({ value: s.userId, label: s.name }))} />
          <Input label="Total Amount (₹)" type="number" value={form.totalAmount}
            onChange={e => setForm(p => ({ ...p, totalAmount: e.target.value }))} required />
          <Input label="Due Date" type="date" value={form.dueDate}
            onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} required />
          <div className="form-actions">
            <Button variant="secondary" type="button" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={loading}>Create Plan</Button>
          </div>
        </form>
      </Modal>

      {/* Record Payment Modal */}
      <Modal isOpen={isPayOpen} onClose={() => setIsPayOpen(false)} title={`Record Payment — ${selectedFee ? getStudentName(selectedFee.studentId) : ''}`}>
        <form onSubmit={handlePayment} className="complex-form">
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Outstanding: <strong>₹{selectedFee ? (selectedFee.totalAmount - selectedFee.paidAmount).toLocaleString() : 0}</strong>
          </p>
          <Input label="Payment Amount (₹)" type="number" value={payAmount}
            onChange={e => setPayAmount(e.target.value)} required />
          <div className="form-actions">
            <Button variant="secondary" type="button" onClick={() => setIsPayOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={loading}>Record Payment</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
