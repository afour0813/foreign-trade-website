'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface ContactInfo {
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  wechat?: string;
  skype?: string;
  working_hours?: string;
}

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  created_at: string;
}

export function Footer() {
  const { t } = useI18n();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/site')
      .then((res) => res.json())
      .then((data) => setContactInfo(data.contactInfo))
      .catch(console.error);

    fetch('/api/news?limit=3')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLatestNews(data);
      })
      .catch(console.error);
  }, []);

  const handleQuickInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryEmail) return;
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Website Visitor',
          email: inquiryEmail,
          message: 'Quick inquiry from website footer',
        }),
      });
      setInquirySubmitted(true);
      setInquiryEmail('');
    } catch {
      // ignore
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Contact Us */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              {contactInfo?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-orange-400" />
                  <span className="text-sm">{contactInfo.address}</span>
                </li>
              )}
              {contactInfo?.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0 text-orange-400" />
                  <a href={`tel:${contactInfo.phone}`} className="text-sm hover:text-orange-400">
                    {contactInfo.phone}
                  </a>
                </li>
              )}
              {contactInfo?.email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0 text-orange-400" />
                  <a href={`mailto:${contactInfo.email}`} className="text-sm hover:text-orange-400">
                    {contactInfo.email}
                  </a>
                </li>
              )}
              {contactInfo?.skype && (
                <li className="text-sm">Skype: {contactInfo.skype}</li>
              )}
              {contactInfo?.whatsapp && (
                <li className="text-sm">WhatsApp: {contactInfo.whatsapp}</li>
              )}
              {contactInfo?.working_hours && (
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0 text-orange-400" />
                  <span className="text-sm">{contactInfo.working_hours}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Inquiry Form */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.inquiry')}</h4>
            <p className="text-sm text-gray-400 mb-4">{t('footer.inquiry.desc')}</p>
            <form onSubmit={handleQuickInquiry} className="space-y-3">
              <input
                type="email"
                value={inquiryEmail}
                onChange={(e) => setInquiryEmail(e.target.value)}
                placeholder={t('footer.inquiry.placeholder')}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-orange-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {t('footer.inquiry.button')}
              </button>
              {inquirySubmitted && (
                <p className="text-xs text-green-400">{t('footer.inquiry.success')}</p>
              )}
            </form>
          </div>

          {/* Latest News */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.latestNews')}</h4>
            {latestNews.length > 0 ? (
              <ul className="space-y-3">
                {latestNews.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/news/${item.slug}`}
                      className="text-sm text-gray-400 hover:text-orange-400 transition-colors line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">{t('footer.noNews')}</p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
