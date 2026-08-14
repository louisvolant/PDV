// src/app/components/CalculatorForm.tsx
'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Coins,
  ChevronDown,
  ChevronUp,
  Percent,
  Scale,
  Calendar,
  Award,
  HelpCircle,
} from 'lucide-react';

interface CalculatorFormProps {
  annualGross: number;
  setAnnualGross: (val: number) => void;
  incomeTaxRate: number;
  setIncomeTaxRate: (val: number) => void;
  seniorityYears: number;
  setSeniorityYears: (val: number) => void;
  seniorityMonths: number;
  setSeniorityMonths: (val: number) => void;
  refMonths: number;
  setRefMonths: (val: number) => void;
  
  // Reference overrides
  baseMonthlyInput: number;
  setBaseMonthlyInput: (val: number) => void;
  legalRefMonthlyInput: number;
  setLegalRefMonthlyInput: (val: number) => void;
  extraRefMonthlyInput: number;
  setExtraRefMonthlyInput: (val: number) => void;

  // Extra legal parameters
  isManualMultiplier: boolean;
  setIsManualMultiplier: (val: boolean) => void;
  extraMultiplier: number;
  setExtraMultiplier: (val: number) => void;
  extraMinMonths?: number;
  setExtraMinMonths?: (val: number) => void;
  isManualFloor: boolean;
  setIsManualFloor: (val: boolean) => void;
  legalExtraFloor: number;
  setLegalExtraFloor: (val: number) => void;
  legalExtraCeiling: number;
  setLegalExtraCeiling: (val: number) => void;

  // Reclassement & Congé
  reclassPreavisMonths: number;
  setReclassPreavisMonths: (val: number) => void;
  reclassPreavisRate: number;
  setReclassPreavisRate: (val: number) => void;
  reclassPreavisUsed: number;
  setReclassPreavisUsed: (val: number) => void;
  reclassLeaveMonths: number;
  setReclassLeaveMonths: (val: number) => void;
  reclassLeaveRate: number;
  setReclassLeaveRate: (val: number) => void;
  reclassLeaveUsed: number;
  setReclassLeaveUsed: (val: number) => void;
  reclassReducedRate: number;
  setReclassReducedRate: (val: number) => void;

  // Social Charges
  leaveCSGCRDSRate: number;
  setLeaveCSGCRDSRate: (val: number) => void;
  leavePrevoyanceRate: number;
  setLeavePrevoyanceRate: (val: number) => void;
  leaveMutuelleRate: number;
  setLeaveMutuelleRate: (val: number) => void;
  leaveRetraiteTARate: number;
  setLeaveRetraiteTARate: (val: number) => void;
  leaveRetraiteTBRate: number;
  setLeaveRetraiteTBRate: (val: number) => void;
  leaveCETRate: number;
  setLeaveCETRate: (val: number) => void;

  // Legal fractions
  illFracFirst: number;
  setIllFracFirst: (val: number) => void;
  illFracAfter: number;
  setIllFracAfter: (val: number) => void;
  iclFracFirst: number;
  setIclFracFirst: (val: number) => void;
  iclFracAfter: number;
  setIclFracAfter: (val: number) => void;

  // Primes
  trainingBonusEnabled: boolean;
  setTrainingBonusEnabled: (val: boolean) => void;
  trainingBonus: number;
  setTrainingBonus: (val: number) => void;
  businessCreationBonusEnabled: boolean;
  setBusinessCreationBonusEnabled: (val: boolean) => void;
  businessCreationBonus: number;
  setBusinessCreationBonus: (val: number) => void;

  // Suggested values
  autoFloor: number;
  autoMultiplier: number;
  formatCurrency: (val: number) => string;
}

export default function CalculatorForm({
  annualGross,
  setAnnualGross,
  incomeTaxRate,
  setIncomeTaxRate,
  seniorityYears,
  setSeniorityYears,
  seniorityMonths,
  setSeniorityMonths,
  refMonths,
  setRefMonths,
  baseMonthlyInput,
  setBaseMonthlyInput,
  legalRefMonthlyInput,
  setLegalRefMonthlyInput,
  extraRefMonthlyInput,
  setExtraRefMonthlyInput,
  isManualMultiplier,
  setIsManualMultiplier,
  extraMultiplier,
  setExtraMultiplier,
  isManualFloor,
  setIsManualFloor,
  legalExtraFloor,
  setLegalExtraFloor,
  legalExtraCeiling,
  setLegalExtraCeiling,
  reclassPreavisMonths,
  setReclassPreavisMonths,
  reclassPreavisRate,
  setReclassPreavisRate,
  reclassPreavisUsed,
  setReclassPreavisUsed,
  reclassLeaveMonths,
  setReclassLeaveMonths,
  reclassLeaveRate,
  setReclassLeaveRate,
  reclassLeaveUsed,
  setReclassLeaveUsed,
  reclassReducedRate,
  setReclassReducedRate,
  leaveCSGCRDSRate,
  setLeaveCSGCRDSRate,
  leavePrevoyanceRate,
  setLeavePrevoyanceRate,
  leaveMutuelleRate,
  setLeaveMutuelleRate,
  leaveRetraiteTARate,
  setLeaveRetraiteTARate,
  leaveRetraiteTBRate,
  setLeaveRetraiteTBRate,
  leaveCETRate,
  setLeaveCETRate,
  illFracFirst,
  setIllFracFirst,
  illFracAfter,
  setIllFracAfter,
  iclFracFirst,
  setIclFracFirst,
  iclFracAfter,
  setIclFracAfter,
  trainingBonusEnabled,
  setTrainingBonusEnabled,
  trainingBonus,
  setTrainingBonus,
  businessCreationBonusEnabled,
  setBusinessCreationBonusEnabled,
  businessCreationBonus,
  setBusinessCreationBonus,
  autoFloor,
  autoMultiplier,
  formatCurrency,
}: CalculatorFormProps) {
  const { t } = useLanguage();
  const [openSection, setOpenSection] = useState<string | null>('base');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all";
  const smallInputClass = "w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none transition-all";

  return (
    <div className="flex flex-col gap-4">
      
      {/* 1. SECTION: DONNÉES DE BASE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('base')}
          className="w-full flex items-center justify-between p-5 font-bold text-left hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">{t('section_base')}</h2>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{t('section_base_desc')}</p>
            </div>
          </div>
          {openSection === 'base' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {openSection === 'base' && (
          <div className="p-5 border-t border-slate-200 dark:border-slate-800/60 flex flex-col gap-5 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {t('annual_gross')}
                </label>
                <input
                  type="number"
                  value={annualGross || ''}
                  onChange={(e) => setAnnualGross(Number(e.target.value))}
                  placeholder="Ex: 48000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {t('seniority_years')}
                </label>
                <input
                  type="number"
                  min="0"
                  value={seniorityYears}
                  onChange={(e) => setSeniorityYears(Math.max(0, Number(e.target.value)))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {t('seniority_months')}
                </label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={seniorityMonths}
                  onChange={(e) => setSeniorityMonths(Math.max(0, Math.min(11, Number(e.target.value))))}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {t('ref_months')}
                </label>
                <input
                  type="number"
                  min="1"
                  value={refMonths}
                  onChange={(e) => setRefMonths(Math.max(1, Number(e.target.value)))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {t('income_tax_rate')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={incomeTaxRate || ''}
                    onChange={(e) => setIncomeTaxRate(Number(e.target.value))}
                    className={inputClass}
                  />
                  <Percent className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Overrides */}
            <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col gap-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                {t('override_title')}
                <span title={t('override_desc')} className="cursor-help flex items-center">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                </span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t('base_preavis')}</label>
                  <input
                    type="number"
                    value={baseMonthlyInput || ''}
                    onChange={(e) => setBaseMonthlyInput(Number(e.target.value))}
                    placeholder={formatCurrency(annualGross / refMonths)}
                    className={smallInputClass}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t('ref_1_legal_leave')}</label>
                  <input
                    type="number"
                    value={legalRefMonthlyInput || ''}
                    onChange={(e) => setLegalRefMonthlyInput(Number(e.target.value))}
                    placeholder={formatCurrency(annualGross / refMonths)}
                    className={smallInputClass}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t('ref_2_extra_legal')}</label>
                  <input
                    type="number"
                    value={extraRefMonthlyInput || ''}
                    onChange={(e) => setExtraRefMonthlyInput(Number(e.target.value))}
                    placeholder={formatCurrency(annualGross / refMonths)}
                    className={smallInputClass}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. SECTION: INDEMNITÉ EXTRA-LÉGALE & PRIMES */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('extra')}
          className="w-full flex items-center justify-between p-5 font-bold text-left hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">{t('section_extra')}</h2>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{t('section_extra_desc')}</p>
            </div>
          </div>
          {openSection === 'extra' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {openSection === 'extra' && (
          <div className="p-5 border-t border-slate-200 dark:border-slate-800/60 flex flex-col gap-5 animate-slide-up">
            
            {/* Rules */}
            <div className="p-4 rounded-xl bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100/60 dark:border-indigo-900/30 text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-1.5">
              <div className="font-bold text-slate-700 dark:text-slate-300">{t('rule_casino')}</div>
              <p>{t('rule_casino_multiplier')}</p>
              <p className="pl-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                {t('rule_casino_multiplier_detail')}
              </p>
              <p>{t('rule_casino_floors')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {t('multiplier_pdv')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={extraMultiplier || ''}
                    onChange={(e) => {
                      setExtraMultiplier(Number(e.target.value));
                      setIsManualMultiplier(true);
                    }}
                    className={`${inputClass} ${isManualMultiplier ? 'border-amber-400 dark:border-amber-500' : ''}`}
                  />
                  {isManualMultiplier && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                  )}
                </div>
                <small className="block mt-1 text-[10px] font-semibold text-slate-400">
                  {isManualMultiplier ? (
                    <button onClick={() => setIsManualMultiplier(false)} className="text-amber-500 hover:underline">
                      {t('multiplier_manual_btn', autoMultiplier)}
                    </button>
                  ) : (
                    t('multiplier_auto_lbl', autoMultiplier)
                  )}
                </small>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {t('floor_label')}
                </label>
                <input
                  type="number"
                  value={legalExtraFloor || ''}
                  onChange={(e) => {
                    setLegalExtraFloor(Number(e.target.value));
                    setIsManualFloor(true);
                  }}
                  className={`${inputClass} ${isManualFloor ? 'border-amber-400 dark:border-amber-500' : ''}`}
                />
                <small className="block mt-1 text-[10px] font-semibold text-slate-400">
                  {isManualFloor ? (
                    <button onClick={() => setIsManualFloor(false)} className="text-amber-500 hover:underline">
                      {t('floor_manual_btn', formatCurrency(autoFloor))}
                    </button>
                  ) : (
                    t('floor_auto_lbl', formatCurrency(autoFloor))
                  )}
                </small>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {t('ceiling_label')}
                </label>
                <input
                  type="number"
                  value={legalExtraCeiling || ''}
                  onChange={(e) => setLegalExtraCeiling(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Optional Bonuses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={trainingBonusEnabled}
                    onChange={(e) => setTrainingBonusEnabled(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <div>
                    <span className="text-sm font-semibold block text-slate-800 dark:text-slate-200">{t('training_bonus')}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{t('training_bonus_desc')}</span>
                  </div>
                </label>
                {trainingBonusEnabled && (
                  <input
                    type="number"
                    value={trainingBonus}
                    onChange={(e) => setTrainingBonus(Number(e.target.value))}
                    className="mt-3 w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={businessCreationBonusEnabled}
                    onChange={(e) => setBusinessCreationBonusEnabled(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <div>
                    <span className="text-sm font-semibold block text-slate-800 dark:text-slate-200">{t('business_creation_bonus')}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{t('business_creation_bonus_desc')}</span>
                  </div>
                </label>
                {businessCreationBonusEnabled && (
                  <input
                    type="number"
                    value={businessCreationBonus}
                    onChange={(e) => setBusinessCreationBonus(Number(e.target.value))}
                    className="mt-3 w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. SECTION: CONGÉ DE RECLASSEMENT */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('reclass')}
          className="w-full flex items-center justify-between p-5 font-bold text-left hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">{t('section_reclass')}</h2>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{t('section_reclass_desc')}</p>
            </div>
          </div>
          {openSection === 'reclass' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {openSection === 'reclass' && (
          <div className="p-5 border-t border-slate-200 dark:border-slate-800/60 flex flex-col gap-6 animate-slide-up">
            
            {/* Pré-avis */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800/60 pb-1 text-indigo-500">{t('preavis')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">{t('duration_months')}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={reclassPreavisMonths}
                    onChange={(e) => setReclassPreavisMonths(Number(e.target.value))}
                    className={smallInputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">{t('rate_percent')}</label>
                  <input
                    type="number"
                    value={reclassPreavisRate}
                    onChange={(e) => setReclassPreavisRate(Number(e.target.value))}
                    className={smallInputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">{t('consumed_months')}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={reclassPreavisUsed}
                    onChange={(e) => setReclassPreavisUsed(Number(e.target.value))}
                    className={smallInputClass}
                  />
                </div>
              </div>
            </div>

            {/* Congé de reclassement */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800/60 pb-1 text-pink-500">{t('leave_title')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">{t('total_duration_months')}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={reclassLeaveMonths}
                    onChange={(e) => setReclassLeaveMonths(Number(e.target.value))}
                    className={smallInputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">{t('rate_percent')}</label>
                  <input
                    type="number"
                    value={reclassLeaveRate}
                    onChange={(e) => setReclassLeaveRate(Number(e.target.value))}
                    className={smallInputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">{t('reduced_rate_percent')}</label>
                  <input
                    type="number"
                    value={reclassReducedRate}
                    onChange={(e) => setReclassReducedRate(Number(e.target.value))}
                    className={smallInputClass}
                  />
                </div>
              </div>

              {/* Slider UI */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  {t('conducted_leave_title')} <span className="text-pink-500 text-sm font-extrabold">{t('conducted_leave_val', reclassLeaveUsed)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max={reclassLeaveMonths}
                  step="0.5"
                  value={reclassLeaveUsed}
                  onChange={(e) => setReclassLeaveUsed(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-500 mt-2 font-mono">
                  <span>0 mos</span>
                  <span>Max: {reclassLeaveMonths} mos</span>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {reclassLeaveUsed > 0 && t('conducted_leave_summary', reclassLeaveUsed, reclassLeaveRate)}
                  {reclassLeaveMonths - reclassLeaveUsed > 0 && t('remaining_leave_summary', (reclassLeaveMonths - reclassLeaveUsed).toFixed(1), (reclassLeaveRate * reclassReducedRate / 100).toFixed(0))}
                </p>
              </div>
            </div>

            {/* Social Contributions Rates */}
            <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                {t('social_charges_title')}
                <span title={t('social_charges_desc')} className="cursor-help flex items-center">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                </span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500">CSG/CRDS (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={leaveCSGCRDSRate}
                    onChange={(e) => setLeaveCSGCRDSRate(Number(e.target.value))}
                    className="w-full px-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500">Prévoyance (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={leavePrevoyanceRate}
                    onChange={(e) => setLeavePrevoyanceRate(Number(e.target.value))}
                    className="w-full px-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500">Mutuelle (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={leaveMutuelleRate}
                    onChange={(e) => setLeaveMutuelleRate(Number(e.target.value))}
                    className="w-full px-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500">Retraite TA (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={leaveRetraiteTARate}
                    onChange={(e) => setLeaveRetraiteTARate(Number(e.target.value))}
                    className="w-full px-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500">Retraite TB (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={leaveRetraiteTBRate}
                    onChange={(e) => setLeaveRetraiteTBRate(Number(e.target.value))}
                    className="w-full px-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500">CET (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={leaveCETRate}
                    onChange={(e) => setLeaveCETRate(Number(e.target.value))}
                    className="w-full px-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. SECTION: FRACTIONS */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('fractions')}
          className="w-full flex items-center justify-between p-5 font-bold text-left hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">{t('section_fractions')}</h2>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{t('section_fractions_desc')}</p>
            </div>
          </div>
          {openSection === 'fractions' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {openSection === 'fractions' && (
          <div className="p-5 border-t border-slate-200 dark:border-slate-800/60 flex flex-col gap-5 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* ILL */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800/60 pb-1 text-cyan-600 dark:text-cyan-450">{t('ill_title')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t('months_per_year_under_10')}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={illFracFirst}
                      onChange={(e) => setIllFracFirst(Number(e.target.value))}
                      className={smallInputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t('months_per_year_over_10')}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={illFracAfter}
                      onChange={(e) => setIllFracAfter(Number(e.target.value))}
                      className={smallInputClass}
                    />
                  </div>
                </div>
              </div>

              {/* ICL */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800/60 pb-1 text-indigo-500">{t('icl_title')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t('months_per_year_under_10')}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={iclFracFirst}
                      onChange={(e) => setIclFracFirst(Number(e.target.value))}
                      className={smallInputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t('months_per_year_over_10')}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={iclFracAfter}
                      onChange={(e) => setIclFracAfter(Number(e.target.value))}
                      className={smallInputClass}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
