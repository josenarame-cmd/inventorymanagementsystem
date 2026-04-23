import { useLocation } from 'react-router-dom';
import { Mail, ShieldCheck, ExternalLink } from 'lucide-react';

const Footer = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/' || location.pathname === '/home';

    return (
        <footer className={`fixed bottom-0 left-0 right-0 border-t bg-black/40 backdrop-blur-xl border-white/10 text-white ml-64 py-2 px-6 z-40 transition-all duration-500 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]`}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-[0_0_10px_rgba(56,189,248,0.5)] border border-white/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity"></div>
                        VB
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-md leading-tight">Vizion Bot Intelligence</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-200/70">Automated Inventory Ecosystem v4.0</p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
                    <div className="flex flex-col items-center md:items-start gap-0.5">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Lead Developer</span>
                        <a 
                            href="mailto:josenarame@gmail.com" 
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-cyan-300 transition-colors group relative"
                        >
                            <Mail size={12} className="group-hover:animate-bounce" />
                            josenarame@gmail.com
                            <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    </div>

                    <div className="flex flex-col items-center md:items-start gap-0.5">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Security Protocol</span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 shadow-emerald-400/20 drop-shadow-md">
                            <ShieldCheck size={12} />
                            AES-256 Cloud Encryption
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 text-gray-500">Compliance & Region</p>
                    <p className="text-[10px] font-bold text-gray-400">© {new Date().getFullYear()} VIZION BOT • Rwanda HQ</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
