import { useEffect, useState } from 'react';
import { adminApi } from '../../utils/api';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getSettings().then(d => setSettings(d.settings || {})).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try { await adminApi.updateSettings(settings); toast.success('Settings saved!'); }
    catch { toast.error('Failed'); }
    setSaving(false);
  };

  if (loading) return <Spinner size="lg" className="py-20" />;

  const Field = ({ label, field, type = 'text' }) => (
    <div>
      <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">{label}</label>
      {type === 'textarea' ? (
        <textarea value={settings[field] || ''} onChange={e => setSettings(p => ({...p, [field]: e.target.value}))}
          rows={3} className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm resize-none" />
      ) : (
        <input type={type} value={settings[field] || ''} onChange={e => setSettings(p => ({...p, [field]: type === 'number' ? parseInt(e.target.value) : e.target.value}))}
          className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm" />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-charcoal">Settings</h1>
        <Button onClick={save} variant="solid" size="sm" loading={saving}><Save size={14} className="mr-1" /> Save All</Button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-stone-100 p-6 space-y-4">
          <h2 className="font-body text-sm font-semibold text-charcoal border-b pb-2">Store Info</h2>
          <Field label="Store Name" field="storeName" />
          <Field label="Tagline" field="tagline" />
        </div>

        <div className="bg-white rounded-xl border border-stone-100 p-6 space-y-4">
          <h2 className="font-body text-sm font-semibold text-charcoal border-b pb-2">Contact Info</h2>
          <Field label="Instagram Handle" field="igHandle" />
          <Field label="WhatsApp Number (with country code, no +)" field="whatsappNumber" />
        </div>

        <div className="bg-white rounded-xl border border-stone-100 p-6 space-y-4">
          <h2 className="font-body text-sm font-semibold text-charcoal border-b pb-2">DM Message Template</h2>
          <Field label="Template (use {orderDetails} and {orderId})" field="dmMessageTemplate" type="textarea" />
        </div>

        <div className="bg-white rounded-xl border border-stone-100 p-6 space-y-4">
          <h2 className="font-body text-sm font-semibold text-charcoal border-b pb-2">SEO</h2>
          <Field label="Default Meta Title" field="defaultMetaTitle" />
          <Field label="Default Meta Description" field="defaultMetaDescription" type="textarea" />
        </div>

        <div className="bg-white rounded-xl border border-stone-100 p-6 space-y-4">
          <h2 className="font-body text-sm font-semibold text-charcoal border-b pb-2">Thresholds</h2>
          <Field label="Low Stock Threshold" field="lowStockThreshold" type="number" />
        </div>
      </div>
    </div>
  );
}
