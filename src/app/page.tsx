// src/app/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  runCalculation,
  getFloorBySeniority,
  getMultiplierBySeniority,
} from '@/lib/calculations';
import CalculatorForm from './components/CalculatorForm';
import CalculatorResults from './components/CalculatorResults';

export default function Home() {
  const { t, language } = useLanguage();

  // Input states - Données de base
  const [annualGross, setAnnualGross] = useState<number>(48000);
  const [seniorityYears, setSeniorityYears] = useState<number>(8);
  const [seniorityMonths, setSeniorityMonths] = useState<number>(0);
  const [refMonths, setRefMonths] = useState<number>(12);
  const [incomeTaxRate, setIncomeTaxRate] = useState<number>(14.5);
  
  // Reference salary overrides
  const [baseMonthlyInput, setBaseMonthlyInput] = useState<number>(0);
  const [legalRefMonthlyInput, setLegalRefMonthlyInput] = useState<number>(0);
  const [extraRefMonthlyInput, setExtraRefMonthlyInput] = useState<number>(0);

  // Reclassement & Congé
  const [reclassPreavisMonths, setReclassPreavisMonths] = useState<number>(3);
  const [reclassPreavisRate, setReclassPreavisRate] = useState<number>(100);
  const [reclassPreavisUsed, setReclassPreavisUsed] = useState<number>(0);
  const [reclassLeaveMonths, setReclassLeaveMonths] = useState<number>(9);
  const [reclassLeaveRate, setReclassLeaveRate] = useState<number>(80);
  const [reclassLeaveUsed, setReclassLeaveUsed] = useState<number>(0);
  const [reclassReducedRate, setReclassReducedRate] = useState<number>(80);

  // Social Charges
  const [leaveCSGCRDSRate, setLeaveCSGCRDSRate] = useState<number>(6.7);
  const [leavePrevoyanceRate, setLeavePrevoyanceRate] = useState<number>(0.8);
  const [leaveMutuelleRate, setLeaveMutuelleRate] = useState<number>(0);
  const [leaveRetraiteTARate, setLeaveRetraiteTARate] = useState<number>(4.9);
  const [leaveRetraiteTBRate, setLeaveRetraiteTBRate] = useState<number>(9.7);
  const [leaveCETRate, setLeaveCETRate] = useState<number>(0.1);

  // Extra legal parameters
  const [isManualMultiplier, setIsManualMultiplier] = useState<boolean>(false);
  const [extraMultiplier, setExtraMultiplier] = useState<number>(1.0);
  const [extraMinMonths, setExtraMinMonths] = useState<number>(0);
  
  const [isManualFloor, setIsManualFloor] = useState<boolean>(false);
  const [legalExtraFloor, setLegalExtraFloor] = useState<number>(90000);
  const [legalExtraCeiling, setLegalExtraCeiling] = useState<number>(300000);

  // Legal fractions
  const [illFracFirst, setIllFracFirst] = useState<number>(0.25);
  const [illFracAfter, setIllFracAfter] = useState<number>(0.33);
  const [iclFracFirst, setIclFracFirst] = useState<number>(0.25);
  const [iclFracAfter, setIclFracAfter] = useState<number>(0.33);

  // Primes
  const [trainingBonusEnabled, setTrainingBonusEnabled] = useState<boolean>(false);
  const [trainingBonus, setTrainingBonus] = useState<number>(10000);
  const [businessCreationBonusEnabled, setBusinessCreationBonusEnabled] = useState<boolean>(false);
  const [businessCreationBonus, setBusinessCreationBonus] = useState<number>(20000);

  // Derived Seniority / Calculations
  const totalYears = useMemo(() => {
    return seniorityYears + seniorityMonths / 12;
  }, [seniorityYears, seniorityMonths]);

  const autoFloor = useMemo(() => {
    return getFloorBySeniority(totalYears);
  }, [totalYears]);

  const autoMultiplier = useMemo(() => {
    return getMultiplierBySeniority(totalYears);
  }, [totalYears]);

  // Sync automatic suggested values if user has not edited them
  useEffect(() => {
    if (!isManualFloor) {
      setLegalExtraFloor(autoFloor);
    }
  }, [autoFloor, isManualFloor]);

  useEffect(() => {
    if (!isManualMultiplier) {
      setExtraMultiplier(autoMultiplier);
    }
  }, [autoMultiplier, isManualMultiplier]);

  // Load states from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pdv_calculator_inputs');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.annualGross !== undefined) setAnnualGross(data.annualGross);
        if (data.incomeTaxRate !== undefined) setIncomeTaxRate(data.incomeTaxRate);
        if (data.seniorityYears !== undefined) setSeniorityYears(data.seniorityYears);
        if (data.seniorityMonths !== undefined) setSeniorityMonths(data.seniorityMonths);
        if (data.refMonths !== undefined) setRefMonths(data.refMonths);
        if (data.baseMonthlyInput !== undefined) setBaseMonthlyInput(data.baseMonthlyInput);
        if (data.legalRefMonthlyInput !== undefined) setLegalRefMonthlyInput(data.legalRefMonthlyInput);
        if (data.extraRefMonthlyInput !== undefined) setExtraRefMonthlyInput(data.extraRefMonthlyInput);
        if (data.reclassPreavisMonths !== undefined) setReclassPreavisMonths(data.reclassPreavisMonths);
        if (data.reclassPreavisRate !== undefined) setReclassPreavisRate(data.reclassPreavisRate);
        if (data.reclassPreavisUsed !== undefined) setReclassPreavisUsed(data.reclassPreavisUsed);
        if (data.reclassLeaveMonths !== undefined) setReclassLeaveMonths(data.reclassLeaveMonths);
        if (data.reclassLeaveRate !== undefined) setReclassLeaveRate(data.reclassLeaveRate);
        if (data.reclassLeaveUsed !== undefined) setReclassLeaveUsed(data.reclassLeaveUsed);
        if (data.reclassReducedRate !== undefined) setReclassReducedRate(data.reclassReducedRate);
        if (data.leaveCSGCRDSRate !== undefined) setLeaveCSGCRDSRate(data.leaveCSGCRDSRate);
        if (data.leavePrevoyanceRate !== undefined) setLeavePrevoyanceRate(data.leavePrevoyanceRate);
        if (data.leaveMutuelleRate !== undefined) setLeaveMutuelleRate(data.leaveMutuelleRate);
        if (data.leaveRetraiteTARate !== undefined) setLeaveRetraiteTARate(data.leaveRetraiteTARate);
        if (data.leaveRetraiteTBRate !== undefined) setLeaveRetraiteTBRate(data.leaveRetraiteTBRate);
        if (data.leaveCETRate !== undefined) setLeaveCETRate(data.leaveCETRate);
        if (data.isManualMultiplier !== undefined) setIsManualMultiplier(data.isManualMultiplier);
        if (data.extraMultiplier !== undefined) setExtraMultiplier(data.extraMultiplier);
        if (data.extraMinMonths !== undefined) setExtraMinMonths(data.extraMinMonths);
        if (data.isManualFloor !== undefined) setIsManualFloor(data.isManualFloor);
        if (data.legalExtraFloor !== undefined) setLegalExtraFloor(data.legalExtraFloor);
        if (data.legalExtraCeiling !== undefined) setLegalExtraCeiling(data.legalExtraCeiling);
        if (data.illFracFirst !== undefined) setIllFracFirst(data.illFracFirst);
        if (data.illFracAfter !== undefined) setIllFracAfter(data.illFracAfter);
        if (data.iclFracFirst !== undefined) setIclFracFirst(data.iclFracFirst);
        if (data.iclFracAfter !== undefined) setIclFracAfter(data.iclFracAfter);
        if (data.trainingBonusEnabled !== undefined) setTrainingBonusEnabled(data.trainingBonusEnabled);
        if (data.trainingBonus !== undefined) setTrainingBonus(data.trainingBonus);
        if (data.businessCreationBonusEnabled !== undefined) setBusinessCreationBonusEnabled(data.businessCreationBonusEnabled);
        if (data.businessCreationBonus !== undefined) setBusinessCreationBonus(data.businessCreationBonus);
      }
    } catch (e) {
      console.error('Failed to load inputs from localStorage', e);
    }
  }, []);

  // Save states to localStorage on state changes
  useEffect(() => {
    try {
      const data = {
        annualGross,
        incomeTaxRate,
        seniorityYears,
        seniorityMonths,
        refMonths,
        baseMonthlyInput,
        legalRefMonthlyInput,
        extraRefMonthlyInput,
        reclassPreavisMonths,
        reclassPreavisRate,
        reclassPreavisUsed,
        reclassLeaveMonths,
        reclassLeaveRate,
        reclassLeaveUsed,
        reclassReducedRate,
        leaveCSGCRDSRate,
        leavePrevoyanceRate,
        leaveMutuelleRate,
        leaveRetraiteTARate,
        leaveRetraiteTBRate,
        leaveCETRate,
        isManualMultiplier,
        extraMultiplier,
        extraMinMonths,
        isManualFloor,
        legalExtraFloor,
        legalExtraCeiling,
        illFracFirst,
        illFracAfter,
        iclFracFirst,
        iclFracAfter,
        trainingBonusEnabled,
        trainingBonus,
        businessCreationBonusEnabled,
        businessCreationBonus,
      };
      localStorage.setItem('pdv_calculator_inputs', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save inputs to localStorage', e);
    }
  }, [
    annualGross,
    incomeTaxRate,
    seniorityYears,
    seniorityMonths,
    refMonths,
    baseMonthlyInput,
    legalRefMonthlyInput,
    extraRefMonthlyInput,
    reclassPreavisMonths,
    reclassPreavisRate,
    reclassPreavisUsed,
    reclassLeaveMonths,
    reclassLeaveRate,
    reclassLeaveUsed,
    reclassReducedRate,
    leaveCSGCRDSRate,
    leavePrevoyanceRate,
    leaveMutuelleRate,
    leaveRetraiteTARate,
    leaveRetraiteTBRate,
    leaveCETRate,
    isManualMultiplier,
    extraMultiplier,
    extraMinMonths,
    isManualFloor,
    legalExtraFloor,
    legalExtraCeiling,
    illFracFirst,
    illFracAfter,
    iclFracFirst,
    iclFracAfter,
    trainingBonusEnabled,
    trainingBonus,
    businessCreationBonusEnabled,
    businessCreationBonus,
  ]);

  // Keep leave used clamped under leave months
  const activeLeaveUsed = useMemo(() => {
    return Math.min(reclassLeaveUsed, reclassLeaveMonths);
  }, [reclassLeaveUsed, reclassLeaveMonths]);

  // Run calculation reactively
  const results = useMemo(() => {
    if (annualGross <= 0 || seniorityYears < 0 || seniorityMonths < 0) {
      return null;
    }
    
    return runCalculation({
      annualGross,
      seniorityYears,
      seniorityMonths,
      refMonths,
      incomeTaxRate,
      illFracFirst,
      illFracAfter,
      iclFracFirst,
      iclFracAfter,
      extraMultiplier: extraMultiplier,
      extraMinMonths,
      legalExtraFloor,
      legalExtraCeiling,
      reclassPreavisMonths,
      reclassPreavisRate,
      reclassPreavisUsed,
      reclassLeaveMonths,
      reclassLeaveRate,
      reclassLeaveUsed: activeLeaveUsed,
      reclassReducedRate,
      leaveCSGCRDSRate,
      leavePrevoyanceRate,
      leaveMutuelleRate,
      leaveRetraiteTARate,
      leaveRetraiteTBRate,
      leaveCETRate,
      trainingBonus: trainingBonusEnabled ? trainingBonus : 0,
      businessCreationBonus: businessCreationBonusEnabled ? businessCreationBonus : 0,
      baseMonthlyInput,
      legalRefMonthlyInput,
      extraRefMonthlyInput,
      locale: language,
    });
  }, [
    annualGross,
    seniorityYears,
    seniorityMonths,
    refMonths,
    incomeTaxRate,
    illFracFirst,
    illFracAfter,
    iclFracFirst,
    iclFracAfter,
    extraMultiplier,
    extraMinMonths,
    legalExtraFloor,
    legalExtraCeiling,
    reclassPreavisMonths,
    reclassPreavisRate,
    reclassPreavisUsed,
    reclassLeaveMonths,
    reclassLeaveRate,
    activeLeaveUsed,
    reclassReducedRate,
    leaveCSGCRDSRate,
    leavePrevoyanceRate,
    leaveMutuelleRate,
    leaveRetraiteTARate,
    leaveRetraiteTBRate,
    leaveCETRate,
    trainingBonusEnabled,
    trainingBonus,
    businessCreationBonusEnabled,
    businessCreationBonus,
    baseMonthlyInput,
    legalRefMonthlyInput,
    extraRefMonthlyInput,
    language,
  ]);

  // Reset Handler
  const handleReset = () => {
    setAnnualGross(48000);
    setSeniorityYears(8);
    setSeniorityMonths(0);
    setRefMonths(12);
    setIncomeTaxRate(14.5);
    setBaseMonthlyInput(0);
    setLegalRefMonthlyInput(0);
    setExtraRefMonthlyInput(0);
    setReclassPreavisMonths(3);
    setReclassPreavisRate(100);
    setReclassPreavisUsed(0);
    setReclassLeaveMonths(9);
    setReclassLeaveRate(80);
    setReclassLeaveUsed(0);
    setReclassReducedRate(80);
    setLeaveCSGCRDSRate(6.7);
    setLeavePrevoyanceRate(0.8);
    setLeaveMutuelleRate(0);
    setLeaveRetraiteTARate(4.9);
    setLeaveRetraiteTBRate(9.7);
    setLeaveCETRate(0.1);
    setIsManualMultiplier(false);
    setIsManualFloor(false);
    setExtraMinMonths(0);
    setLegalExtraCeiling(300000);
    setIllFracFirst(0.25);
    setIllFracAfter(0.33);
    setIclFracFirst(0.25);
    setIclFracAfter(0.33);
    setTrainingBonusEnabled(false);
    setTrainingBonus(10000);
    setBusinessCreationBonusEnabled(false);
    setBusinessCreationBonus(20000);
  };

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-6 animate-fade-in">
      
      {/* Page Title & Reset Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
            {t('app_title')}
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-xl font-medium">
            {t('app_subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm transition-all focus:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t('reset')}
          </button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="flex gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 text-amber-900 dark:text-amber-400 text-xs font-semibold leading-relaxed shadow-sm">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500" />
        <div>
          <span className="font-extrabold">{t('indicative_note')}</span> {t('indicative_note_text')}
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7">
          <CalculatorForm
            annualGross={annualGross}
            setAnnualGross={setAnnualGross}
            incomeTaxRate={incomeTaxRate}
            setIncomeTaxRate={setIncomeTaxRate}
            seniorityYears={seniorityYears}
            setSeniorityYears={setSeniorityYears}
            seniorityMonths={seniorityMonths}
            setSeniorityMonths={setSeniorityMonths}
            refMonths={refMonths}
            setRefMonths={setRefMonths}
            baseMonthlyInput={baseMonthlyInput}
            setBaseMonthlyInput={setBaseMonthlyInput}
            legalRefMonthlyInput={legalRefMonthlyInput}
            setLegalRefMonthlyInput={setLegalRefMonthlyInput}
            extraRefMonthlyInput={extraRefMonthlyInput}
            setExtraRefMonthlyInput={setExtraRefMonthlyInput}
            isManualMultiplier={isManualMultiplier}
            setIsManualMultiplier={setIsManualMultiplier}
            extraMultiplier={extraMultiplier}
            setExtraMultiplier={setExtraMultiplier}
            extraMinMonths={extraMinMonths}
            setExtraMinMonths={setExtraMinMonths}
            isManualFloor={isManualFloor}
            setIsManualFloor={setIsManualFloor}
            legalExtraFloor={legalExtraFloor}
            setLegalExtraFloor={setLegalExtraFloor}
            legalExtraCeiling={legalExtraCeiling}
            setLegalExtraCeiling={setLegalExtraCeiling}
            reclassPreavisMonths={reclassPreavisMonths}
            setReclassPreavisMonths={setReclassPreavisMonths}
            reclassPreavisRate={reclassPreavisRate}
            setReclassPreavisRate={setReclassPreavisRate}
            reclassPreavisUsed={reclassPreavisUsed}
            setReclassPreavisUsed={setReclassPreavisUsed}
            reclassLeaveMonths={reclassLeaveMonths}
            setReclassLeaveMonths={setReclassLeaveMonths}
            reclassLeaveRate={reclassLeaveRate}
            setReclassLeaveRate={setReclassLeaveRate}
            reclassLeaveUsed={reclassLeaveUsed}
            setReclassLeaveUsed={setReclassLeaveUsed}
            reclassReducedRate={reclassReducedRate}
            setReclassReducedRate={setReclassReducedRate}
            leaveCSGCRDSRate={leaveCSGCRDSRate}
            setLeaveCSGCRDSRate={setLeaveCSGCRDSRate}
            leavePrevoyanceRate={leavePrevoyanceRate}
            setLeavePrevoyanceRate={setLeavePrevoyanceRate}
            leaveMutuelleRate={leaveMutuelleRate}
            setLeaveMutuelleRate={setLeaveMutuelleRate}
            leaveRetraiteTARate={leaveRetraiteTARate}
            setLeaveRetraiteTARate={setLeaveRetraiteTARate}
            leaveRetraiteTBRate={leaveRetraiteTBRate}
            setLeaveRetraiteTBRate={setLeaveRetraiteTBRate}
            leaveCETRate={leaveCETRate}
            setLeaveCETRate={setLeaveCETRate}
            illFracFirst={illFracFirst}
            setIllFracFirst={setIllFracFirst}
            illFracAfter={illFracAfter}
            setIllFracAfter={setIllFracAfter}
            iclFracFirst={iclFracFirst}
            setIclFracFirst={setIclFracFirst}
            iclFracAfter={iclFracAfter}
            setIclFracAfter={setIclFracAfter}
            trainingBonusEnabled={trainingBonusEnabled}
            setTrainingBonusEnabled={setTrainingBonusEnabled}
            trainingBonus={trainingBonus}
            setTrainingBonus={setTrainingBonus}
            businessCreationBonusEnabled={businessCreationBonusEnabled}
            setBusinessCreationBonusEnabled={setBusinessCreationBonusEnabled}
            businessCreationBonus={businessCreationBonus}
            setBusinessCreationBonus={setBusinessCreationBonus}
            autoFloor={autoFloor}
            autoMultiplier={autoMultiplier}
            formatCurrency={formatCurrency}
          />
        </div>

        {/* Right Results (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <CalculatorResults
            results={results}
            formatCurrency={formatCurrency}
          />
        </div>

      </div>

    </div>
  );
}
