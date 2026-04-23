import React, { useEffect, useState, useMemo, useCallback } from 'react';
import DataTable from '../components/DataTable';
import api from '../services/api';
import { Plus, Package, ArrowDown, Info } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const inputCls = "w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-3.5 outline-none transition-all";
const labelCls = "text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1";

const EMPTY_FORM = {
    name: '', sku: '', description: '',
    purchasePrice: 0, sellingPrice: 0,
    qtyPurchased: 0, qtyManufactured: 0,
    qtySold: 0, qtyUsed: 0,
    reorderLevel: 10, unit: 'pcs',
    itemType: '', category: '', subcategory: ''
};

const Inventory = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { currency, format } = useCurrency();
    const [formData, setFormData] = useState({ ...EMPTY_FORM });
    const [submitting, setSubmitting] = useState(false);

    const fetchProducts = useCallback(async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/products', formData);
            setIsModalOpen(false);
            setFormData({ ...EMPTY_FORM });
            fetchProducts();
        } catch (err) {
            alert('Failed to add product. Check that the SKU is unique.');
        } finally {
            setSubmitting(false);
        }
    };

    const field = (key: keyof typeof EMPTY_FORM, val: string | number) =>
        setFormData(prev => ({ ...prev, [key]: val }));

    const remainingPreview = formData.qtyPurchased + formData.qtyManufactured - formData.qtySold - formData.qtyUsed;

    const columns = useMemo(() => [
        {
            header: 'Item', accessor: 'name',
            render: (val: string, item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
                        {(item.sku || '??').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 text-sm">{val}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                            {[item.itemType, item.category, item.subcategory].filter(Boolean).join(' › ') || 'Uncategorised'}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Remaining QTY', accessor: 'remainingQty',
            render: (v: number, item: any) => {
                const low = v <= (item.reorderLevel ?? 0);
                return (
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${low ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {v ?? 0} {item.unit}
                        </span>
                        {low && <ArrowDown size={13} className="text-red-500 animate-bounce" />}
                    </div>
                );
            }
        },
        {
            header: 'QTY In / Out', accessor: 'qtyPurchased',
            render: (_: any, item: any) => (
                <div className="text-xs space-y-0.5">
                    <div className="text-emerald-600 font-semibold">▲ {(item.qtyPurchased ?? 0) + (item.qtyManufactured ?? 0)} in</div>
                    <div className="text-red-500 font-semibold">▼ {(item.qtySold ?? 0) + (item.qtyUsed ?? 0)} out</div>
                </div>
            )
        },
        { header: 'Reorder Lvl', accessor: 'reorderLevel', render: (v: number, item: any) => <span className="text-sm text-gray-600">{v} {item.unit}</span> },
        { header: 'Buy Price', accessor: 'purchasePrice', render: (v: number) => <span className="font-medium text-blue-700">{format(v)}</span> },
        { header: 'Sell Price', accessor: 'sellingPrice', render: (v: number) => <span className="font-bold text-emerald-700">{format(v)}</span> },
        {
            header: 'Status', accessor: 'id',
            render: (_: any, item: any) => item.remainingQty > 0
                ? <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> In Stock</span>
                : <span className="text-xs font-semibold text-red-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> Out of Stock</span>
        },
    ], [format]);

    return (
        <div className="space-y-6 relative">
            {/* Formula hint bar */}
            <div className="flex items-center gap-2 px-5 py-3 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-700 font-medium">
                <Info size={14} className="shrink-0 text-blue-500" />
                <span><strong>Remaining QTY</strong> = (QTY Purchased + QTY Manufactured) − (QTY Sold + QTY Used)</span>
            </div>

            <DataTable
                title="Inventory Products"
                data={products}
                columns={columns}
                actions={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all"
                    >
                        <Plus size={18} /> Add New Item
                    </button>
                }
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-3xl w-full shadow-2xl max-h-[92vh] overflow-y-auto custom-scrollbar animate-fade-in">
                        <div className="flex items-center gap-3 mb-7">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                                <Package className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">New Inventory Item</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Fields marked * are required</p>
                            </div>
                        </div>

                        <form onSubmit={handleAddProduct} className="space-y-5">
                            {/* Row 1: Name + SKU */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className={labelCls}>Item Name *</label>
                                    <input required type="text" value={formData.name}
                                        onChange={e => field('name', e.target.value)}
                                        className={inputCls} placeholder="e.g. Steel Bolt M8" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelCls}>SKU *</label>
                                    <input required type="text" value={formData.sku}
                                        onChange={e => field('sku', e.target.value)}
                                        className={inputCls} placeholder="e.g. STL-BOLT-M8-01" />
                                </div>
                            </div>

                            {/* Row 2: Item Type / Category / Subcategory */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div className="space-y-1.5">
                                    <label className={labelCls}>Item Type</label>
                                    <input type="text" value={formData.itemType}
                                        onChange={e => field('itemType', e.target.value)}
                                        className={inputCls} placeholder="e.g. Solid, Liquid" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelCls}>Category</label>
                                    <input type="text" value={formData.category}
                                        onChange={e => field('category', e.target.value)}
                                        className={inputCls} placeholder="e.g. Electronics" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelCls}>Subcategory</label>
                                    <input type="text" value={formData.subcategory}
                                        onChange={e => field('subcategory', e.target.value)}
                                        className={inputCls} placeholder="e.g. Mobile" />
                                </div>
                            </div>

                            {/* Row 3: Units + Reorder Level + Prices */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                                <div className="space-y-1.5">
                                    <label className={labelCls}>Units *</label>
                                    <input required type="text" value={formData.unit}
                                        onChange={e => field('unit', e.target.value)}
                                        className={inputCls} placeholder="pcs, kg, L…" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelCls}>Reorder Level *</label>
                                    <input required type="number" min={0} value={formData.reorderLevel}
                                        onChange={e => field('reorderLevel', parseInt(e.target.value) || 0)}
                                        className={inputCls} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest pl-1">Selling Price ({currency.symbol}) *</label>
                                    <input required type="number" step="0.01" min={0} value={formData.sellingPrice}
                                        onChange={e => field('sellingPrice', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-emerald-50/50 border border-emerald-100 text-emerald-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 p-3.5 outline-none font-bold transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-blue-600/70 uppercase tracking-widest pl-1">Purchase Cost ({currency.symbol}) *</label>
                                    <input required type="number" step="0.01" min={0} value={formData.purchasePrice}
                                        onChange={e => field('purchasePrice', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-blue-50/50 border border-blue-100 text-blue-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-3.5 outline-none font-bold transition-all" />
                                </div>
                            </div>

                            {/* Row 4: QTY breakdown */}
                            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 space-y-4">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    Quantity Breakdown — Remaining = (Purchased + Manufactured) − (Sold + Used)
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-blue-500 uppercase tracking-widest pl-1">QTY Purchased</label>
                                        <input type="number" min={0} value={formData.qtyPurchased}
                                            onChange={e => field('qtyPurchased', parseInt(e.target.value) || 0)}
                                            className="w-full bg-white border border-blue-100 text-blue-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 p-3.5 outline-none font-semibold transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-violet-500 uppercase tracking-widest pl-1">QTY Manufactured</label>
                                        <input type="number" min={0} value={formData.qtyManufactured}
                                            onChange={e => field('qtyManufactured', parseInt(e.target.value) || 0)}
                                            className="w-full bg-white border border-violet-100 text-violet-700 rounded-2xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 p-3.5 outline-none font-semibold transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest pl-1">QTY Sold</label>
                                        <input type="number" min={0} value={formData.qtySold}
                                            onChange={e => field('qtySold', parseInt(e.target.value) || 0)}
                                            className="w-full bg-white border border-emerald-100 text-emerald-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 p-3.5 outline-none font-semibold transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-red-500 uppercase tracking-widest pl-1">QTY Used</label>
                                        <input type="number" min={0} value={formData.qtyUsed}
                                            onChange={e => field('qtyUsed', parseInt(e.target.value) || 0)}
                                            className="w-full bg-white border border-red-100 text-red-700 rounded-2xl focus:ring-2 focus:ring-red-500/20 focus:border-red-400 p-3.5 outline-none font-semibold transition-all" />
                                    </div>
                                </div>

                                {/* Live remaining calc preview */}
                                <div className="flex items-center gap-3 pt-1">
                                    <span className="text-xs text-gray-500">Remaining QTY preview:</span>
                                    <span className={`text-sm font-black ${remainingPreview <= formData.reorderLevel ? 'text-red-600' : 'text-emerald-600'}`}>
                                        {remainingPreview} {formData.unit}
                                    </span>
                                    {remainingPreview <= formData.reorderLevel && (
                                        <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Below reorder level</span>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className={labelCls}>Description</label>
                                <textarea value={formData.description}
                                    onChange={e => field('description', e.target.value)}
                                    className={`${inputCls} h-20 resize-none`}
                                    placeholder="Optional product notes..." />
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => { setIsModalOpen(false); setFormData({ ...EMPTY_FORM }); }}
                                    className="flex-1 px-4 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-colors">
                                    Discard
                                </button>
                                <button type="submit" disabled={submitting}
                                    className="flex-1 px-4 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 shadow-xl shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50">
                                    {submitting ? 'Saving...' : 'Add to Inventory'}
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
