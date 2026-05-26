import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import { Plus, TrendingUp, Calendar, User, X, ShoppingBag, Edit2, Trash2 } from 'lucide-react';

import { useCurrency } from '../context/CurrencyContext';

const Sales = () => {
    const [sales, setSales] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<number | ''>('');
    const [selectedCustomer, setSelectedCustomer] = useState<number | ''>('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const { format } = useCurrency();

    const fetchData = async () => {
        try {
            setError(null);
            const [salesRes, productsRes, customersRes] = await Promise.all([
                api.get('/sales'),
                api.get('/products'),
                api.get('/customers')
            ]);
            setSales(salesRes.data);
            setProducts(productsRes.data);
            setCustomers(customersRes.data);
        } catch (err: any) {
            console.error('Failed to fetch data:', err);
            if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
                setError('⚠️ Cannot connect to the backend server. Please make sure the Spring Boot application is running on port 8086.');
            } else {
                setError(`Failed to load data: ${err.response?.data?.message || err.message}`);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setSelectedCustomer(item.customer?.id || '');
        if (item.items && item.items.length > 0) {
            setSelectedProduct(item.items[0].product?.id || '');
            setQuantity(item.items[0].quantity || 1);
        } else {
            setSelectedProduct('');
            setQuantity(1);
        }
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this sale? This will revert the stock and customer balance.')) return;
        try {
            await api.delete(`/sales/${id}`);
            fetchData();
        } catch (err) {
            alert('Failed to delete sale.');
        }
    };

    const handleCreateSale = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct || !selectedCustomer || quantity < 1) return;

        setLoading(true);
        try {
            const product = products.find(p => p.id === Number(selectedProduct));
            const saleData = {
                customer: { id: selectedCustomer },
                items: [
                    {
                        product: { id: selectedProduct },
                        quantity: quantity,
                        unitPrice: product.sellingPrice
                    }
                ]
            };

            if (editingId) {
                await api.put(`/sales/${editingId}`, saleData);
            } else {
                (saleData as any).orderNumber = `SO-${Date.now()}`;
                await api.post('/sales', saleData);
            }
            setShowModal(false);
            setEditingId(null);
            resetForm();
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to save sale');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedProduct('');
        setSelectedCustomer('');
        setQuantity(1);
    };

    const columns = useMemo(() => [
        { header: 'Invoice ID', accessor: 'id', render: (v: number) => <span className="font-mono font-bold text-emerald-600">INV-{v.toString().padStart(5, '0')}</span> },
        { header: 'Date', accessor: 'orderDate', render: (v: string) => (
            <div className="flex items-center gap-2 text-gray-500">
                <Calendar size={14} />
                {v ? new Date(v).toLocaleDateString() : 'N/A'}
            </div>
        )},
        { header: 'Customer', accessor: 'customer', render: (v: any) => (
            <div className="flex items-center gap-2">
                <User size={14} className="text-gray-400" />
                {v?.name || 'Walk-in'}
            </div>
        )},
        { header: 'Grand Total', accessor: 'grandTotal', render: (v: number) => (
            <span className="font-bold text-gray-900">{format(v)}</span>
        )},
        { header: 'Status', accessor: 'status', render: (v: string) => (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold uppercase">
                {v || 'Paid'}
            </span>
        )}
    ], [format]);

    return (
        <div className="relative">
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                    <span className="text-red-500 text-lg">🔴</span>
                    <div>
                        <p className="text-sm font-bold text-red-700">Connection Error</p>
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                        <button onClick={fetchData} className="mt-2 text-xs font-bold text-red-700 underline hover:no-underline">Retry</button>
                    </div>
                </div>
            )}
            <DataTable 
                title="Sales Invoices" 
                data={sales} 
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
                        onClick={() => { setEditingId(null); resetForm(); setShowModal(true); }}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all active:scale-95"
                    >
                        <Plus size={18} /> Create Sale
                    </button>
                }
            />

            {/* Create Sale Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-emerald-50/30">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                                    <ShoppingBag size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{editingId ? 'Edit Sale Order' : 'New Sale Order'}</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateSale} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700 ml-1">Customer</label>
                                <select 
                                    required
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-gray-900 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium appearance-none"
                                    value={selectedCustomer}
                                    onChange={(e) => setSelectedCustomer(Number(e.target.value))}
                                >
                                    <option value="">Select Customer</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700 ml-1">Product</label>
                                <select 
                                    required
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-gray-900 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium appearance-none"
                                    value={selectedProduct}
                                    onChange={(e) => setSelectedProduct(Number(e.target.value))}
                                >
                                    <option value="">Select Product</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} - {format(p.sellingPrice)} (Stock: {p.remainingQty})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700 ml-1">Quantity</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    required
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-gray-900 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 px-6 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={loading || !selectedProduct || !selectedCustomer}
                                    className="flex-1 py-4 px-6 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                                >
                                    {loading ? 'Processing...' : 'Complete Sale'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sales;
