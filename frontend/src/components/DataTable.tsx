import React from 'react';
import { Search, ChevronRight, Filter } from 'lucide-react';

interface Column {
    header: string;
    accessor: string;
    render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps {
    title: string;
    data: any[];
    columns: Column[];
    onRowClick?: (item: any) => void;
    actions?: React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({ title, data = [], columns, onRowClick, actions }) => {
    const defaultData = Array.isArray(data) ? data : [];
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;
    
    // Reset to page 1 if data changes significantly
    React.useEffect(() => {
        setCurrentPage(1);
    }, [defaultData.length]);

    const totalPages = Math.ceil(defaultData.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = defaultData.slice(startIndex, startIndex + itemsPerPage);

    const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
    const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
            <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage and monitor your data in real-time.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search everything..."
                            className="pl-12 pr-6 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none w-full md:w-64 transition-all"
                        />
                    </div>
                    <button className="p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition-colors">
                        <Filter size={18} />
                    </button>
                    {actions}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50">
                            {columns.map((col, i) => (
                                <th key={i} className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    {col.header}
                                </th>
                            ))}
                            <th className="px-8 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {paginatedData.map((item, i) => (
                            <tr 
                                key={i} 
                                onClick={() => onRowClick?.(item)}
                                className="group hover:bg-blue-50/30 transition-colors cursor-pointer"
                            >
                                {columns.map((col, j) => (
                                    <td key={j} className="px-8 py-5 text-sm font-medium text-gray-700">
                                        {col.render ? col.render(item[col.accessor], item) : item[col.accessor]}
                                    </td>
                                ))}
                                <td className="px-8 py-4 text-right">
                                    <ChevronRight className="inline text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" size={20} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {defaultData.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-gray-400">No data available yet.</p>
                </div>
            )}

            <div className="p-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                <p className="text-sm text-gray-500 italic">
                    Showing {defaultData.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, defaultData.length)} of {defaultData.length} entries 
                    (Page {currentPage} of {totalPages})
                </p>
                <div className="flex gap-2">
                    <button 
                        onClick={handlePrev} 
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 shadow-sm disabled:opacity-50 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                        Previous
                    </button>
                    <button 
                        onClick={handleNext} 
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 shadow-sm disabled:opacity-50 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(DataTable);
