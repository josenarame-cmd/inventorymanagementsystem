import React, { useEffect, useState, useMemo, useCallback } from 'react';
import DataTable from '../components/DataTable';
import api from '../services/api';
import { Plus, Package, ArrowDown, Info, Activity, History, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { format as formatDate } from 'date-fns';

const inputCls = "w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-3.5 outline-none transition-all";
const labelCls = "text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1";

const EMPTY_FORM = {
    name: '', sku: '', description: '',
    purchasePrice: '', sellingPrice: '',
    qtyPurchased: '', qtyManufactured: '',
    qtySold: '', qtyUsed: '',
    reorderLevel: '', unit: 'pcs',
    itemType: '', category: '', subcategory: ''
};

const Inventory = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { currency, format } = useCurrency();
    const [formData, setFormData] = useState({ ...EMPTY_FORM });
    const [submitting, setSubmitting] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(true);

    const fetchLogs = useCallback(async () => {
        try {
            const res = await api.get('/audit');
            const relevant = res.data.filter((l: any) => 
                ['Product', 'SalesOrder', 'PurchaseOrder'].includes(l.entityName)
            ).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 12);
            setLogs(relevant);
        } catch (e) { console.error(e); } finally { setLoadingLogs(false); }
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
            fetchLogs(); // Also update logs
        } catch (e) { console.error(e); } finally { setLoading(false); }
    }, [fetchLogs]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                purchasePrice: Number(formData.purchasePrice) || 0,
                sellingPrice: Number(formData.sellingPrice) || 0,
                qtyPurchased: Number(formData.qtyPurchased) || 0,
                qtyManufactured: Number(formData.qtyManufactured) || 0,
                qtySold: Number(formData.qtySold) || 0,
                qtyUsed: Number(formData.qtyUsed) || 0,
                reorderLevel: Number(formData.reorderLevel) || 10,
            };
            await api.post('/products', payload);
            setIsModalOpen(false);
            setFormData({ ...EMPTY_FORM });
            fetchProducts();
        } catch (err) {
            alert('Failed to add product. Check that the SKU is unique.');
        } finally {
            setSubmitting(false);
        }
    };

    const field = (key: keyof typeof EMPTY_FORM, val: any) =>
        setFormData(prev => ({ ...prev, [key]: val }));

    const remainingPreview = (Number(formData.qtyPurchased) || 0) + (Number(formData.qtyManufactured) || 0) 
                           - (Number(formData.qtySold) || 0) - (Number(formData.qtyUsed) || 0);

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
        {
            header: 'Last Entry', accessor: 'updatedAt',
            render: (v: string) => v ? (
                <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock size={12} className="text-blue-400" />
                    <span className="text-[11px] font-medium leading-none">
                        {formatDate(new Date(v), 'MMM d, HH:mm')}
                    </span>
                </div>
            ) : <span className="text-gray-300 text-[10px]">Pending...</span>
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
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-3 space-y-6">
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
                </div>

                {/* Real-time Activity Timeline */}
                <div className="xl:col-span-1 space-y-4">
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-fit">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Activity size={18} className="text-blue-600" />
                                </div>
                                <h3 className="font-bold text-gray-900">Live Inventory Flow</h3>
                            </div>
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </div>

                        <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-50">
                            {loadingLogs ? (
                                [1,2,3].map(i => (
                                    <div key={i} className="flex gap-4 animate-pulse">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full shrink-0" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-3 bg-gray-100 rounded w-2/3" />
                                            <div className="h-2 bg-gray-50 rounded w-1/3" />
                                        </div>
                                    </div>
                                ))
                            ) : logs.length > 0 ? (
                                logs.map((log) => (
                                    <div key={log.id} className="flex gap-4 relative group">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110 ${
                                            log.entityName === 'SalesOrder' ? 'bg-red-50 text-red-500' :
                                            log.entityName === 'PurchaseOrder' ? 'bg-emerald-50 text-emerald-500' :
                                            'bg-blue-50 text-blue-500'
                                        }`}>
                                            {log.entityName === 'SalesOrder' ? <TrendingDown size={14} /> :
                                             log.entityName === 'PurchaseOrder' ? <TrendingUp size={14} /> :
                                             <Package size={14} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold text-gray-900 truncate">
                                                {log.action} {log.entityName}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                {log.details}
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-2">
                                                <Clock size={12} className="text-blue-400" />
                                                <span className="text-[11px] font-black text-blue-600 uppercase tracking-tight">
                                                    {(() => {
                                                        try {
                                                            return formatDate(new Date(log.timestamp), 'MMM d, yyyy • HH:mm:ss');
                                                        } catch (e) {
                                                            return 'Recently';
                                                        }
                                                    })()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <History size={32} className="mx-auto text-gray-200 mb-3" />
                                    <p className="text-xs text-gray-400">No movement history</p>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={fetchLogs}
                            className="w-full mt-6 py-2.5 text-[10px] font-bold text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all uppercase tracking-widest"
                        >
                            Refresh Timeline
                        </button>
                    </div>
                </div>
            </div>

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
                                        placeholder="10"
                                        onChange={e => field('reorderLevel', e.target.value)}
                                        className={inputCls} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest pl-1">Selling Price ({currency.symbol}) *</label>
                                    <input required type="number" step="0.01" min={0} value={formData.sellingPrice}
                                        placeholder="0.00"
                                        onChange={e => field('sellingPrice', e.target.value)}
                                        className="w-full bg-emerald-50/50 border border-emerald-100 text-emerald-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 p-3.5 outline-none font-bold transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-blue-600/70 uppercase tracking-widest pl-1">Purchase Cost ({currency.symbol}) *</label>
                                    <input required type="number" step="0.01" min={0} value={formData.purchasePrice}
                                        placeholder="0.00"
                                        onChange={e => field('purchasePrice', e.target.value)}
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
                                            placeholder="0"
                                            onChange={e => field('qtyPurchased', e.target.value)}
                                            className="w-full bg-white border border-blue-100 text-blue-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 p-3.5 outline-none font-semibold transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-violet-500 uppercase tracking-widest pl-1">QTY Manufactured</label>
                                        <input type="number" min={0} value={formData.qtyManufactured}
                                            placeholder="0"
                                            onChange={e => field('qtyManufactured', e.target.value)}
                                            className="w-full bg-white border border-violet-100 text-violet-700 rounded-2xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 p-3.5 outline-none font-semibold transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest pl-1">QTY Sold</label>
                                        <input type="number" min={0} value={formData.qtySold}
                                            placeholder="0"
                                            onChange={e => field('qtySold', e.target.value)}
                                            className="w-full bg-white border border-emerald-100 text-emerald-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 p-3.5 outline-none font-semibold transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-red-500 uppercase tracking-widest pl-1">QTY Used</label>
                                        <input type="number" min={0} value={formData.qtyUsed}
                                            placeholder="0"
                                            onChange={e => field('qtyUsed', e.target.value)}
                                            className="w-full bg-white border border-red-100 text-red-700 rounded-2xl focus:ring-2 focus:ring-red-500/20 focus:border-red-400 p-3.5 outline-none font-semibold transition-all" />
                                    </div>
                                </div>

                                {/* Live remaining calc preview */}
                                <div className="flex items-center gap-3 pt-1">
                                    <span className="text-xs text-gray-500">Remaining QTY preview:</span>
                                    <span className={`text-sm font-black ${remainingPreview <= (Number(formData.reorderLevel) || 0) ? 'text-red-600' : 'text-emerald-600'}`}>
                                        {remainingPreview} {formData.unit}
                                    </span>
                                    {remainingPreview <= (Number(formData.reorderLevel) || 0) && (
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
