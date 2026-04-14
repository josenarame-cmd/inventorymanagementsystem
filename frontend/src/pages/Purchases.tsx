import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import { Plus, ShoppingCart, Calendar, X, Package } from 'lucide-react';

import { useCurrency } from '../context/CurrencyContext';

const Purchases = () => {
    const [purchases, setPurchases] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<number | ''>('');
    const [selectedSupplier, setSelectedSupplier] = useState<number | ''>('');
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currency, format } = useCurrency();

    const fetchData = async () => {
        try {
            setError(null);
            const [purchasesRes, productsRes, suppliersRes] = await Promise.all([
                api.get('/purchases'),
                api.get('/products'),
                api.get('/suppliers')
            ]);
            setPurchases(purchasesRes.data);
            setProducts(productsRes.data);
            setSuppliers(suppliersRes.data);
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

    const handleCreatePurchase = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct || !selectedSupplier || quantity < 1) return;

        setLoading(true);
        try {
            const newPurchase = {
                orderNumber: `PO-${Date.now()}`,
                supplier: { id: selectedSupplier },
                items: [
                    {
                        product: { id: selectedProduct },
                        quantity: quantity,
                        unitPrice: unitPrice
                    }
                ]
            };

            await api.post('/purchases', newPurchase);
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to create purchase');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedProduct('');
        setSelectedSupplier('');
        setQuantity(1);
        setUnitPrice(0);
    };

    const columns = useMemo(() => [
        { header: 'Order ID', accessor: 'id', render: (v: number) => <span className="font-mono font-bold text-blue-600">PO-{v.toString().padStart(5, '0')}</span> },
        { header: 'Date', accessor: 'orderDate', render: (v: string) => (
            <div className="flex items-center gap-2 text-gray-500">
                <Calendar size={14} />
                {v ? new Date(v).toLocaleDateString() : 'N/A'}
            </div>
        )},
        { header: 'Supplier', accessor: 'supplier', render: (v: any) => v?.name || 'Unknown' },
        { header: 'Total Amount', accessor: 'grandTotal', render: (v: number) => (
            <span className="font-bold text-gray-900">{format(v)}</span>
        )},
        { header: 'Status', accessor: 'status', render: (v: string) => (
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase">
                {v || 'Completed'}
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
                title="Purchase Orders" 
                data={purchases} 
                columns={columns}
                actions={
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all active:scale-95"
                    >
                        <Plus size={18} /> New Purchase
                    </button>
                }
            />

            {/* New Purchase Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-blue-50/30">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                                    <Package size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">New Purchase Order</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreatePurchase} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700 ml-1">Supplier</label>
                                <select 
                                    required
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-gray-900 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium appearance-none"
                                    value={selectedSupplier}
                                    onChange={(e) => setSelectedSupplier(Number(e.target.value))}
                                >
                                    <option value="">Select Supplier</option>
                                    {suppliers.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700 ml-1">Product</label>
                                <select 
                                    required
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-gray-900 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium appearance-none"
                                    value={selectedProduct}
                                    onChange={(e) => {
                                        const id = Number(e.target.value);
                                        setSelectedProduct(id);
                                        const p = products.find(prod => prod.id === id);
                                        if (p) setUnitPrice(p.purchasePrice);
                                    }}
                                >
                                    <option value="">Select Product</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} (Stock: {p.remainingQty})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-gray-700 ml-1">Quantity</label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        required
                                        className="w-full p-4 bg-gray-50 border-none rounded-2xl text-gray-900 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-gray-700 ml-1">Unit Price ({currency.symbol})</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        required
                                        className="w-full p-4 bg-gray-50 border-none rounded-2xl text-gray-900 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                                        value={unitPrice}
                                        onChange={(e) => setUnitPrice(Number(e.target.value))}
                                    />
                                </div>
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
                                    disabled={loading || !selectedProduct || !selectedSupplier}
                                    className="flex-1 py-4 px-6 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                                >
                                    {loading ? 'Processing...' : 'Place Order'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Purchases;
