import {routing} from '@/i18n/routing';
import type en from '../../messages/en.json';

type Messages = typeof en;

declare module 'next-intl' {
    interface AppConfig {
        Locale: (typeof routing.locales)[number];
        Messages: Messages;
    }
}
