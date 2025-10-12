'use client';

import React, {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {motion, AnimatePresence} from 'framer-motion';
import {createPortal} from 'react-dom';

import {Play, X, Youtube} from 'lucide-react';

interface ThumbnailButtonProps {
    videoUrl?: string;
    youtubeId?: string;
    thumbnailUrl?: string;
    title?: string;
    className?: string;
}

const DEFAULT_VIDEO_FALLBACK_URL = 'https://me7aitdbxq.ufs.sh/f/2wsMIGDMQRdYqvMy4kaWD2STgaJv9iAfGNzF5E06KYRULuoj';

const DEFAULT_VIDEO_THUMBNAIL = 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg';

const getYouTubeThumbnail = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

const getYouTubeEmbedUrl = (id: string) => `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;

const ThumbnailButton: React.FC<ThumbnailButtonProps> = ({
                                                             videoUrl,
                                                             youtubeId,
                                                             thumbnailUrl,
                                                             title = 'Play Video',
                                                             className = '',
                                                         }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);

    const isYouTube = !!youtubeId;

    const finalThumbnail = thumbnailUrl || (isYouTube ? getYouTubeThumbnail(youtubeId!) : DEFAULT_VIDEO_THUMBNAIL);

    const finalVideoUrl =
        isYouTube && youtubeId ? getYouTubeEmbedUrl(youtubeId) : videoUrl || DEFAULT_VIDEO_FALLBACK_URL;

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleOpenModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsModalOpen(true);
    };

    const handleCloseModal = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setIsModalOpen(false);
    };

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        // Only close if clicking the backdrop itself, not its children
        if (e.target === e.currentTarget) {
            handleCloseModal();
        }
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isModalOpen) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                handleCloseModal();
            }
        };
        if (isModalOpen) {
            // Use capture phase to handle the event before it bubbles
            document.addEventListener('keydown', handleEsc, true);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc, true);
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    return (
        <>
            <motion.button
                ref={buttonRef}
                initial={{scale: 1}}
                whileTap={{scale: 0.95}}
                onClick={handleOpenModal}
                className={`
          relative rounded-lg overflow-hidden bg-muted
          shadow-sm hover:shadow-md transition-all duration-200
          group focus:outline-none focus:ring-2 focus:ring-ring/50
          hover:cursor-pointer
          ${className}
        `}
                aria-label={title}
            >
                {/* Thumbnail Image */}
                <div className='relative w-full h-full'>
                    <Image src={finalThumbnail} alt='Video thumbnail' fill className='object-cover' sizes='200px'/>

                    {/* Play Icon Overlay */}
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='p-2 rounded-full bg-background/90 shadow-sm border border-border'>
                            <Play size={16} className='fill-foreground text-foreground ms-0.5'/>
                        </div>
                    </div>

                    {/* YouTube Badge */}
                    {isYouTube && (
                        <div
                            className='absolute top-2 end-2 bg-red-600/90 text-white p-1 rounded-full shadow-sm border border-white/10'
                            aria-label='YouTube'
                        >
                            <Youtube className='w-3 h-3'/>
                        </div>
                    )}

                    {/* Title Overlay - matching actor name style */}
                    <div
                        className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-2 pt-8'>
                        <span className='font-medium text-white text-sm line-clamp-2'>
                            {title}
                        </span>
                    </div>
                </div>
            </motion.button>

            {/* Modal - Rendered via Portal to bypass stacking context */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            key="video-modal"
                            className='fixed inset-0 z-[300] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm pointer-events-auto'
                            onClick={handleBackdropClick}
                            onMouseDown={(e) => e.stopPropagation()}
                            onMouseUp={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            onTouchEnd={(e) => e.stopPropagation()}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.2}}
                            role='dialog'
                            aria-modal='true'
                            aria-label='Video Modal'
                        >
                            <motion.div
                                initial={{opacity: 0, scale: 0.9}}
                                animate={{opacity: 1, scale: 1}}
                                exit={{opacity: 0, scale: 0.9}}
                                transition={{duration: 0.2}}
                                className='relative w-full max-w-4xl aspect-video bg-card rounded-2xl overflow-hidden shadow-2xl border border-border pointer-events-auto'
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onMouseUp={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                                onTouchEnd={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={handleCloseModal}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    type="button"
                                    className='absolute top-4 end-4 z-[310] p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-sm transition-all duration-200 cursor-pointer pointer-events-auto'
                                    aria-label='Close video'
                                >
                                    <X size={20}/>
                                </button>

                                {/* Video or YouTube */}
                                {isYouTube ? (
                                    <iframe
                                        src={finalVideoUrl}
                                        className='w-full h-full pointer-events-auto'
                                        allow='autoplay; encrypted-media'
                                        allowFullScreen
                                        title={title}
                                    />
                                ) : (
                                    <video src={finalVideoUrl} controls autoPlay
                                           className='w-full h-full pointer-events-auto'/>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default ThumbnailButton;
