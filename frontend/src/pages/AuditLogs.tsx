import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Shield, Search, Filter, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
    id: number;
    username: string;
    action: string;
    entityName: string;
    entityId: number;
    details: string;
    timestamp: string;
}

const AuditLogs = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await api.get('/audit');
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => 
        log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">System Audit Logs</h1>
                    <p className="text-gray-500 mt-1">Monitor all user activities across the enterprise</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter logs by user, action or details..."
                            className="pl-10 pr-4 py-2 w-full bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Entity</th>
                                <th className="px-6 py-4">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8 h-8 bg-gray-50/50 rounded-lg m-2"></td>
                                    </tr>
                                ))
                            ) : filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-gray-900">
                                            <Clock size={14} className="text-gray-400" />
                                            {format(new Date(log.timestamp), 'MMM dd, HH:mm:ss')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">
                                            {log.username}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                                            log.action === 'UPDATE' ? 'bg-orange-100 text-orange-700' :
                                            log.action === 'DELETE' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 font-medium">
                                        {log.entityName} <span className="text-xs text-gray-400">#{log.entityId}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 italic">
                                        {log.details}
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                        No audit records found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
