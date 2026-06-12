// src/context/LanguageContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'en';

type Dictionary = { [key: string]: string | ((...args: any[]) => string) };

const fr: Dictionary = {
  app_title: "Calculateur PDV",
  app_subtitle: "Simulateur d'indemnités de Plan de Départ Volontaire (PDV) : indemnité légale, extra-légale, congé de reclassement et fiscalité appliquée.",
  reset: "Réinitialiser",
  indicative_note: "Note indicative :",
  indicative_note_text: "Cet outil est fourni à des fins de simulation. Les règles exactes dépendent de votre accord majoritaire d'entreprise, de votre convention collective ou des critères fiscaux propres à votre situation.",
  
  // Base Data Section
  section_base: "Données de base",
  section_base_desc: "Salaire brut, ancienneté et fiscalité",
  annual_gross: "Salaire brut annuel (€)",
  income_tax_rate: "Taux d'imposition sur le revenu (%)",
  seniority_years: "Ancienneté (années)",
  seniority_months: "Mois supplémentaires",
  ref_months: "Mois de réf. (Moyenne)",
  override_title: "Surcharges de salaire de référence (Optionnel)",
  override_desc: "Si non renseigné, le salaire brut annuel / mois de réf. est utilisé.",
  base_preavis: "Base pré-avis (€)",
  ref_1_legal_leave: "Réf 1 (Légal/Congé) (€)",
  ref_2_extra_legal: "Réf 2 (Extra-légal) (€)",

  // Extra legal
  section_extra: "Indemnité extra-légale & Primes",
  section_extra_desc: "Multiplicateur, planchers, plafonds et primes",
  rule_casino: "Règle de l'accord majoritaire (Casino) :",
  rule_casino_multiplier: "• Multiplicateur appliqué sur la totalité des années selon la tranche atteinte :",
  rule_casino_multiplier_detail: "Ancienneté ≤ 10 ans : 1,0x | < 15 ans : 1.2x | ≥ 15 ans : 1.5x.",
  rule_casino_floors: "• Planchers conventionnels : ≤ 5 ans: 70k€ | ≤ 10 ans: 90k€ | < 15 ans: 110k€ | ≥ 15 ans: 130k€.",
  multiplier_pdv: "Multiplicateur PDV",
  multiplier_manual_btn: (val: number) => `Modifier manuellement (cliquez pour auto: ${val}x)`,
  multiplier_auto_lbl: (val: number) => `Calculé automatiquement (${val}x)`,
  floor_label: "Plancher (légale + extra)",
  floor_manual_btn: (val: string) => `Modifier manuellement (cliquez pour auto: ${val})`,
  floor_auto_lbl: (val: string) => `Automatique selon tranche (${val})`,
  ceiling_label: "Plafond (légale + extra)",
  training_bonus: "Prime de formation",
  training_bonus_desc: "Unique, versée sur justificatif",
  business_creation_bonus: "Création d'entreprise",
  business_creation_bonus_desc: "Prime totale payée en 2 fois",

  // Reclassification
  section_reclass: "Congé de reclassement",
  section_reclass_desc: "Pré-avis, allocations et cotisations sociales",
  preavis: "Pré-avis",
  duration_months: "Durée (mois)",
  rate_percent: "Taux (% du brut)",
  consumed_months: "Consommé (mois)",
  leave_title: "Congé",
  total_duration_months: "Durée totale (mois)",
  reduced_rate_percent: "% si congé réduit (capital)",
  conducted_leave_title: "Mois de congé effectués : ",
  conducted_leave_val: (val: number) => `${val} mois`,
  conducted_leave_summary: (active: number, rate: number) => `${active} mois à ${rate}% du brut (effectués). `,
  remaining_leave_summary: (rem: string, rate: string) => `${rem} mois restants payés à ${rate}% du brut (capitalisé).`,
  social_charges_title: "Taux des charges sociales sur congé de reclassement",
  social_charges_desc: "Taux réglementaires allégés sur allocations de reclassement.",

  // Fractions
  section_fractions: "Fractions Légale & Conventionnelle",
  section_fractions_desc: "Règles de licenciement ILL & convention collective ICL",
  ill_title: "ILL - Indemnité Légale",
  icl_title: "ICL - Conventionnelle (Casino)",
  months_per_year_under_10: "Mois/An ≤ 10 ans",
  months_per_year_over_10: "Mois/An > 10 ans",

  // Results Section
  estimated_amounts: "Montants Estimés",
  total_estimated_gross: "Total Estimé (Brut)",
  floor_applied: "Plancher appliqué",
  ceiling_applied: "Plafond appliqué",
  total_net_before_tax: "Total Net (Avant impôt)",
  charges_label: (val: string) => `-${val} charges`,
  total_net_after_tax: "Total Net Net (Après Impôt)",
  tax_label: (val: string) => `-${val} impôt (IR)`,
  hero_gross: "Indemnités Brutes (Légal + Supra-légal)",
  hero_net: "Indemnités Nettes (Après CSG 9,7%)",
  hero_net_net: "Indemnités Net Net (Après Impôt)",
  csg_deducted: (val: string) => `-${val} CSG/CRDS`,
  exempt_tax: "0% impôt (exonéré)",
  tab_summary: "Synthèse",
  tab_period: "Période",
  tab_taxes: "Cotisations & Taxes",

  // Summary Tab
  legal_conv_indemnity: "1. Indemnité légale ou conv.",
  extra_legal_indemnity: "2. Indemnité extra-légale PDV",
  adjusted_sum: " (ajusté)",
  reclassification_leave: "3. Congé de reclassement",
  optional_bonuses: "4. Primes optionnelles",
  net_before_ir: "Total net avant impôt",
  global_total_gross: "Total Global Estimé (Brut)",
  global_total_net: "Total Global Net (Avant IR)",
  global_total_net_net: "Total Global Net Net (Après IR)",

  // Period Tab
  paid_notice_months: "Mois de pré-avis payés (non consommés)",
  paid_leave_months: "Mois de congé payés (non consommés)",
  conducted_leave_months: "Mois de congé effectués",
  total_paid_duration: "Durée totale payée (hors indemnités)",
  monthly_notice_payment: "Mensualité pré-avis",
  monthly_leave_payment: "Mensualité congé",
  leave_floor_reapplied: "Plancher de congé ré-appliqué",
  period_total_value: "Valeur totale sur la période",
  duration: "Durée",
  gross: "Brut",
  net: "Net",
  net_net: "Net net",
  monthly: "Mensuel",
  repartition: "Répartition",
  conducted_desc: (val: number) => `${val} mois effectués (80% du brut/mois)`,
  unconducted_desc: (val: number) => `${val} mois non effectués (64% du brut/mois)`,
  monthly_detail: (b: string, n: string, nn: string) => `brut ${b} | net ${n} | net net ${nn}`,

  // Taxes Tab
  social_charges_and_csg: "Charges sociales & CSG/CRDS",
  extra_legal_net_detail: "Extra-légal (net avant IR)",
  extra_legal_gross_detail: "Extra-légal brut",
  preavis_net_detail: "Pré-avis (net avant IR)",
  preavis_gross_detail: "Pré-avis brut",
  leave_net_detail: "Congé (net avant IR)",
  leave_gross_detail: "Congé brut",
  charges_on_leave: "Charges sur congé",
  income_tax_ir: "Impôt sur le revenu (IR)",
  taxable_base: "Assiette imposable",
  tax_withheld: "Impôt prélevé",
  pocket_net: "Net dans votre poche",

  // Detail functions
  detail_none: "Aucun mois restant (tout le congé a été consommé)",
  detail_notice_only: (rem: string, rate: string) => `${rem} mois pré-avis non consommés (${rate}%)`,
  detail_leave_only: (rem: string, rate: string, reduced: string) => `${rem} mois congé non consommés (${rate}%) → ${reduced}% payé car congé réduit`,
  detail_reclass_both: (preavis: string, pre_rate: string, leave: string, leave_rate: string, red_rate: string) =>
    `${preavis} mois pré-avis (${pre_rate}%) + ${leave} mois congé (${leave_rate}%) → ${red_rate}% payé car congé réduit`,
};

const en: Dictionary = {
  app_title: "PDV Calculator",
  app_subtitle: "Voluntary Departure Plan (PDV) severance simulator: legal, extra-legal indemnity, reclassification leave, and applicable taxation.",
  reset: "Reset",
  indicative_note: "Indicative note:",
  indicative_note_text: "This tool is provided for simulation purposes. The exact rules depend on your company majority agreement, your collective bargaining agreement, or specific tax criteria.",
  
  // Base Data Section
  section_base: "Basic Data",
  section_base_desc: "Gross salary, seniority, and taxation",
  annual_gross: "Annual Gross Salary (€)",
  income_tax_rate: "Income Tax Rate (%)",
  seniority_years: "Seniority (years)",
  seniority_months: "Additional months",
  ref_months: "Ref. months (Average)",
  override_title: "Reference Salary Overrides (Optional)",
  override_desc: "If left empty, annual gross / ref months is used.",
  base_preavis: "Notice period base (€)",
  ref_1_legal_leave: "Ref 1 (Legal/Leave) (€)",
  ref_2_extra_legal: "Ref 2 (Extra-legal) (€)",

  // Extra legal
  section_extra: "Extra-legal Indemnity & Bonuses",
  section_extra_desc: "Multiplier, floors, ceilings, and bonuses",
  rule_casino: "Majority Agreement Rule (Casino):",
  rule_casino_multiplier: "• Multiplier applied to all years based on the bracket reached:",
  rule_casino_multiplier_detail: "Seniority ≤ 10 yrs: 1.0x | < 15 yrs: 1.2x | ≥ 15 yrs: 1.5x.",
  rule_casino_floors: "• Conventional floors: ≤ 5 yrs: €70k | ≤ 10 yrs: €90k | < 15 yrs: €110k | ≥ 15 yrs: €130k.",
  multiplier_pdv: "PDV Multiplier",
  multiplier_manual_btn: (val: number) => `Edit manually (click for auto: ${val}x)`,
  multiplier_auto_lbl: (val: number) => `Automatically calculated (${val}x)`,
  floor_label: "Floor (legal + extra)",
  floor_manual_btn: (val: string) => `Edit manually (click for auto: ${val})`,
  floor_auto_lbl: (val: string) => `Automatic based on bracket (${val})`,
  ceiling_label: "Ceiling (legal + extra)",
  training_bonus: "Training Bonus",
  training_bonus_desc: "One-off, paid on proof",
  business_creation_bonus: "Business Creation",
  business_creation_bonus_desc: "Total bonus paid in 2 installments",

  // Reclassification
  section_reclass: "Reclassification Leave",
  section_reclass_desc: "Notice period, allowances, and social contributions",
  preavis: "Notice period",
  duration_months: "Duration (months)",
  rate_percent: "Rate (% of gross)",
  consumed_months: "Consumed (months)",
  leave_title: "Leave",
  total_duration_months: "Total duration (months)",
  reduced_rate_percent: "% if reduced leave (capital)",
  conducted_leave_title: "Months of leave conducted: ",
  conducted_leave_val: (val: number) => `${val} months`,
  conducted_leave_summary: (active: number, rate: number) => `${active} months at ${rate}% of gross (conducted). `,
  remaining_leave_summary: (rem: string, rate: string) => `${rem} remaining months paid at ${rate}% of gross (capitalized).`,
  social_charges_title: "Social contribution rates on reclassification leave",
  social_charges_desc: "Reduced regulatory rates on reclassification allowances.",

  // Fractions
  section_fractions: "Legal & Conventional Fractions",
  section_fractions_desc: "ILL dismissal rules & ICL collective agreement",
  ill_title: "ILL - Legal Indemnity",
  icl_title: "ICL - Conventional (Casino)",
  months_per_year_under_10: "Months/Year ≤ 10 yrs",
  months_per_year_over_10: "Months/Year > 10 yrs",

  // Results Section
  estimated_amounts: "Estimated Amounts",
  total_estimated_gross: "Estimated Total (Gross)",
  floor_applied: "Floor applied",
  ceiling_applied: "Ceiling applied",
  total_net_before_tax: "Total Net (Before Tax)",
  charges_label: (val: string) => `-${val} contributions`,
  total_net_after_tax: "Total Net Net (After Tax)",
  tax_label: (val: string) => `-${val} income tax (IR)`,
  hero_gross: "Severance Package (Gross)",
  hero_net: "Severance Package (Net - CSG 9.7%)",
  hero_net_net: "Severance Package Net Net (After Tax)",
  csg_deducted: (val: string) => `-${val} CSG/CRDS`,
  exempt_tax: "0% tax (exempt)",
  tab_summary: "Summary",
  tab_period: "Period",
  tab_taxes: "Contributions & Taxes",

  // Summary Tab
  legal_conv_indemnity: "1. Legal or conventional indemnity",
  extra_legal_indemnity: "2. Extra-legal PDV indemnity",
  adjusted_sum: " (adjusted)",
  reclassification_leave: "3. Reclassification leave",
  optional_bonuses: "4. Optional bonuses",
  net_before_ir: "Total net before tax",
  global_total_gross: "Grand Total (Gross)",
  global_total_net: "Grand Total (Net before IR)",
  global_total_net_net: "Grand Total (Net Net after IR)",

  // Period Tab
  paid_notice_months: "Paid notice months (unconsumed)",
  paid_leave_months: "Paid leave months (unconsumed)",
  conducted_leave_months: "Conducted leave months",
  total_paid_duration: "Total paid duration (excl. indemnities)",
  monthly_notice_payment: "Monthly notice payment",
  monthly_leave_payment: "Monthly leave payment",
  leave_floor_reapplied: "Leave floor re-applied",
  period_total_value: "Total value over the period",
  duration: "Duration",
  gross: "Gross",
  net: "Net",
  net_net: "Net Net",
  monthly: "Monthly",
  repartition: "Repartition",
  conducted_desc: (val: number) => `${val} months conducted (80% of gross/month)`,
  unconducted_desc: (val: number) => `${val} unconducted months (64% of gross/month)`,
  monthly_detail: (b: string, n: string, nn: string) => `gross ${b} | net ${n} | net net ${nn}`,

  // Taxes Tab
  social_charges_and_csg: "Social Contributions & CSG/CRDS",
  extra_legal_net_detail: "Extra-legal (net before IR)",
  extra_legal_gross_detail: "Extra-legal gross",
  preavis_net_detail: "Notice period (net before IR)",
  preavis_gross_detail: "Notice period gross",
  leave_net_detail: "Leave (net before IR)",
  leave_gross_detail: "Leave gross",
  charges_on_leave: "Charges on leave",
  income_tax_ir: "Income Tax (IR)",
  taxable_base: "Taxable base",
  tax_withheld: "Tax withheld",
  pocket_net: "Net in your pocket",

  // Detail functions
  detail_none: "No remaining months (all leave was consumed)",
  detail_notice_only: (rem: string, rate: string) => `${rem} unconsumed notice months (${rate}%)`,
  detail_leave_only: (rem: string, rate: string, reduced: string) => `${rem} unconsumed leave months (${rate}%) → ${reduced}% paid as reduced leave`,
  detail_reclass_both: (preavis: string, pre_rate: string, leave: string, leave_rate: string, red_rate: string) =>
    `${preavis} notice months (${pre_rate}%) + ${leave} leave months (${leave_rate}%) → ${red_rate}% paid as reduced leave`,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, ...args: any[]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang === 'fr' || savedLang === 'en') {
      setLanguageState(savedLang);
    } else {
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === 'en') {
        setLanguageState('en');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, ...args: any[]): string => {
    const dict = language === 'fr' ? fr : en;
    const translation = dict[key];
    if (!translation) return key;
    if (typeof translation === 'function') {
      return translation(...args);
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
