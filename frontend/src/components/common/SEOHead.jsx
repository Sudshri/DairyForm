import { useEffect } from 'react';

const BASE_TITLE = 'DairyForm – Farm Fresh Dairy';
const BASE_DESC  = 'Pure farm-fresh milk, ghee, butter and dairy products delivered to your doorstep. Sourced daily from certified organic farms.';

export default function SEOHead({ title, description, image, url, type = 'website' }) {
  const fullTitle = title ? `${title} | DairyForm` : BASE_TITLE;
  const desc      = description || BASE_DESC;
  const ogImage   = image || '/og-default.jpg';

  useEffect(() => {
    document.title = fullTitle;

    const set = (sel, attr, val) => {
      let el = document.querySelector(sel);
      if (!el) {
        el = document.createElement('meta');
        const [attrName] = sel.match(/\[(.*?)(?==|\])/)?.[1]?.split('=') ?? ['name'];
        el.setAttribute(attrName.replace('[', ''), sel.match(/["']([^"']+)["']/)?.[1] ?? '');
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };

    set('meta[name="description"]',         'content', desc);
    set('meta[property="og:title"]',        'content', fullTitle);
    set('meta[property="og:description"]',  'content', desc);
    set('meta[property="og:type"]',         'content', type);
    set('meta[property="og:image"]',        'content', ogImage);
    if (url) set('meta[property="og:url"]', 'content', url);
    set('meta[name="twitter:card"]',        'content', 'summary_large_image');
    set('meta[name="twitter:title"]',       'content', fullTitle);
    set('meta[name="twitter:description"]', 'content', desc);
  }, [fullTitle, desc, ogImage, url, type]);

  return null;
}
