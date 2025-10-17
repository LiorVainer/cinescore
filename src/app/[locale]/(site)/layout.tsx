import {DesktopModal} from '@/components/shared/DesktopModal';
import {MobileDrawer} from '@/components/shared/MobileDrawer';
import {LayoutGroup} from 'motion/react';

export default function SiteLayout({children}: {children: React.ReactNode}) {
    return (<LayoutGroup>
        <div className="absolute inset-0 bg-gradient-static pointer-events-none" />
        {/* === Page Content === */}
        <div className="relative min-h-screen overflow-hidden" style={{ paddingTop: '3.25rem' }}>
            {children}
        </div>
        {/* Render modals once at app level */}
        <DesktopModal/>
        <MobileDrawer/>
    </LayoutGroup>)
}
