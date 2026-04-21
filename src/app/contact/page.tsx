'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/lib/i18n';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface ContactInfo {
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  wechat?: string;
  skype?: string;
  working_hours?: string;
  [key: string]: string | undefined;
}

export default function ContactPage() {
  const { t } = useI18n();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/site')
      .then((res) => res.json())
      .then((data) => {
        setContactInfo(data.contactInfo);
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        alert(t('contact.submitFailed'));
      }
    } catch {
      alert(t('contact.submitFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const defaultContact = {
    address: '#70 BLDG, XIANGFU SANLI ROAD, XIANG\'AN DISTRICT 361101, XIAMEN, FUJIAN, CHINA',
    phone: '13400688707',
    email: 'enqi@qqq.com',
    whatsapp: '',
    wechat: '',
    skype: '',
    working_hours: 'Mon - Fri: 9:00 AM - 6:00 PM (GMT+8)',
  };

  const info = contactInfo || defaultContact;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{t('contact.title')}</h1>
          <p className="text-orange-100 text-lg">
            {t('contact.subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('contact.contactInfo')}</h2>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{t('contact.address')}</h3>
                    <p className="text-gray-600 text-sm">{info.address}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{t('contact.phone')}</h3>
                    <a href={`tel:${info.phone}`} className="text-orange-500 hover:underline text-sm">
                      {info.phone}
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{t('contact.emailLabel')}</h3>
                    <a href={`mailto:${info.email}`} className="text-orange-500 hover:underline text-sm">
                      {info.email}
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{t('contact.workingHours')}</h3>
                    <p className="text-gray-600 text-sm">{info.working_hours}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact */}
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">{t('contact.quickContact')}</h3>
                <div className="space-y-3">
                  {info.whatsapp && (
                    <a
                      href={`https://wa.me/${info.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-700 hover:text-green-500"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">WhatsApp: {info.whatsapp}</span>
                    </a>
                  )}
                  {info.wechat && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">WeChat: {info.wechat}</span>
                    </div>
                  )}
                  {info.skype && (
                    <a
                      href={`skype:${info.skype}?chat`}
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">Skype: {info.skype}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('contact.sendMessage')}</h2>
            
            {submitted ? (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">{t('contact.messageSent')}</h3>
                  <p className="text-green-600 mb-4">
                    {t('contact.messageSentDesc')}
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="border-green-500 text-green-600"
                  >
                    {t('contact.sendAnother')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('contact.yourName')} *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder={t('contact.namePlaceholder')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('contact.emailAddress')} *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder={t('contact.emailPlaceholder')}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('contact.phoneNumber')}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder={t('contact.phonePlaceholder')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">{t('contact.subject')} *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder={t('contact.subjectPlaceholder')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t('contact.message')} *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder={t('contact.messagePlaceholder')}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>{t('contact.sending')}</>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {t('contact.sendBtn')}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Additional Info */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">{t('contact.inquiryPricelist')}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('contact.inquiryDesc')}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  {t('contact.benefit1')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  {t('contact.benefit2')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  {t('contact.benefit3')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  {t('contact.benefit4')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
