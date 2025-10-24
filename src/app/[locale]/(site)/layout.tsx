import { DesktopModal } from '@/components/shared/DesktopModal';
import { MobileDrawer } from '@/components/shared/MobileDrawer';
import { LayoutGroup } from 'motion/react';
import { Spotlight } from '@/components/ui/spotlight-new';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <LayoutGroup>
            <div className='absolute inset-0 pointer-events-none' />
            {/* === Page Content === */}
            <div className='relative min-h-screen overflow-hidden' style={{ paddingTop: '3.25rem' }}>
                <Spotlight
                    gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(50, 100%, 80%, .10) 0, hsla(50, 100%, 60%, .04) 50%, hsla(50, 100%, 40%, 0) 80%)"
                    gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(50, 100%, 80%, .06) 0, hsla(50, 100%, 60%, .02) 80%, transparent 100%)"
                    gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(50, 100%, 80%, .04) 0, hsla(50, 100%, 40%, .02) 80%, transparent 100%)"
                />


                {children}
            </div>
            {/* Render modals once at app level */}
            <DesktopModal />
            <MobileDrawer />
        </LayoutGroup>
    );
}
