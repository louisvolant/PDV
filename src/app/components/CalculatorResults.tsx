// src/app/components/CalculatorResults.tsx
'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CalculationResult } from '@/lib/calculations';
import { HelpCircle } from 'lucide-react';

interface CalculatorResultsProps {
  results: CalculationResult | null;
  formatCurrency: (val: number) => string;
}

export default function CalculatorResults({
  results,
  formatCurrency,
}: CalculatorResultsProps) {
  const { t } = useLanguage();
  const [resultTab, setResultTab] = useState<'summary' | 'reclass' | 'taxes'>('summary');

  if (!results) {
    return null;
  }

  // Helper to choose background for tab selection
  const tabBtnClass = (active: boolean) =>
    `flex-1 py-2.5 text-center rounded-lg text-xs font-bold transition-all focus:outline-none ${
      active
        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
    }`;

  const detailItemClass = "flex justify-between items-baseline text-sm";
  const labelClass = "font-semibold text-slate-700 dark:text-slate-350";
  const valClass = "font-bold text-slate-950 dark:text-slate-50 font-mono";
  const descClass = "text-[11px] text-slate-450 dark:text-slate-450 leading-relaxed pl-3.5 border-l border-slate-200 dark:border-slate-800 mt-1";

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur shadow-xl overflow-hidden flex flex-col animate-slide-up">
      
      {/* Widget Header */}
      <div className="bg-slate-50 dark:bg-slate-900/60 px-5 py-4 border-b border-slate-200/80 dark:border-slate-850/60 flex items-center justify-between">
        <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{t('estimated_amounts')}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-150/40 dark:border-indigo-900/40">
          PROT_V1.1
        </span>
      </div>

      {/* Hero numbers */}
      <div className="grid grid-cols-1 gap-px bg-slate-200 dark:bg-slate-800/60">
        
        {/* Gross Amount */}
        <div className="bg-white dark:bg-slate-900/20 p-5 flex flex-col">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            {t('hero_gross')}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 font-mono">
              {formatCurrency(results.totalIndemnitesBrut)}
            </span>
            {results.legalExtraSum !== results.legalExtraAdjusted && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {results.legalExtraSum < results.legalExtraAdjusted ? t('floor_applied') : t('ceiling_applied')}
              </span>
            )}
          </div>
        </div>

        {/* Net Amount */}
        <div className="bg-white dark:bg-slate-900/20 p-5 flex flex-col border-t border-slate-100 dark:border-slate-850">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            {t('hero_net')}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
              {formatCurrency(results.totalIndemnitesNet)}
            </span>
            <span className="text-[10px] font-bold text-slate-450">
              {t('csg_deducted', formatCurrency(Math.max(results.legalExtraAdjusted - results.legal.amount, 0) * 0.097))}
            </span>
          </div>
        </div>

        {/* Net Net (Pocket Net) */}
        <div className="bg-white dark:bg-slate-900/20 p-5 flex flex-col border-t border-slate-100 dark:border-slate-850">
          <span className="text-xs font-bold text-emerald-500/95 dark:text-emerald-400/95 uppercase tracking-wider">
            {t('hero_net_net')}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {formatCurrency(results.totalIndemnitesNetNet)}
            </span>
            <span className="text-[10px] font-bold text-slate-450">
              {t('exempt_tax')}
            </span>
          </div>
        </div>

      </div>

      {/* Tabs Menu */}
      <div className="flex border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-1">
        <button
          onClick={() => setResultTab('summary')}
          className={tabBtnClass(resultTab === 'summary')}
        >
          {t('tab_summary')}
        </button>
        <button
          onClick={() => setResultTab('reclass')}
          className={tabBtnClass(resultTab === 'reclass')}
        >
          {t('tab_period')}
        </button>
        <button
          onClick={() => setResultTab('taxes')}
          className={tabBtnClass(resultTab === 'taxes')}
        >
          {t('tab_taxes')}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-5 flex-1 min-h-[290px] bg-white dark:bg-slate-900/10">
        
        {/* SUMMARY TAB PANEL */}
        {resultTab === 'summary' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              
              <div className="flex flex-col">
                <div className={detailItemClass}>
                  <span className={labelClass}>{t('legal_conv_indemnity')}</span>
                  <span className={valClass}>{formatCurrency(results.legal.amount)}</span>
                </div>
                <p className={descClass}>{results.legal.detail}</p>
              </div>

              <div className="flex flex-col">
                <div className={detailItemClass}>
                  <span className={labelClass}>{t('extra_legal_indemnity')}</span>
                  <span className={valClass}>{formatCurrency(results.extraAdjusted)}</span>
                </div>
                <p className={descClass}>
                  {results.extraRaw.detail} 
                  {results.legalExtraSum !== results.legalExtraAdjusted && t('adjusted_sum')}
                </p>
              </div>

              <div className="flex flex-col">
                <div className={detailItemClass}>
                  <span className={labelClass}>{t('reclassification_leave')}</span>
                  <span className={valClass}>{formatCurrency(results.reclass.amount)}</span>
                </div>
                <p className={descClass}>{results.reclass.detail}</p>
              </div>

              {results.primesNet > 0 && (
                <div className="flex flex-col">
                  <div className={detailItemClass}>
                    <span className={labelClass}>{t('optional_bonuses')}</span>
                    <span className={valClass}>{formatCurrency(results.primesNet)}</span>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-3.5 border-t border-dashed border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-slate-500 dark:text-slate-450 text-xs">{t('global_total_gross')}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-xs">{formatCurrency(results.totalBrut)}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{t('global_total_net')}</span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 font-mono text-sm">{formatCurrency(results.totalNet)}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{t('global_total_net_net')}</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono text-sm">{formatCurrency(results.totalNetNet)}</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* PERIOD TAB PANEL */}
        {resultTab === 'reclass' && (
          <div className="flex flex-col gap-5 animate-slide-up text-sm text-slate-600 dark:text-slate-400">
            <h3 className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {t('period_total_value')}
            </h3>

            {/* Pré-avis Section */}
            <div className="p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/10 flex flex-col gap-2">
              <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800/60 pb-1.5 mb-1.5">
                <span className="font-extrabold text-slate-800 dark:text-slate-200">{t('preavis')}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-mono">
                  {t('duration')}: {results.reclass.preavisMonths} mois
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>{t('gross')} :</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{formatCurrency(results.preavisPeriodBrut)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>{t('net')} :</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{formatCurrency(results.preavisPeriodNet)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>{t('net_net')} :</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{formatCurrency(results.preavisPeriodNetNet)}</span>
              </div>
              <div className="flex justify-between text-[11px] pt-1 border-t border-slate-150/40 dark:border-slate-800/40 mt-1">
                <span>{t('monthly')} :</span>
                <span className="font-semibold text-slate-500 font-mono">
                  {results.reclass.preavisMonths > 0
                    ? t(
                        'monthly_detail',
                        formatCurrency(results.preavisPeriodBrut / results.reclass.preavisMonths),
                        formatCurrency(results.preavisPeriodNet / results.reclass.preavisMonths),
                        formatCurrency(results.preavisPeriodNetNet / results.reclass.preavisMonths)
                      )
                    : '—'}
                </span>
              </div>
            </div>

            {/* Congé de reclassement Section */}
            <div className="p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/10 flex flex-col gap-4">
              <div className="flex flex-col border-b border-slate-150 dark:border-slate-800/60 pb-1.5 mb-0.5">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{t('leave_title')}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 font-mono">
                    {t('duration')}: {results.reclass.leaveMonths} mois
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 font-semibold">
                  {t('repartition')} : {results.reclass.leaveMonths - results.reclass.leaveRemaining} {t('conducted_leave_months').toLowerCase()} + {results.reclass.leaveRemaining} {t('paid_leave_months').toLowerCase()}
                </span>
              </div>

              {/* Sub-block: Effectués */}
              <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-pink-500">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350">
                  {t('conducted_desc', results.reclass.leaveMonths - results.reclass.leaveRemaining)}
                </span>
                <div className="flex justify-between text-xs">
                  <span>{t('gross')} :</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{formatCurrency(results.leaveEffectuesBrut)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>{t('net')} :</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{formatCurrency(results.leaveEffectuesNet)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>{t('net_net')} :</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{formatCurrency(results.leaveEffectuesNetNet)}</span>
                </div>
                <div className="flex justify-between text-[11px] pt-1 border-t border-slate-150/40 dark:border-slate-800/40 mt-1">
                  <span>{t('monthly')} :</span>
                  <span className="font-semibold text-slate-500 font-mono">
                    {results.reclass.leaveMonths - results.reclass.leaveRemaining > 0
                      ? t(
                          'monthly_detail',
                          formatCurrency(results.leaveEffectuesBrut / (results.reclass.leaveMonths - results.reclass.leaveRemaining)),
                          formatCurrency(results.leaveEffectuesNet / (results.reclass.leaveMonths - results.reclass.leaveRemaining)),
                          formatCurrency(results.leaveEffectuesNetNet / (results.reclass.leaveMonths - results.reclass.leaveRemaining))
                        )
                      : '—'}
                  </span>
                </div>
              </div>

              {/* Sub-block: Non Effectués */}
              <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-slate-300 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350">
                  {t('unconducted_desc', results.reclass.leaveRemaining)}
                </span>
                <div className="flex justify-between text-xs">
                  <span>{t('gross')} :</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{formatCurrency(results.leaveNonEffectuesBrut)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>{t('net')} :</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{formatCurrency(results.leaveNonEffectuesNet)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>{t('net_net')} :</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{formatCurrency(results.leaveNonEffectuesNetNet)}</span>
                </div>
                <div className="flex justify-between text-[11px] pt-1 border-t border-slate-150/40 dark:border-slate-800/40 mt-1">
                  <span>{t('monthly')} :</span>
                  <span className="font-semibold text-slate-500 font-mono">
                    {results.reclass.leaveRemaining > 0
                      ? t(
                          'monthly_detail',
                          formatCurrency(results.leaveNonEffectuesBrut / results.reclass.leaveRemaining),
                          formatCurrency(results.leaveNonEffectuesNet / results.reclass.leaveRemaining),
                          formatCurrency(results.leaveNonEffectuesNetNet / results.reclass.leaveRemaining)
                        )
                      : '—'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAXES TAB PANEL */}
        {resultTab === 'taxes' && (
          <div className="flex flex-col gap-4 animate-fade-in text-sm font-medium text-slate-600 dark:text-slate-400">
            <div className="flex flex-col gap-3">
              
              <div className="flex flex-col gap-1">
                <span className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-1">
                  {t('social_charges_and_csg')}
                </span>
                
                <div className="flex justify-between text-xs">
                  <span>{t('extra_legal_net_detail')}</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {formatCurrency(results.extraNet)} <span className="text-[10px] font-normal text-slate-400">({t('extra_legal_gross_detail')}: {formatCurrency(results.extraAdjusted)})</span>
                  </span>
                </div>

                <div className="flex justify-between text-xs mt-1">
                  <span>{t('preavis_net_detail')}</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {formatCurrency(results.preavisNet)} <span className="text-[10px] font-normal text-slate-400">({t('preavis_gross_detail')}: {formatCurrency(results.reclass.preavisAmountBrut)})</span>
                  </span>
                </div>

                <div className="flex justify-between text-xs mt-1">
                  <span>{t('leave_net_detail')}</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {formatCurrency(results.leaveNet)} <span className="text-[10px] font-normal text-slate-400">({t('leave_gross_detail')}: {formatCurrency(results.reclass.leaveAmountBrut)})</span>
                  </span>
                </div>

                <div className="flex justify-between text-xs mt-1 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                  <span>{t('charges_on_leave')} ({results.reclass.leaveCSGCRDS > 0 ? 'CSG + Cotis' : 'N/A'})</span>
                  <span className="font-bold text-red-500 font-mono">
                    -{formatCurrency(results.reclass.leaveTotalCharges)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-1">
                  {t('income_tax_ir')}
                </span>
                
                <div className="flex justify-between text-xs">
                  <span>{t('taxable_base')} <span className="text-[10px] font-normal text-slate-400">(Préavis + Congé + Primes)</span></span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {formatCurrency(results.taxableAmount)}
                  </span>
                </div>

                <div className="flex justify-between text-xs mt-1">
                  <span>{t('tax_withheld')} ({results.incomeTaxDeducted > 0 ? `${(results.incomeTaxDeducted / results.taxableAmount * 100).toFixed(1)}% eff.` : '0%'})</span>
                  <span className="font-bold text-red-500 font-mono">
                    -{formatCurrency(results.incomeTaxDeducted)}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  {t('pocket_net')}
                </span>
                <span className="font-extrabold text-base text-emerald-600 dark:text-emerald-400 font-mono">
                  {formatCurrency(results.totalNetNet)}
                </span>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
