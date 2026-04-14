import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import api from '../services/api';
import { Plus, Package, ArrowDown, ArrowUp } from 'lucide-react';

import { useCurrency } from '../context/CurrencyContext';

const Inventory = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { currency, format } = useCurrency();
    const [formData, setFormData] = useState({ 
        name: '', 
        sku: '', 
        description: '', 
        purchasePrice: 0, 
        sellingPrice: 0, 
        qtyPurchased: 0, 
        qtyManufactured: 0,
        qtySold: 0,
        qtyUsed: 0,
        reorderLevel: 0, 
        unit: 'pcs',
        itemType: '',
        category: '',
        subcategory: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/products', formData);
            setIsModalOpen(false);
            setFormData({ 
                name: '', 
                sku: '', 
                description: '', 
                purchasePrice: 0, 
                sellingPrice: 0, 
                qtyPurchased: 0, 
                qtyManufactured: 0,
                qtySold: 0,
                qtyUsed: 0,
                reorderLevel: 0, 
                unit: 'pcs',
                itemType: '',
                category: '',
                subcategory: ''
            });
            fetchProducts();
        } catch (err) {
            alert('Failed to add product');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        { header: 'Product', accessor: 'name', render: (val: string, item: any) => (
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
                    {item.sku.substring(0, 2)}
                </div>
                <div>
                    <div className="font-bold text-gray-900">{val}</div>
                    <div className="text-xs text-gray-400">{item.itemType || 'No Type'} | {item.category || 'No Category'}</div>
                </div>
            </div>
        )},
        { header: 'Remaining QTY', accessor: 'remainingQty', render: (v: number, item: any) => (
            <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    v <= item.reorderLevel ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                    {v} {item.unit}
                </span>
                {v <= item.reorderLevel && <ArrowDown size={14} className="text-red-500 animate-bounce" />}
            </div>
        )},
        { header: 'Purchase Price', accessor: 'purchasePrice', render: (v: number) => format(v) },
        { header: 'Selling Price', accessor: 'sellingPrice', render: (v: number) => format(v) },
        { header: 'Status', accessor: 'id', render: (_:any, item: any) => (
            item.remainingQty > 0 
            ? <span className="text-xs font-medium text-emerald-500 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> In Stock</span>
            : <span className="text-xs font-medium text-red-500 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Out of Stock</span>
        )}
    ];

    return (
        <div className="space-y-6 relative">
            <DataTable 
                title="Inventory Products" 
                data={products} 
                columns={columns}
                actions={
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all"
                    >
                        <Plus size={18} /> Add Product
                    </button>
                }
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-fade-in">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                                <Plus className="text-blue-600" size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 font-sans">New Inventory Item</h3>
                        </div>

                        <form onSubmit={handleAddProduct} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Item Name *</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-3.5 outline-none transition-all" placeholder="Widget Pro" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">SKU *</label>
                                    <input required type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-3.5 outline-none transition-all" placeholder="WDG-PRO-01" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Item Type</label>
                                    <select value={formData.itemType} onChange={e => setFormData({...formData, itemType: e.target.value})} className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-3.5 outline-none transition-all">
                                        <option value="">Select Type...</option>
                                        <option value="Solid">Solid</option>
                                        <option value="Liquid">Liquid</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-3.5 outline-none transition-all">
                                        <option value="">Select Category...</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Furniture">Furniture</option>
                                        <option value="Supplies">Supplies</option>
                                        <option value="Raw Materials">Raw Materials</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Subcategory</label>
                                    <select value={formData.subcategory} onChange={e => setFormData({...formData, subcategory: e.target.value})} className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-3.5 outline-none transition-all">
                                        <option value="">Select Subcategory...</option>
                                        <option value="Mobile">Mobile</option>
                                        <option value="Laptops">Laptops</option>
                                        <option value="Desktops">Desktops</option>
                                        <option value="Seats">Seats</option>
                                        <option value="Metals">Metals</option>
                                        <option value="Chemicals">Chemicals</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Units</label>
                                    <input required type="text" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-3.5 outline-none transition-all" placeholder="pcs, kg, etc." />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Reorder Level</label>
                                    <input required type="number" value={formData.reorderLevel} onChange={e => setFormData({...formData, reorderLevel: parseInt(e.target.value)})} className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-3.5 outline-none transition-all" />
                                </div>
                                <div className="space-y-1.5 text-emerald-600">
                                    <label className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest pl-1">Selling Price ({currency.symbol})</label>
                                    <input required type="number" step="0.01" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: parseFloat(e.target.value)})} className="w-full bg-emerald-50/50 border border-emerald-100 text-emerald-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 p-3.5 outline-none font-bold transition-all" />
                                </div>
                                <div className="space-y-1.5 text-blue-600">
                                    <label className="text-[10px] font-bold text-blue-600/60 uppercase tracking-widest pl-1">Purchase Cost ({currency.symbol})</label>
                                    <input required type="number" step="0.01" value={formData.purchasePrice} onChange={e => setFormData({...formData, purchasePrice: parseFloat(e.target.value)})} className="w-full bg-blue-50/50 border border-blue-100 text-blue-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-3.5 outline-none font-bold transition-all" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-3.5 outline-none h-24 resize-none transition-all" placeholder="Product details..."></textarea>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-colors">Discard</button>
                                <button type="submit" disabled={submitting} className="flex-1 px-4 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 shadow-xl shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50">
                                    {submitting ? 'Registering...' : 'Add to Inventory'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
