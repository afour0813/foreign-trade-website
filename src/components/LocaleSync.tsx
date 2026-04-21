'use client';

import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

/**
 * Syncs the <html> lang attribute with the current i18n locale.
 * This is a separate client component to avoid hydration mismatch -
 * it only modifies the DOM after mount via useEffect.
 */
export function LocaleSync() {
  const { locale } = useI18n();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
