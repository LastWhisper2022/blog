import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface ImagePreviewProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function ImagePreview({ src, alt, className }: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={clsx('tw-cursor-zoom-in', className)}
        onClick={() => setIsOpen(true)}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="tw-fixed tw-inset-0 tw-z-[9999] tw-flex tw-items-center tw-justify-center tw-bg-black/80 tw-backdrop-blur-sm tw-p-4"
          >
            <motion.img
              src={src}
              alt={alt}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="tw-max-w-full tw-max-h-full tw-object-contain tw-rounded-lg tw-shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />
            
            {/* Close button */}
            <button 
              className="tw-absolute tw-top-4 tw-right-4 tw-p-2 tw-bg-white/10 tw-rounded-full tw-text-white hover:tw-bg-white/20 tw-transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
