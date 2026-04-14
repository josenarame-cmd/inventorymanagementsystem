import { useLocation } from 'react-router-dom';
import { Mail, ShieldCheck, ExternalLink } from 'lucide-react';

const Footer = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/' || location.pathname === '/home';

    return (
        <footer className={`fixed bottom-0 left-0 right-0 border-t ${
            isHomePage 
            ? 'bg-gray-950/40 backdrop-blur-xl border-white/5 text-white' 
            : 'bg-white/80 backdrop-blur-md border-gray-100 text-gray-900 ml-64'
        } py-4 px-8 z-50 transition-all duration-500 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]`}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-5">
                    {isHomePage ? (
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white font-black text-xl border border-white/10 shadow-xl">
                            JN
                        </div>
                    ) : (
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-sm">
                            VB
                        </div>
                    )}
                    <div>
                        <p className={`text-sm font-black uppercase tracking-tight ${isHomePage ? 'text-white' : 'text-gray-900'}`}>Vizion Bot Intelligence</p>
                        <p className={`text-xs font-medium mt-0.5 ${isHomePage ? 'text-gray-400' : 'text-gray-500'}`}>Automated Inventory Ecosystem v4.0</p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
                    {isHomePage && (
                        <div className="flex flex-col items-center md:items-start gap-1">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Lead Developer</span>
                            <a 
                                href="mailto:josenarame@gmail.com" 
                                className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-cyan-400 transition-colors group"
                            >
                                <Mail size={14} className="group-hover:animate-bounce" />
                                josenarame@gmail.com
                                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>
                    )}

                    <div className="flex flex-col items-center md:items-start gap-1">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isHomePage ? 'text-gray-500' : 'text-gray-400'}`}>Security Protocol</span>
                        <div className={`flex items-center gap-2 text-xs font-bold ${isHomePage ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            <ShieldCheck size={14} />
                            AES-256 Cloud Encryption
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isHomePage ? 'text-gray-500' : 'text-gray-400'}`}>Compliance & Region</p>
                    <p className={`text-xs font-bold ${isHomePage ? 'text-gray-400' : 'text-gray-600'}`}>© {new Date().getFullYear()} VIZION BOT • Rwanda HQ</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
