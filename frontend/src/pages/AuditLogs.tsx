import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Shield, Search, Filter, Clock, Activity } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
    id: number;
    username: string;
    action: string;
    entityName: string;
    entityId: number;
    details: string;
    ipAddress: string;
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
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.ipAddress && log.ipAddress.includes(searchTerm))
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-white/20">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white drop-shadow-md">System Audit Logs</h1>
                        <p className="text-blue-200/70 mt-1 uppercase tracking-widest text-[10px] font-bold">Monitor enterprise activities and compliance</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-4 border-b border-white/10 flex gap-4 bg-black/20">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter logs by user, action, details, or IP..."
                            className="pl-10 pr-4 py-2 w-full bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder-gray-500 backdrop-blur-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider font-bold border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">IP Address</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Entity</th>
                                <th className="px-6 py-4">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-8 h-8 bg-white/5 rounded-lg m-2"></td>
                                    </tr>
                                ))
                            ) : filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Clock size={14} className="text-purple-400" />
                                            {format(new Date(log.timestamp), 'MMM dd, HH:mm:ss')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-white bg-blue-500/20 border border-blue-500/30 px-2 py-1 rounded text-xs shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                            {log.username}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-emerald-400 opacity-80">
                                        {log.ipAddress || 'UNKNOWN'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                            log.action === 'CREATE' ? 'bg-green-500/20 text-green-300 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]' :
                                            log.action === 'UPDATE' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]' :
                                            log.action === 'DELETE' ? 'bg-red-500/20 text-red-300 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
                                            'bg-white/10 text-gray-300 border-white/20'
                                        }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 font-medium">
                                        {log.entityName} <span className="text-[10px] text-gray-500 bg-black/50 px-1.5 py-0.5 rounded ml-1">#{log.entityId}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400 italic">
                                        {log.details}
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 font-medium">
                                        No audit records found matching your enterprise search criteria.
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
