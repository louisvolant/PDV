// src/app/components/Footer.tsx
'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Heart } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 3.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 py-8 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:flex-row text-center md:text-left">
        
        {/* Author / Copy */}
        <p className="text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} {t('app_title')}. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <a
            href="https://github.com/louisvolant/PDV"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
          <span className="hidden md:inline text-slate-300 dark:text-slate-800">|</span>
          <a
            href="https://github.com/louisvolant"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <GlobeIcon className="h-4 w-4" />
            Portfolio
          </a>
        </div>

        {/* Built with love banner */}
        <p className="flex items-center justify-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
          Made with <Heart className="h-3 w-3 text-red-500 fill-current" /> by Louis Volant
        </p>

      </div>
    </footer>
  );
}
