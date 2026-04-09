import { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../../utils/api';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const defaultHeroSlide = {
  lifestyleImage: '',
  productImage: '',
  bgColor: '#B8973A',
  headline: '',
  subheadline: '',
  ctaText: 'Shop Collection',
  ctaLink: '/shop',
};

const defaultAboutValue = { icon: 'Heart', title: '', desc: '' };

const toTextArray = (items = []) =>
  Array.isArray(items)
    ? items
        .map((item) => {
          if (typeof item === 'string') return item;
          return item?.text || '';
        })
        .filter(Boolean)
    : [];

function Field({ label, value, onChange, type = 'text', hint, rows = 3 }) {
  return (
    <div>
      <label className="text-xs tracking-wider uppercase font-body text-stone-500 mb-1 block">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm resize-none"
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm"
        />
      )}
      {hint && <p className="text-xs text-stone-400 mt-1">{hint}</p>}
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-xl border border-stone-100 p-6 space-y-4">
      <div className="border-b pb-2">
        <h2 className="font-body text-sm font-semibold text-charcoal">{title}</h2>
        {subtitle && <p className="text-xs text-stone-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedJson, setAdvancedJson] = useState('{}');

  useEffect(() => {
    adminApi
      .getSettings()
      .then((data) => {
        const current = data.settings || {};
        const normalized = {
          ...current,
          announcements: toTextArray(current.announcements),
          heroSlides:
            Array.isArray(current.heroSlides) && current.heroSlides.length
              ? current.heroSlides
              : [],
          trustItems:
            Array.isArray(current.trustItems) && current.trustItems.length
              ? current.trustItems
              : [],
          igPosts:
            Array.isArray(current.igPosts) && current.igPosts.length
              ? current.igPosts
              : [],
          aboutPage: {
            ...(current.aboutPage || {}),
            values:
              Array.isArray(current?.aboutPage?.values) && current.aboutPage.values.length
                ? current.aboutPage.values
                : [],
          },
        };

        setSettings(normalized);
        setAdvancedJson(JSON.stringify(normalized, null, 2));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setField = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const setAboutField = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      aboutPage: {
        ...(prev.aboutPage || {}),
        [field]: value,
      },
    }));
  };

  const updateArrayItem = (key, index, value) => {
    setSettings((prev) => {
      const list = [...(prev[key] || [])];
      list[index] = value;
      return { ...prev, [key]: list };
    });
  };

  const addArrayItem = (key, item) => {
    setSettings((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), item],
    }));
  };

  const removeArrayItem = (key, index) => {
    setSettings((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, idx) => idx !== index),
    }));
  };

  const updateNestedArrayItem = (parentKey, childKey, index, value) => {
    setSettings((prev) => {
      const parent = { ...(prev[parentKey] || {}) };
      const list = [...(parent[childKey] || [])];
      list[index] = value;
      parent[childKey] = list;
      return { ...prev, [parentKey]: parent };
    });
  };

  const addNestedArrayItem = (parentKey, childKey, item) => {
    setSettings((prev) => {
      const parent = { ...(prev[parentKey] || {}) };
      parent[childKey] = [...(parent[childKey] || []), item];
      return { ...prev, [parentKey]: parent };
    });
  };

  const removeNestedArrayItem = (parentKey, childKey, index) => {
    setSettings((prev) => {
      const parent = { ...(prev[parentKey] || {}) };
      parent[childKey] = (parent[childKey] || []).filter((_, idx) => idx !== index);
      return { ...prev, [parentKey]: parent };
    });
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const payload = showAdvanced ? JSON.parse(advancedJson || '{}') : settings;
      await adminApi.updateSettings(payload);
      setSettings(payload);
      setAdvancedJson(JSON.stringify(payload, null, 2));
      toast.success('Saved successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner size="lg" className="py-20" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">Content & Settings</h1>
          <p className="text-sm text-stone-500">Simple editor for non-technical users.</p>
        </div>
        <Button onClick={saveAll} variant="solid" size="sm" loading={saving}>
          <Save size={14} className="mr-1" /> Save Changes
        </Button>
      </div>

      <Section title="Store Basics" subtitle="Brand name, contact, and footer info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Store Name" value={settings.storeName} onChange={(v) => setField('storeName', v)} />
          <Field label="Tagline" value={settings.tagline} onChange={(v) => setField('tagline', v)} />
          <Field label="Instagram Handle" value={settings.igHandle} onChange={(v) => setField('igHandle', v)} hint="Type only username (no @)" />
          <Field label="WhatsApp Number" value={settings.whatsappNumber} onChange={(v) => setField('whatsappNumber', v)} hint="Country code included, no +" />
          <Field label="Support Email" value={settings.supportEmail} onChange={(v) => setField('supportEmail', v)} />
        </div>
      </Section>

      <Section title="SEO" subtitle="Search preview title and description">
        <Field label="Default Meta Title" value={settings.defaultMetaTitle} onChange={(v) => setField('defaultMetaTitle', v)} />
        <Field label="Default Meta Description" value={settings.defaultMetaDescription} onChange={(v) => setField('defaultMetaDescription', v)} type="textarea" />
      </Section>

      <Section title="Top Announcements" subtitle="Texts that run at the very top of homepage">
        {(settings.announcements || []).map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              value={item}
              onChange={(e) => updateArrayItem('announcements', index, e.target.value)}
              className="flex-1 py-2 px-3 border border-stone-200 rounded-lg text-sm"
              placeholder={`Announcement ${index + 1}`}
            />
            <button type="button" onClick={() => removeArrayItem('announcements', index)} className="text-red-500 p-2">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('announcements', 'New announcement text')}>
          <Plus size={14} className="mr-1" /> Add Announcement
        </Button>
      </Section>

      <Section title="Hero Slides" subtitle="Main banner slides on homepage">
        {(settings.heroSlides || []).map((slide, index) => (
          <div key={index} className="border border-stone-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-charcoal">Slide {index + 1}</p>
              <button type="button" onClick={() => removeArrayItem('heroSlides', index)} className="text-red-500 p-1">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Lifestyle Image URL" value={slide.lifestyleImage || slide.image || ''} onChange={(v) => updateArrayItem('heroSlides', index, { ...slide, lifestyleImage: v })} />
              <Field label="Product Image URL" value={slide.productImage || slide.image || ''} onChange={(v) => updateArrayItem('heroSlides', index, { ...slide, productImage: v })} />
              <Field label="Headline" value={slide.headline || ''} onChange={(v) => updateArrayItem('heroSlides', index, { ...slide, headline: v })} />
              <Field label="Subheadline" value={slide.subheadline || ''} onChange={(v) => updateArrayItem('heroSlides', index, { ...slide, subheadline: v })} />
              <Field label="Button Text" value={slide.ctaText || slide.cta1Text || ''} onChange={(v) => updateArrayItem('heroSlides', index, { ...slide, ctaText: v })} />
              <Field label="Button Link" value={slide.ctaLink || slide.cta1Link || '/shop'} onChange={(v) => updateArrayItem('heroSlides', index, { ...slide, ctaLink: v })} />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('heroSlides', defaultHeroSlide)}>
          <Plus size={14} className="mr-1" /> Add Hero Slide
        </Button>
      </Section>

      <Section title="Gifting Banner" subtitle="Middle banner section on homepage">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Image URL" value={settings.giftingBanner?.image} onChange={(v) => setField('giftingBanner', { ...(settings.giftingBanner || {}), image: v })} />
          <Field label="Heading" value={settings.giftingBanner?.heading} onChange={(v) => setField('giftingBanner', { ...(settings.giftingBanner || {}), heading: v })} />
        </div>
        <Field label="Subheading" value={settings.giftingBanner?.subheading} onChange={(v) => setField('giftingBanner', { ...(settings.giftingBanner || {}), subheading: v })} type="textarea" />
      </Section>

      <Section title="Best Sellers Section" subtitle="Large right-side image in homepage best sellers block">
        <Field
          label="Right Image URL"
          value={settings.bestSellersImage}
          onChange={(v) => setField('bestSellersImage', v)}
        />
      </Section>

      <Section title="Instagram Grid" subtitle="6 image boxes shown on homepage">
        {(settings.igPosts || []).map((post, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={post.imageUrl || ''}
              onChange={(e) => updateArrayItem('igPosts', index, { ...post, imageUrl: e.target.value })}
              className="flex-1 py-2 px-3 border border-stone-200 rounded-lg text-sm"
              placeholder="Instagram image URL"
            />
            <button type="button" onClick={() => removeArrayItem('igPosts', index)} className="text-red-500 p-2">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('igPosts', { imageUrl: '' })}>
          <Plus size={14} className="mr-1" /> Add Instagram Image
        </Button>
      </Section>

      <Section title="About Page" subtitle="All text fields for About page">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Hero Eyebrow" value={settings.aboutPage?.heroEyebrow} onChange={(v) => setAboutField('heroEyebrow', v)} />
          <Field label="Hero Title" value={settings.aboutPage?.heroTitle} onChange={(v) => setAboutField('heroTitle', v)} />
          <Field label="Hero Subtitle" value={settings.aboutPage?.heroSubtitle} onChange={(v) => setAboutField('heroSubtitle', v)} />
          <Field label="Founder Image URL" value={settings.aboutPage?.founderImage} onChange={(v) => setAboutField('founderImage', v)} />
          <Field label="Story Title" value={settings.aboutPage?.storyTitle} onChange={(v) => setAboutField('storyTitle', v)} />
          <Field label="Dedication Title" value={settings.aboutPage?.dedicationTitle} onChange={(v) => setAboutField('dedicationTitle', v)} />
          <Field label="Mission Label" value={settings.aboutPage?.missionLabel} onChange={(v) => setAboutField('missionLabel', v)} />
        </div>
        <Field label="Story Paragraph 1" value={settings.aboutPage?.story} onChange={(v) => setAboutField('story', v)} type="textarea" rows={4} />
        <Field label="Story Paragraph 2" value={settings.aboutPage?.storySecondary} onChange={(v) => setAboutField('storySecondary', v)} type="textarea" rows={4} />
        <Field label="Mission Quote" value={settings.aboutPage?.mission} onChange={(v) => setAboutField('mission', v)} type="textarea" rows={3} />

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-stone-500">About Value Cards</p>
          {(settings.aboutPage?.values || []).map((value, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end border border-stone-200 rounded-lg p-3">
              <Field label="Icon" value={value.icon || ''} onChange={(v) => updateNestedArrayItem('aboutPage', 'values', index, { ...value, icon: v })} hint="Heart, Gem, Star" />
              <Field label="Title" value={value.title || ''} onChange={(v) => updateNestedArrayItem('aboutPage', 'values', index, { ...value, title: v })} />
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Field label="Description" value={value.desc || ''} onChange={(v) => updateNestedArrayItem('aboutPage', 'values', index, { ...value, desc: v })} />
                </div>
                <button type="button" onClick={() => removeNestedArrayItem('aboutPage', 'values', index)} className="text-red-500 p-2 mb-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => addNestedArrayItem('aboutPage', 'values', defaultAboutValue)}>
            <Plus size={14} className="mr-1" /> Add About Card
          </Button>
        </div>
      </Section>

      <Section title="Advanced (Optional)" subtitle="Only use if you know JSON. Normal users can ignore this.">
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="px-4 py-2 border border-stone-200 rounded-lg text-sm hover:border-gold transition-colors"
        >
          {showAdvanced ? 'Hide Advanced JSON' : 'Show Advanced JSON'}
        </button>

        {showAdvanced && (
          <div>
            <textarea
              value={advancedJson}
              onChange={(e) => setAdvancedJson(e.target.value)}
              rows={14}
              className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm font-mono"
            />
            <p className="text-xs text-stone-500 mt-1">When advanced mode is open, Save will use this JSON.</p>
          </div>
        )}
      </Section>
    </div>
  );
}
