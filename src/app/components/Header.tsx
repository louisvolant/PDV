// src/app/components/Header.tsx
'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Calculator } from 'lucide-react';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Name */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/20 dark:bg-indigo-500 dark:shadow-none">
            <Calculator className="h-5 w-5 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {t('app_title')}
            </h1>
          </div>
        </div>

        {/* Actions (Language + Theme) */}
        <div className="flex items-center gap-3">
          
          {/* Language Selector Dropdown */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm outline-none transition-all hover:bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <option value="fr">Français 🇫🇷</option>
            <option value="en">English 🇬🇧</option>
          </select>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {darkMode ? (
              <Sun className="h-4 w-4 text-amber-500 transition-all hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600 transition-all" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
