import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Globe} from "lucide-react";
import {Language} from "@prisma/client";
import {useLocale} from "next-intl";
import {mapLanguageToLocale, mapLocaleToLanguage} from "@/constants/languages.const";
import {usePathname, useRouter} from "@/i18n/navigation";

export const LanguageToggle = () => {
    const locale= useLocale();
    const currentLanguage = mapLocaleToLanguage(locale);
    const pathname = usePathname();
    const router = useRouter();



    const handleLanguageChange = (language: Language) => {
        router.replace(pathname, {locale: mapLanguageToLocale(language)});
    };

    const getLanguageDisplay = (lang: Language) => {
        switch (lang) {
            case Language.he_IL:
                return {flag: '🇮🇱', name: 'עברית', short: 'עב'};
            case Language.en_US:
                return {flag: '🇺🇸', name: 'English', short: 'EN'};
            default:
                // ✅ Typesafe: 'language' key is validated against nav namespace
                return {flag: '🌐', name: t('language'), short: 'LG'};
        }
    };

    const currentLangDisplay = getLanguageDisplay(currentLanguage);

    return <div className='flex items-center gap-4'>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='gap-2 rounded-full'>
                    <Globe className='h-4 w-4'/>
                    <span className='hidden sm:inline'>{currentLangDisplay.name}</span>
                    <span className='sm:hidden'>{currentLangDisplay.short}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuItem
                    onClick={() => handleLanguageChange(Language.he_IL)}
                    className={currentLanguage === Language.he_IL ? 'bg-accent' : ''}
                >
                    <span className='mr-2'>🇮🇱</span>
                    עברית
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleLanguageChange(Language.en_US)}
                    className={currentLanguage === Language.en_US ? 'bg-accent' : ''}
                >
                    <span className='mr-2'>🇺🇸</span>
                    English
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
}