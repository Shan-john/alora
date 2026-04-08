import { useEffect, useState } from 'react';
import { adminApi } from '../../utils/api';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2 } from 'lucide-react';

export default function Homepage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('hero');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getSettings()
      .then(d => setSettings(d.settings || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveField = async (field, value) => {
    setSaving(true);
    try {
      await adminApi.updateSettings({ [field]: value });
      setSettings(p => ({ ...p, [field]: value }));
      toast.success('Saved!');
    } catch { toast.error('Failed'); }
    setSaving(false);
  };

  if (loading) return <Spinner size="lg" className="py-20" />;

  const tabs = ['hero', 'announcement', 'instagram', 'trust', 'gifting', 'flash'];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal mb-6">Homepage Editor</h1>
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`py-2 px-4 rounded-lg text-sm font-body whitespace-nowrap cursor-pointer transition-colors ${
              tab === t ? 'bg-gold/10 text-gold' : 'text-stone-500 bg-white border border-stone-200'
            }`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-stone-100 p-6">
        {tab === 'hero' && (
          <div className="space-y-4">
            <h2 className="font-body text-sm font-semibold">Hero Slides</h2>
            {(settings.heroSlides || []).map((s, i) => (
              <div key={i} className="border border-stone-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between"><span className="text-xs text-stone-500">Slide {i+1}</span>
                  <button onClick={() => { const sl = [...settings.heroSlides]; sl.splice(i,1); setSettings(p => ({...p, heroSlides: sl})); }} className="text-red-400"><Trash2 size={14}/></button></div>
                <input value={s.image||''} onChange={e => { const sl=[...settings.heroSlides]; sl[i]={...sl[i],image:e.target.value}; setSettings(p=>({...p,heroSlides:sl})); }} placeholder="Image URL" className="w-full py-2 px-3 border border-stone-200 rounded text-sm"/>
                <input value={s.headline||''} onChange={e => { const sl=[...settings.heroSlides]; sl[i]={...sl[i],headline:e.target.value}; setSettings(p=>({...p,heroSlides:sl})); }} placeholder="Headline" className="w-full py-2 px-3 border border-stone-200 rounded text-sm"/>
                <input value={s.subheadline||''} onChange={e => { const sl=[...settings.heroSlides]; sl[i]={...sl[i],subheadline:e.target.value}; setSettings(p=>({...p,heroSlides:sl})); }} placeholder="Subheadline" className="w-full py-2 px-3 border border-stone-200 rounded text-sm"/>
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={() => setSettings(p=>({...p,heroSlides:[...(p.heroSlides||[]),{image:'',headline:'',subheadline:'',cta1Text:'Shop Now',cta1Link:'/shop'}]}))} variant="outline" size="sm"><Plus size={14} className="mr-1"/>Add</Button>
              <Button onClick={() => saveField('heroSlides', settings.heroSlides)} variant="solid" size="sm" loading={saving}><Save size={14} className="mr-1"/>Save</Button>
            </div>
          </div>
        )}
        {tab === 'announcement' && (
          <div className="space-y-4">
            <h2 className="font-body text-sm font-semibold">Announcements</h2>
            <textarea value={(settings.announcements||[]).join('\n')} onChange={e => setSettings(p=>({...p,announcements:e.target.value.split('\n')}))} rows={6} className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm resize-none"/>
            <Button onClick={() => saveField('announcements', settings.announcements)} variant="solid" size="sm" loading={saving}><Save size={14} className="mr-1"/>Save</Button>
          </div>
        )}
        {tab === 'trust' && (
          <div className="space-y-4">
            <h2 className="font-body text-sm font-semibold">Trust Strip</h2>
            {(settings.trustItems||[]).map((item,i) => (
              <div key={i} className="flex gap-2">
                <select value={item.icon} onChange={e => { const it=[...settings.trustItems]; it[i]={...it[i],icon:e.target.value}; setSettings(p=>({...p,trustItems:it})); }} className="py-2 px-3 border border-stone-200 rounded text-sm w-40">
                  {['Truck','RefreshCw','ShieldCheck','CheckCircle','Heart','Star','Package'].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <input value={item.label} onChange={e => { const it=[...settings.trustItems]; it[i]={...it[i],label:e.target.value}; setSettings(p=>({...p,trustItems:it})); }} className="flex-1 py-2 px-3 border border-stone-200 rounded text-sm"/>
              </div>
            ))}
            <Button onClick={() => saveField('trustItems', settings.trustItems)} variant="solid" size="sm" loading={saving}><Save size={14} className="mr-1"/>Save</Button>
          </div>
        )}
        {tab === 'gifting' && (
          <div className="space-y-4">
            <h2 className="font-body text-sm font-semibold">Gifting Banner</h2>
            <input value={settings.giftingBanner?.image||''} onChange={e => setSettings(p=>({...p,giftingBanner:{...p.giftingBanner,image:e.target.value}}))} placeholder="Image URL" className="w-full py-2 px-3 border border-stone-200 rounded text-sm"/>
            <input value={settings.giftingBanner?.heading||''} onChange={e => setSettings(p=>({...p,giftingBanner:{...p.giftingBanner,heading:e.target.value}}))} placeholder="Heading" className="w-full py-2 px-3 border border-stone-200 rounded text-sm"/>
            <input value={settings.giftingBanner?.subheading||''} onChange={e => setSettings(p=>({...p,giftingBanner:{...p.giftingBanner,subheading:e.target.value}}))} placeholder="Subheading" className="w-full py-2 px-3 border border-stone-200 rounded text-sm"/>
            <Button onClick={() => saveField('giftingBanner', settings.giftingBanner)} variant="solid" size="sm" loading={saving}><Save size={14} className="mr-1"/>Save</Button>
          </div>
        )}
        {tab === 'instagram' && (
          <div className="space-y-4">
            <h2 className="font-body text-sm font-semibold">Instagram Posts</h2>
            {(settings.igPosts||[]).map((p,i) => (
              <div key={i} className="flex gap-2 items-center">
                <input value={p.imageUrl} onChange={e => { const ps=[...settings.igPosts]; ps[i]={...ps[i],imageUrl:e.target.value}; setSettings(pr=>({...pr,igPosts:ps})); }} placeholder="Image URL" className="flex-1 py-2 px-3 border border-stone-200 rounded text-sm"/>
                <button onClick={() => { const ps=[...settings.igPosts]; ps.splice(i,1); setSettings(pr=>({...pr,igPosts:ps})); }} className="text-red-400"><Trash2 size={14}/></button>
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={() => setSettings(p=>({...p,igPosts:[...(p.igPosts||[]),{imageUrl:'',isVisible:true}]}))} variant="outline" size="sm"><Plus size={14} className="mr-1"/>Add</Button>
              <Button onClick={() => saveField('igPosts', settings.igPosts)} variant="solid" size="sm" loading={saving}><Save size={14} className="mr-1"/>Save</Button>
            </div>
          </div>
        )}
        {tab === 'flash' && (
          <div className="space-y-4">
            <h2 className="font-body text-sm font-semibold">Flash Sale</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={settings.flashSale?.isActive||false} onChange={e => setSettings(p=>({...p,flashSale:{...p.flashSale,isActive:e.target.checked}}))} className="accent-gold w-4 h-4"/>
              <span className="text-sm">Active</span>
            </label>
            <input type="number" value={settings.flashSale?.discountPercent||0} onChange={e => setSettings(p=>({...p,flashSale:{...p.flashSale,discountPercent:parseInt(e.target.value)}}))} className="w-32 py-2 px-3 border border-stone-200 rounded text-sm" placeholder="Discount %"/>
            <Button onClick={() => saveField('flashSale', settings.flashSale)} variant="solid" size="sm" loading={saving}><Save size={14} className="mr-1"/>Save</Button>
          </div>
        )}
      </div>
    </div>
  );
}
