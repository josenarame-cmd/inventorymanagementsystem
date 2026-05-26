import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import api from '../services/api';
import { Plus, Truck, Edit2, Trash2 } from 'lucide-react';

import { useCurrency } from '../context/CurrencyContext';
import LocationSelector from '../components/LocationSelector';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', contactPerson: '', email: '', phone: '', address: '' });
    const [countryCode, setCountryCode] = useState('+250');
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const { format } = useCurrency();

    const fetchSuppliers = () => {
        api.get('/suppliers').then(res => setSuppliers(res.data)).catch(console.error);
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        const [code, ...rest] = (item.phone || '').split(' ');
        setCountryCode(code || '+250');
        setFormData({
            name: item.name || '',
            contactPerson: item.contactPerson || '',
            email: item.email || '',
            phone: rest.join(' ') || item.phone || '',
            address: item.address || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this supplier?')) return;
        try {
            await api.delete(`/suppliers/${id}`);
            fetchSuppliers();
        } catch (err) {
            alert('Failed to delete supplier.');
        }
    };

    const handleAddSupplier = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const finalData = { ...formData, phone: `${countryCode} ${formData.phone}` };
            if (editingId) {
                await api.put(`/suppliers/${editingId}`, finalData);
            } else {
                await api.post('/suppliers', finalData);
            }
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '' });
            fetchSuppliers();
        } catch (err) {
            alert('Failed to save supplier');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        { header: 'Supplier Name', accessor: 'name', render: (v: string) => <span className="font-bold text-gray-900">{v}</span> },
        { header: 'Contact Person', accessor: 'contactPerson' },
        { header: 'Phone', accessor: 'phone' },
        { header: 'Balance Payable', accessor: 'balance', render: (v: number) => (
            <span className={`font-bold ${v > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {format(v)}
            </span>
        )},
        { header: 'Total Purchase', accessor: 'totalPurchases', render: (v: number) => format(v) }
    ];

    return (
        <div className="relative">
            <DataTable 
                title="Suppliers Directory" 
                data={suppliers} 
                columns={columns}
                rowActions={(item) => (
                    <div className="flex items-center justify-end gap-2">
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                            <Edit2 size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
                actions={
                    <button 
                        onClick={() => { setEditingId(null); setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '' }); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all"
                    >
                        <Plus size={18} /> Add Supplier
                    </button>
                }
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                                <Plus className="text-blue-600" size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 font-sans">{editingId ? 'Edit Supplier' : 'Onboard New Supplier'}</h3>
                        </div>
                        
                        <form onSubmit={handleAddSupplier} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Company Name *</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-3.5 outline-none transition-all" placeholder="Acme Corp" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Contact Person</label>
                                    <input type="text" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-3.5 outline-none transition-all" placeholder="Jane Smith" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-3.5 outline-none transition-all" placeholder="jane@acme.com" />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Contact Number (International Format)</label>
                                    <div className="flex gap-2">
                                        <div className="bg-gray-100 border border-gray-100 text-gray-500 rounded-2xl p-3.5 font-bold text-sm min-w-[70px] flex items-center justify-center">
                                            {countryCode}
                                        </div>
                                        <input 
                                            type="text" 
                                            value={formData.phone} 
                                            onChange={e => setFormData({...formData, phone: e.target.value})} 
                                            className="flex-1 bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-3.5 outline-none transition-all font-semibold" 
                                            placeholder="7XX XXX XXX" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-2 block">Company Headquarters</label>
                                <LocationSelector 
                                    onLocationChange={(loc) => setFormData({...formData, address: loc})} 
                                    onCountryCodeChange={(code) => setCountryCode(code)}
                                />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => { setIsModalOpen(false); setEditingId(null); setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '' }); }} className="flex-1 px-4 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-colors">Discard</button>
                                <button type="submit" disabled={submitting} className="flex-1 px-4 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 shadow-xl shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50">
                                    {submitting ? 'Authenticating...' : (editingId ? 'Save Changes' : 'Save Supplier Profile')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Suppliers;
