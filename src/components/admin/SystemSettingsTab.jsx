import React, { useState, useEffect } from 'react';
import { Save, Loader2, DollarSign } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SystemSettingsTab = () => {
    const [rate, setRate] = useState(100);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/system/settings/gtc_to_ticket_rate');
            if (res.data.success) {
                setRate(res.data.value || 100);
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await api.put('/admin/settings/gtc_to_ticket_rate', {
                value: Number(rate),
                description: "GTC cost per 1 Ticket"
            });
            if (res.data.success) {
                toast.success("Conversion rate updated!");
            }
        } catch (error) {
            toast.error("Failed to update rate");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-purple-500" /></div>;

    return (
        <div className="p-6 bg-black/40 rounded-2xl border border-white/5 max-w-2xl">
            <h2 className="text-xl font-black text-white uppercase italic mb-6">Economy Settings</h2>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                        GTC to Ticket Conversion Rate
                    </label>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-purple-500 outline-none transition-colors"
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            Save
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2">
                        Cost in GTC to purchase 1 Ticket. Users will see this rate in the Exchange Modal.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SystemSettingsTab;
