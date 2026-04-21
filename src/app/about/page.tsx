'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Factory, Users, Award, Truck } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function AboutPage() {
  const { t } = useI18n();
  const [aboutUs, setAboutUs] = useState('');

  useEffect(() => {
    fetch('/api/site')
      .then((res) => res.json())
      .then((data) => {
        setAboutUs(data.settings?.about_us || '');
      })
      .catch(console.error);
  }, []);

  const defaultAboutUs = `Xiamen Sunny Hair Bow Co., Ltd is a professional manufacturer which mainly produces high quality Children's hair accessories including Hair clips, Headbands, Elastic Hair Bands, Hair Bows, Ponytail Holders, Baby Gift sets, Holiday Bows, Hair Ties and more.

We also produce flower accessories with well-equipped testing facilities and strong technical force.

With a wide range, good quality, reasonable prices and stylish designs, our products are extensively recognized and trusted by customers worldwide. We can also accept OEM and ODM orders according to customers' samples and designs.

Our factory is located in Xiamen, Fujian Province, China. We have many years of experience in the hair accessories industry and have established a good reputation among our customers.

We offer excellent, comprehensive customer service every step of the way, from product development and design to production and delivery.`;

  const productItems = [
    'Hair Clips',
    'Headbands',
    'Hair Bows',
    'Hair Ties',
    'Ponytail Holders',
    'Baby Gift Sets',
    'Holiday Bows',
    'Flower Accessories',
    'Hair Accessories Set',
    'Girls Hair Accessories',
    'Baby Headbands',
    'Bow Clips',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{t('about.title')}</h1>
          <p className="text-orange-100 text-lg">
            {t('about.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Company Introduction */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('about.companyProfile')}</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {aboutUs || defaultAboutUs}
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-12">{t('about.whyChooseUs')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Factory className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{t('about.factoryDirect')}</h3>
              <p className="text-gray-600 text-sm">
                {t('about.factoryDirectDesc')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{t('about.highQuality')}</h3>
              <p className="text-gray-600 text-sm">
                {t('about.highQualityDesc')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{t('about.customOrders')}</h3>
              <p className="text-gray-600 text-sm">
                {t('about.customOrdersDesc')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{t('about.fastDelivery')}</h3>
              <p className="text-gray-600 text-sm">
                {t('about.fastDeliveryDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Our Products */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-12">{t('about.ourProducts')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {productItems.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 text-center hover:bg-orange-50 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-orange-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('about.interested')}</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('about.interestedDesc')}
          </p>
          <Link href="/contact">
            <Button className="bg-orange-500 hover:bg-orange-600">
              {t('about.contactNow')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
