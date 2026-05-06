import React, { useState, useEffect, useRef } from 'react';

const HEALTH_URL = '/api/v1/public/health';
const POLL_INTERVAL = 5000; // 5 seconds between retries
const MAX_ATTEMPTS = 60;    // Give up after 5 minutes

interface ServerWakeUpProps {
    children: React.ReactNode;
}

const ServerWakeUp: React.FC<ServerWakeUpProps> = ({ children }) => {
    const [serverReady, setServerReady] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [failed, setFailed] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Initializing connection...');
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        let cancelled = false;

        const checkHealth = async () => {
            try {
                const response = await fetch(HEALTH_URL, {
                    method: 'GET',
                    cache: 'no-store',
                    signal: AbortSignal.timeout(10000), // 10s timeout per attempt
                });

                if (response.ok && !cancelled) {
                    setServerReady(true);
                    setStatusMessage('System online');
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            } catch {
                if (!cancelled) {
                    setAttempts((prev) => {
                        const next = prev + 1;
                        if (next >= MAX_ATTEMPTS) {
                            setFailed(true);
                            setStatusMessage('Server unreachable. Please try again later.');
                            if (intervalRef.current) clearInterval(intervalRef.current);
                        } else if (next < 3) {
                            setStatusMessage('Waking up server...');
                        } else if (next < 8) {
                            setStatusMessage('Server is starting up — this may take a moment...');
                        } else if (next < 15) {
                            setStatusMessage('Almost there — loading application modules...');
                        } else {
                            setStatusMessage('Still loading — please hang tight...');
                        }
                        return next;
                    });
                }
            }
        };

        // First check immediately
        checkHealth();

        // Then poll at interval
        intervalRef.current = setInterval(checkHealth, POLL_INTERVAL);

        return () => {
            cancelled = true;
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Once server is ready, render the app
    if (serverReady) {
        return <>{children}</>;
    }

    // Progress percentage (visual only, not exact)
    const progress = Math.min(95, (attempts / 12) * 95);

    return (
        <div className="wakeup-screen">
            {/* Animated background */}
            <div className="wakeup-bg">
                <div className="wakeup-orb wakeup-orb-1" />
                <div className="wakeup-orb wakeup-orb-2" />
                <div className="wakeup-orb wakeup-orb-3" />
            </div>

            {/* Grid overlay */}
            <div className="wakeup-grid" />

            {/* Content */}
            <div className="wakeup-content">
                {/* Logo */}
                <div className="wakeup-logo-container">
                    <div className="wakeup-logo-glow" />
                    <img
                        src="/logo.png"
                        alt="VIZION BOT"
                        className="wakeup-logo"
                    />
                </div>

                {/* Title */}
                <h1 className="wakeup-title">VIZION BOT</h1>
                <p className="wakeup-subtitle">Inventory Intelligence Platform</p>

                {/* Spinner / Status */}
                {!failed ? (
                    <div className="wakeup-status-area">
                        {/* Animated ring spinner */}
                        <div className="wakeup-spinner">
                            <svg viewBox="0 0 50 50" className="wakeup-spinner-svg">
                                <circle
                                    cx="25" cy="25" r="20"
                                    fill="none"
                                    stroke="rgba(56,189,248,0.15)"
                                    strokeWidth="3"
                                />
                                <circle
                                    cx="25" cy="25" r="20"
                                    fill="none"
                                    stroke="url(#spinnerGradient)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeDasharray="80 45"
                                    className="wakeup-spinner-arc"
                                />
                                <defs>
                                    <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        {/* Progress bar */}
                        <div className="wakeup-progress-track">
                            <div
                                className="wakeup-progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {/* Status message */}
                        <p className="wakeup-message">{statusMessage}</p>
                        <p className="wakeup-hint">
                            Free-tier servers sleep after inactivity — cold starts take 30-60 seconds
                        </p>
                    </div>
                ) : (
                    <div className="wakeup-error-area">
                        <div className="wakeup-error-icon">⚠</div>
                        <p className="wakeup-error-title">Connection Failed</p>
                        <p className="wakeup-error-message">{statusMessage}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="wakeup-retry-btn"
                        >
                            Retry Connection
                        </button>
                    </div>
                )}

                {/* Bottom badge */}
                <div className="wakeup-footer-badge">
                    <span className="wakeup-dot" />
                    <span>{failed ? 'Offline' : 'Connecting to server'}</span>
                </div>
            </div>

            {/* Inline styles — self-contained, no external CSS needed */}
            <style>{`
                .wakeup-screen {
                    position: fixed;
                    inset: 0;
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #030712;
                    overflow: hidden;
                    font-family: 'Outfit', 'Inter', system-ui, sans-serif;
                }

                .wakeup-bg {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                }

                .wakeup-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(120px);
                    animation: wakeup-float 8s ease-in-out infinite;
                }

                .wakeup-orb-1 {
                    width: 500px; height: 500px;
                    background: rgba(59, 130, 246, 0.15);
                    top: -10%; left: 20%;
                    animation-delay: 0s;
                }

                .wakeup-orb-2 {
                    width: 400px; height: 400px;
                    background: rgba(139, 92, 246, 0.1);
                    bottom: -10%; right: 10%;
                    animation-delay: 2s;
                }

                .wakeup-orb-3 {
                    width: 300px; height: 300px;
                    background: rgba(6, 182, 212, 0.08);
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    animation-delay: 4s;
                }

                @keyframes wakeup-float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-30px) scale(1.05); }
                }

                .wakeup-grid {
                    position: absolute;
                    inset: 0;
                    opacity: 0.03;
                    background-image:
                        linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px);
                    background-size: 60px 60px;
                }

                .wakeup-content {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 2rem;
                    animation: wakeup-fade-in 0.8s ease-out;
                }

                @keyframes wakeup-fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .wakeup-logo-container {
                    position: relative;
                    margin-bottom: 1.5rem;
                }

                .wakeup-logo-glow {
                    position: absolute;
                    inset: -40px;
                    background: radial-gradient(circle, rgba(56,189,248,0.3) 0%, transparent 70%);
                    border-radius: 50%;
                    animation: wakeup-pulse 3s ease-in-out infinite;
                }

                @keyframes wakeup-pulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.15); }
                }

                .wakeup-logo {
                    position: relative;
                    height: 120px;
                    object-fit: contain;
                    mix-blend-mode: screen;
                    filter: brightness(2) contrast(1.25) drop-shadow(0 0 40px rgba(56,189,248,0.6));
                }

                .wakeup-title {
                    font-size: 2rem;
                    font-weight: 900;
                    letter-spacing: 0.2em;
                    color: white;
                    margin: 0 0 0.25rem;
                    text-transform: uppercase;
                }

                .wakeup-subtitle {
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.25em;
                    text-transform: uppercase;
                    color: rgba(56,189,248,0.7);
                    margin: 0 0 2.5rem;
                }

                .wakeup-status-area {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.25rem;
                    width: 100%;
                    max-width: 320px;
                }

                .wakeup-spinner {
                    width: 48px;
                    height: 48px;
                }

                .wakeup-spinner-svg {
                    width: 100%;
                    height: 100%;
                }

                .wakeup-spinner-arc {
                    transform-origin: center;
                    animation: wakeup-spin 1.2s linear infinite;
                }

                @keyframes wakeup-spin {
                    100% { transform: rotate(360deg); }
                }

                .wakeup-progress-track {
                    width: 100%;
                    height: 3px;
                    background: rgba(255,255,255,0.06);
                    border-radius: 999px;
                    overflow: hidden;
                }

                .wakeup-progress-fill {
                    height: 100%;
                    border-radius: 999px;
                    background: linear-gradient(90deg, #3b82f6, #06b6d4);
                    transition: width 1s ease-out;
                    box-shadow: 0 0 12px rgba(56,189,248,0.4);
                }

                .wakeup-message {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.8);
                    margin: 0;
                    animation: wakeup-text-pulse 2s ease-in-out infinite;
                }

                @keyframes wakeup-text-pulse {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 1; }
                }

                .wakeup-hint {
                    font-size: 0.65rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.25);
                    margin: 0;
                    max-width: 280px;
                    line-height: 1.5;
                }

                .wakeup-error-area {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                }

                .wakeup-error-icon {
                    font-size: 2.5rem;
                    line-height: 1;
                }

                .wakeup-error-title {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #f87171;
                    margin: 0;
                }

                .wakeup-error-message {
                    font-size: 0.8rem;
                    color: rgba(255,255,255,0.5);
                    margin: 0;
                }

                .wakeup-retry-btn {
                    margin-top: 0.75rem;
                    padding: 0.75rem 2rem;
                    background: linear-gradient(135deg, #3b82f6, #06b6d4);
                    color: white;
                    font-weight: 700;
                    font-size: 0.85rem;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 20px rgba(59,130,246,0.3);
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                }

                .wakeup-retry-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(59,130,246,0.5);
                }

                .wakeup-retry-btn:active {
                    transform: scale(0.97);
                }

                .wakeup-footer-badge {
                    position: fixed;
                    bottom: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1.25rem;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 999px;
                    font-size: 0.65rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.35);
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                }

                .wakeup-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #22c55e;
                    animation: wakeup-blink 1.5s ease-in-out infinite;
                }

                @keyframes wakeup-blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            `}</style>
        </div>
    );
};

export default ServerWakeUp;
