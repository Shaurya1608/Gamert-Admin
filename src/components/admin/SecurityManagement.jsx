import { useState, useEffect } from 'react';
import { 
  Shield, 
  Smartphone, 
  Trash2, 
  Clock, 
  MapPin, 
  LogOut, 
  AlertTriangle,
  Server,
  Fingerprint,
  Activity,
  Globe,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const SecurityManagement = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('mfa');
  const [loading, setLoading] = useState(false);

  // MFA State
  const [mfaStatus, setMfaStatus] = useState(false);
  const [setupStep, setSetupStep] = useState(0); // 0: init, 1: showing QR, 2: success
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');

  // Sessions State
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSecurityStatus();
    if (activeTab === 'sessions') fetchSessions();
  }, [activeTab]);

  const fetchSecurityStatus = async () => {
    try {
      const res = await api.get('/auth/me'); // Or a dedicated security status endpoint if created
      if (res.data.success) {
        setMfaStatus(res.data.user.mfaEnabled);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/sessions'); // Assuming session routes are mounted at /auth
      if (res.data.success) {
        setSessions(res.data.sessions);
      }
    } catch (err) {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  // --- MFA HANDLERS ---
  const startMfaSetup = async () => {
    try {
      setLoading(true);
      const res = await api.post('/auth/mfa/setup');
      if (res.data.success) {
        setQrCode(res.data.qrCode);
        setSecret(res.data.secret);
        setSetupStep(1);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyMfaSetup = async () => {
    try {
      setLoading(true);
      const res = await api.post('/auth/mfa/verify-setup', { token: verifyCode, secret });
      if (res.data.success) {
        setMfaStatus(true);
        updateUser({ mfaEnabled: true });
        setSetupStep(2);
        toast.success('MFA Enabled Successfully');
        setTimeout(() => setSetupStep(0), 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const disableMfa = async () => {
    try {
      setLoading(true);
      const payload = mfaStatus && !disablePassword ? { token: verifyCode } : { password: disablePassword };
      
      if (!payload.token && !payload.password) {
          toast.error('Identity verification required');
          return;
      }

      const res = await api.post('/auth/mfa/disable', payload);
      if (res.data.success) {
        setMfaStatus(false);
        updateUser({ mfaEnabled: false });
        setDisablePassword('');
        setVerifyCode('');
        toast.success('MFA Disabled');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to disable MFA');
    } finally {
      setLoading(false);
    }
  };

  // --- SESSION HANDLERS ---
  const revokeSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to revoke this session?')) return;
    try {
      await api.delete(`/auth/sessions/${sessionId}`);
      setSessions(prev => prev.filter(s => s._id !== sessionId));
      toast.success('Session revoked');
    } catch (err) {
      toast.error('Failed to revoke session');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-500" />
            Security Center
          </h2>
          <p className="text-gray-400">Manage account security and active sessions.</p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex p-1 bg-black/40 backdrop-blur-md rounded-2xl w-fit border border-white/5">
        <LayoutGroup id="security-tabs">
          {[
            { id: 'mfa', label: 'Shield Protection', icon: Shield },
            { id: 'sessions', label: 'Identity Pulse', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2
                ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}
              `}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-400' : 'text-current'}`} />
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </LayoutGroup>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'mfa' ? (
          <motion.div 
            key="mfa"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-6 max-w-2xl"
          >
            <div className={`relative group p-[1px] rounded-2xl transition-all duration-500 ${mfaStatus ? 'bg-gradient-to-br from-green-500/20 via-green-500/40 to-emerald-500/20 shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)]' : 'bg-gradient-to-br from-blue-500/20 via-blue-500/40 to-indigo-500/20'}`}>
                <div className="bg-[#0f1117] backdrop-blur-xl rounded-2xl p-6 relative overflow-hidden">
                    {/* Background Decorative Element */}
                    <div className={`absolute -top-12 -right-12 w-32 h-32 blur-3xl rounded-full transition-opacity duration-500 ${mfaStatus ? 'bg-green-500/10' : 'bg-blue-500/10'}`} />
                    
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <ShieldCheck className={`w-6 h-6 ${mfaStatus ? 'text-green-400' : 'text-blue-400'}`} />
                                Authenticator App
                            </h3>
                            <p className="text-gray-400 text-sm max-w-md">
                                Secure your account using industry-standard TOTP verification.
                            </p>
                        </div>
                        {mfaStatus && (
                            <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-500/20 flex items-center gap-1.5 animate-pulse">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                                Secured
                            </div>
                        )}
                    </div>

                    {mfaStatus ? (
                        <div className="space-y-6">
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                        <Smartphone className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white text-sm font-semibold">Active Protection</h4>
                                        <p className="text-xs text-gray-500">Your Identity Pulse is active and guarding sensitive actions.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <h4 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                                    Disable Protection
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex flex-col md:flex-row gap-3">
                                        {user?.authProvider === 'google' || !user?.password ? (
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    placeholder="Enter 6-digit MFA Code"
                                                    value={verifyCode}
                                                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all font-mono tracking-widest"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex-1 relative">
                                                <input
                                                    type="password"
                                                    placeholder="Confirm account password"
                                                    value={disablePassword}
                                                    onChange={(e) => setDisablePassword(e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 transition-all"
                                                />
                                            </div>
                                        )}
                                        <button 
                                            onClick={disableMfa}
                                            disabled={loading || (verifyCode.length !== 6 && !disablePassword)}
                                            className="px-8 py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-sm font-bold transition-all duration-300 disabled:opacity-30 flex items-center justify-center gap-2"
                                        >
                                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            Deactivate
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-gray-500 leading-relaxed italic">
                                        * Security recommendation: Keep MFA enabled to prevent unauthorized administrative access.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                    /* MFA IS DISABLED - SETUP FLOW */
                    <div className="space-y-6">
                        {setupStep === 0 && (
                            <button 
                                onClick={startMfaSetup}
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Smartphone className="w-5 h-5" />
                                {loading ? 'Initializing...' : 'Setup Authenticator'}
                            </button>
                        )}

                        {/* Phase 1: Scan Pulse */}
                        {setupStep === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="relative group mx-auto w-fit">
                                    <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative bg-white p-6 rounded-3xl shadow-[0_20px_50px_rgba(59,130,246,0.3)] transform transition-transform group-hover:scale-105">
                                        <img src={qrCode} alt="MFA QR Code" className="w-56 h-56 object-contain" />
                                    </div>
                                </div>
                                
                                <div className="text-center space-y-4">
                                    <h4 className="text-white font-bold flex items-center justify-center gap-2">
                                        <Globe className="w-4 h-4 text-blue-400" />
                                        Scan Identity Pulse
                                    </h4>
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Manual Key</p>
                                        <code className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg text-blue-400 font-mono text-sm shadow-inner group-hover:border-blue-500/30 transition-colors">
                                            {secret}
                                        </code>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            maxLength={6}
                                            placeholder="000000"
                                            value={verifyCode}
                                            onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                                            className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-white text-center tracking-[0.8em] font-mono text-2xl focus:outline-none focus:border-blue-500/50 shadow-inner"
                                        />
                                        <button 
                                            onClick={verifyMfaSetup}
                                            disabled={loading || verifyCode.length !== 6}
                                            className="px-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white rounded-2xl font-black uppercase tracking-tighter transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center justify-center"
                                        >
                                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm'}
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => setSetupStep(0)} 
                                        className="w-full text-gray-500 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors"
                                    >
                                        Discard Setup
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Phase 2: Success Pulse */}
                        {setupStep === 2 && (
                            <div className="text-center py-12 space-y-6 animate-in zoom-in-95 duration-500">
                                <div className="relative w-24 h-24 mx-auto">
                                    <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse" />
                                    <div className="relative w-full h-full bg-green-500/10 border border-green-500/40 rounded-full flex items-center justify-center text-green-400">
                                        <ShieldCheck className="w-12 h-12" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-2xl font-black text-white tracking-tight uppercase">Protocol Active</h4>
                                    <p className="text-gray-400 text-sm">Your administrative pulse is now fully secured.</p>
                                </div>
                            </div>
                        )}
                    </div>
                    )}
                </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="sessions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-4"
          >
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
                    <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-sm font-medium animate-pulse">Scanning identity pulses...</p>
                </div>
            ) : sessions.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                    <Globe className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">No active identity pulses detected.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {sessions.map(session => (
                        <motion.div 
                            layout
                            key={session._id} 
                            className={`
                                relative group overflow-hidden bg-[#0f1117] border rounded-2xl p-4 flex items-center justify-between transition-all duration-300
                                ${session.isCurrent ? 'border-blue-500/30 bg-blue-500/[0.02] shadow-[0_0_15px_-5px_rgba(59,130,246,0.2)]' : 'border-white/5 hover:border-white/10'}
                            `}
                        >
                            {/* Pulse Indicator for current session */}
                            {session.isCurrent && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            )}

                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`
                                    p-3 rounded-xl transition-colors duration-300
                                    ${session.isCurrent ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-gray-500 group-hover:bg-white/10'}
                                `}>
                                    {(/mobile/i).test(session.userAgent) ? <Smartphone className="w-6 h-6" /> : <Server className="w-6 h-6" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-white font-bold tracking-tight">
                                            {session.ip === '::1' ? 'Localhost (me)' : (session.ip || 'Unknown Presence')}
                                        </h4>
                                        {session.isCurrent && (
                                            <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400 text-[9px] px-2 py-0.5 rounded-full uppercase font-black tracking-widest border border-blue-500/20">
                                                Active Now
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[11px] font-medium">
                                        <span className="flex items-center gap-1.5 text-gray-500">
                                            <Clock className="w-3.5 h-3.5" /> 
                                            {new Date(session.lastActivity).toLocaleString(undefined, { 
                                                month: 'short', 
                                                day: 'numeric', 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-gray-400/60 bg-white/5 px-2 py-0.5 rounded-md border border-white/5 italic">
                                            <Fingerprint className="w-3.5 h-3.5" />
                                            {session.userAgent || 'Ghost Browser'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {!session.isCurrent && (
                                <button
                                    onClick={() => revokeSession(session._id)}
                                    className="relative z-10 p-2.5 text-gray-500 hover:text-red-400 bg-white/0 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-all duration-300 transform group-hover:scale-110"
                                    title="Terminate Connection"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            )}

                            {/* Background decoration */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecurityManagement;
