// src/lib/calculations.ts

export interface LegalIndemnity {
  amount: number;
  monthsEq: number;
  totalYears: number;
  illAmount: number;
  iclAmount: number;
  isILL: boolean;
  detail: string;
}

export interface ExtraLegalIndemnity {
  amount: number;
  monthsEq: number;
  detail: string;
}

export interface ReclassificationResult {
  amount: number;
  preavisAmountBrut: number;
  preavisMonths: number;
  preavisTotalPeriodBrut: number;
  leaveAmountBrut: number;
  leaveEffectuesBrut: number;
  leaveNonEffectuesBrut: number;
  leaveAmountNet: number;
  leaveMonths: number;
  leaveTotalPeriodBrut: number;
  leaveMonthlyAllowance: number;
  leaveCSGCRDS: number;
  leavePrevoyance: number;
  leaveMutuelle: number;
  leaveRetraiteTA: number;
  leaveRetraiteTB: number;
  leaveCET: number;
  leaveTotalCharges: number;
  preavisRemaining: number;
  leaveRemaining: number;
  totalRemaining: number;
  detail: string;
}

export interface CalculationResult {
  refMonthly: number;
  baseMonthly: number;
  legalRefMonthly: number;
  extraRefMonthly: number;
  totalYears: number;
  legal: LegalIndemnity;
  multiplier: number;
  extraRaw: ExtraLegalIndemnity;
  legalExtraSum: number;
  legalExtraAdjusted: number;
  reclass: ReclassificationResult;
  totalBrut: number;
  legalAdjusted: number;
  extraAdjusted: number;
  legalNet: number;
  extraNet: number;
  preavisNet: number;
  leaveNet: number;
  primesNet: number;
  totalNet: number;
  legalNetNet: number;
  extraNetNet: number;
  preavisNetNet: number;
  leaveNetNet: number;
  primesNetNet: number;
  totalNetNet: number;
  totalIndemnitesBrut: number;
  totalIndemnitesNet: number;
  totalIndemnitesNetNet: number;
  chargesDeducted: number;
  incomeTaxDeducted: number;
  taxableAmount: number;
  preavisPeriodBrut: number;
  preavisPeriodNet: number;
  preavisPeriodNetNet: number;
  leaveEffectuesBrut: number;
  leaveEffectuesNet: number;
  leaveEffectuesNetNet: number;
  leaveNonEffectuesBrut: number;
  leaveNonEffectuesNet: number;
  leaveNonEffectuesNetNet: number;
}

export function getMultiplierBySeniority(totalYears: number): number {
  if (totalYears <= 5) {
    return 1.0;
  } else if (totalYears <= 10) {
    return 1.0;
  } else if (totalYears < 15) {
    return 1.2;
  } else {
    return 1.5;
  }
}

export function getFloorBySeniority(totalYears: number): number {
  if (totalYears <= 5) {
    return 70000;
  } else if (totalYears <= 10) {
    return 90000;
  } else if (totalYears < 15) {
    return 110000;
  } else {
    return 130000;
  }
}

export function clamp(value: number, min: number | null, max: number | null): number {
  if (max !== null && value > max) return max;
  if (min !== null && value < min) return min;
  return value;
}

export function computeLegalIndemnity(
  refMonthly: number,
  years: number,
  months: number,
  illFracFirst: number,
  illFracAfter: number,
  iclFracFirst: number,
  iclFracAfter: number,
  locale: 'fr' | 'en' = 'fr'
): LegalIndemnity {
  const totalYears = years + months / 12;
  const cappedFirst = Math.min(totalYears, 10);
  const remaining = Math.max(totalYears - 10, 0);

  // Calcul ILL (Indemnité Légale de Licenciement)
  const illMonthsEq = cappedFirst * illFracFirst + remaining * illFracAfter;
  const illAmount = refMonthly * illMonthsEq;

  // Calcul ICL (Indemnité Conventionnelle Casino)
  const iclMonthsEq = cappedFirst * iclFracFirst + remaining * iclFracAfter;
  const iclAmount = refMonthly * iclMonthsEq;

  // Retenir le montant le plus favorable
  const amount = Math.max(illAmount, iclAmount);
  const monthsEq = amount === illAmount ? illMonthsEq : iclMonthsEq;
  const isILL = amount === illAmount;

  let detail = "";
  if (Math.abs(illAmount - iclAmount) < 0.01) {
    detail = locale === 'en'
      ? `${monthsEq.toFixed(2)} months salary (ILL = ICL)`
      : `${monthsEq.toFixed(2)} mois de salaire (ILL = ICL)`;
  } else if (isILL) {
    detail = locale === 'en'
      ? `${monthsEq.toFixed(2)} months salary - ILL retained (${illAmount.toFixed(2)} €) > ICL (${iclAmount.toFixed(2)} €)`
      : `${monthsEq.toFixed(2)} mois de salaire - ILL retenue (${illAmount.toFixed(2)} €) > ICL (${iclAmount.toFixed(2)} €)`;
  } else {
    detail = locale === 'en'
      ? `${monthsEq.toFixed(2)} months salary - ICL retained (${iclAmount.toFixed(2)} €) > ILL (${illAmount.toFixed(2)} €)`
      : `${monthsEq.toFixed(2)} mois de salaire - ICL retenue (${iclAmount.toFixed(2)} €) > ILL (${illAmount.toFixed(2)} €)`;
  }

  return {
    amount,
    monthsEq,
    totalYears,
    illAmount,
    iclAmount,
    isILL,
    detail,
  };
}

export function computeExtraLegal(
  refMonthly: number,
  totalYears: number,
  minMonths: number,
  customMultiplier: number | null = null,
  locale: 'fr' | 'en' = 'fr'
): ExtraLegalIndemnity {
  let monthsEq = 0;
  const detailParts: string[] = [];

  if (customMultiplier !== null && customMultiplier > 0) {
    monthsEq = totalYears * customMultiplier;
    detailParts.push(locale === 'en'
      ? `${totalYears.toFixed(2)} yrs × ${customMultiplier.toFixed(2)}`
      : `${totalYears.toFixed(2)} ans × ${customMultiplier.toFixed(2)}`);
  } else {
    const multiplier = getMultiplierBySeniority(totalYears);
    let trancheLabel = "1-5 ans";
    if (totalYears <= 5) {
      trancheLabel = locale === 'en' ? "1-5 yrs" : "1-5 ans";
    } else if (totalYears <= 10) {
      trancheLabel = locale === 'en' ? "5-10 yrs" : "5-10 ans";
    } else if (totalYears <= 15) {
      trancheLabel = locale === 'en' ? "10-15 yrs" : "10-15 ans";
    } else {
      trancheLabel = locale === 'en' ? "+15 yrs" : "+15 ans";
    }
    monthsEq = totalYears * multiplier;
    detailParts.push(locale === 'en'
      ? `${totalYears.toFixed(2)} yrs × ${multiplier.toFixed(1)} (bracket ${trancheLabel})`
      : `${totalYears.toFixed(2)} ans × ${multiplier.toFixed(1)} (tranche ${trancheLabel})`);
  }

  monthsEq = Math.max(monthsEq, minMonths);
  const amount = refMonthly * monthsEq;

  const detailText = minMonths > 0
    ? (locale === 'en'
      ? `${monthsEq.toFixed(2)} months reference salary (${detailParts.join(" + ")}, floor ${minMonths} months)`
      : `${monthsEq.toFixed(2)} mois de salaire de référence (${detailParts.join(" + ")}, plancher ${minMonths} mois)`)
    : (locale === 'en'
      ? `${monthsEq.toFixed(2)} months reference salary (${detailParts.join(" + ")})`
      : `${monthsEq.toFixed(2)} mois de salaire de référence (${detailParts.join(" + ")})`);

  return {
    amount,
    monthsEq,
    detail: detailText,
  };
}

export function computeReclassification(
  preavisBaseMonthly: number,
  preavisMonths: number,
  preavisRate: number,
  preavisUsed: number,
  leaveRefMonthly: number,
  leaveMonths: number,
  leaveRate: number,
  leaveUsed: number,
  reducedRate: number,
  csgCrdsRate: number,
  prevoyanceRate: number,
  mutuelleRate: number,
  retraiteTaRate: number,
  retraiteTbRate: number,
  cetRate: number,
  locale: 'fr' | 'en' = 'fr'
): ReclassificationResult {
  const preavisRemaining = Math.max(preavisMonths - preavisUsed, 0);
  const preavisMonthlyAllowance = preavisBaseMonthly * (preavisRate / 100);
  const preavisAmountBrut = preavisMonthlyAllowance * preavisRemaining;
  const preavisTotalPeriodBrut = preavisMonthlyAllowance * preavisMonths;

  const leaveMonthlyAllowance = leaveRefMonthly * (leaveRate / 100);
  const leaveUsedClamped = Math.min(Math.max(leaveUsed, 0), leaveMonths);
  const leaveRemaining = Math.max(leaveMonths - leaveUsedClamped, 0);
  const leaveTotalPeriodBrut = leaveMonthlyAllowance * leaveMonths;
  const leaveEffectuesBrut = leaveMonthlyAllowance * leaveUsedClamped;
  const leaveRemainingAt80 = leaveMonthlyAllowance * leaveRemaining;
  const leaveNonEffectuesBrut = leaveRemaining > 0 ? leaveRemainingAt80 * (reducedRate / 100) : 0;
  const leaveAmountBrut = leaveEffectuesBrut + leaveNonEffectuesBrut;

  const leaveCSGCRDS = leaveAmountBrut * (csgCrdsRate / 100);
  const leavePrevoyance = leaveAmountBrut * (prevoyanceRate / 100);
  const leaveMutuelle = leaveAmountBrut * (mutuelleRate / 100);
  const leaveRetraiteTA = leaveAmountBrut * (retraiteTaRate / 100);
  const leaveRetraiteTB = leaveAmountBrut * (retraiteTbRate / 100);
  const leaveCET = leaveAmountBrut * (cetRate / 100);
  const leaveTotalCharges = leaveCSGCRDS + leavePrevoyance + leaveMutuelle + leaveRetraiteTA + leaveRetraiteTB + leaveCET;
  const leaveAmountNet = leaveAmountBrut - leaveTotalCharges;

  const totalAmount = preavisAmountBrut + leaveAmountBrut;
  const totalRemaining = preavisRemaining + leaveRemaining;

  let detail = "";
  if (preavisRemaining > 0 && leaveRemaining > 0) {
    detail = locale === 'en'
      ? `${preavisRemaining.toFixed(2)} months notice (${preavisRate.toFixed(0)}%) + ${leaveRemaining.toFixed(2)} months leave (${leaveRate.toFixed(0)}%) → ${reducedRate.toFixed(0)}% paid (reduced leave)`
      : `${preavisRemaining.toFixed(2)} mois pré-avis (${preavisRate.toFixed(0)}%) + ${leaveRemaining.toFixed(2)} mois congé (${leaveRate.toFixed(0)}%) → ${reducedRate.toFixed(0)}% payé car congé réduit`;
  } else if (preavisRemaining > 0) {
    detail = locale === 'en'
      ? `${preavisRemaining.toFixed(2)} months notice unconsumed (${preavisRate.toFixed(0)}%)`
      : `${preavisRemaining.toFixed(2)} mois pré-avis non consommés (${preavisRate.toFixed(0)}%)`;
  } else if (leaveRemaining > 0) {
    detail = locale === 'en'
      ? `${leaveRemaining.toFixed(2)} months leave unconsumed (${leaveRate.toFixed(0)}%) → ${reducedRate.toFixed(0)}% paid (reduced leave)`
      : `${leaveRemaining.toFixed(2)} mois congé non consommés (${leaveRate.toFixed(0)}%) → ${reducedRate.toFixed(0)}% payé car congé réduit`;
  } else {
    detail = locale === 'en'
      ? "No months remaining (all leave consumed)"
      : "Aucun mois restant (tout le congé a été consommé)";
  }

  return {
    amount: totalAmount,
    preavisAmountBrut,
    preavisMonths,
    preavisTotalPeriodBrut,
    leaveAmountBrut,
    leaveEffectuesBrut,
    leaveNonEffectuesBrut,
    leaveAmountNet,
    leaveMonths,
    leaveTotalPeriodBrut,
    leaveMonthlyAllowance,
    leaveCSGCRDS,
    leavePrevoyance,
    leaveMutuelle,
    leaveRetraiteTA,
    leaveRetraiteTB,
    leaveCET,
    leaveTotalCharges,
    preavisRemaining,
    leaveRemaining,
    totalRemaining,
    detail,
  };
}

export function runCalculation(params: {
  annualGross: number;
  seniorityYears: number;
  seniorityMonths: number;
  refMonths: number;
  incomeTaxRate: number;
  illFracFirst: number;
  illFracAfter: number;
  iclFracFirst: number;
  iclFracAfter: number;
  extraMultiplier: number | null;
  extraMinMonths: number;
  legalExtraFloor: number;
  legalExtraCeiling: number;
  reclassPreavisMonths: number;
  reclassPreavisRate: number;
  reclassPreavisUsed: number;
  reclassLeaveMonths: number;
  reclassLeaveRate: number;
  reclassLeaveUsed: number;
  reclassReducedRate: number;
  leaveCSGCRDSRate: number;
  leavePrevoyanceRate: number;
  leaveMutuelleRate: number;
  leaveRetraiteTARate: number;
  leaveRetraiteTBRate: number;
  leaveCETRate: number;
  trainingBonus: number;
  businessCreationBonus: number;
  baseMonthlyInput: number;
  legalRefMonthlyInput: number;
  extraRefMonthlyInput: number;
  locale: 'fr' | 'en';
}): CalculationResult {
  const {
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
    reclassLeaveUsed,
    reclassReducedRate,
    leaveCSGCRDSRate,
    leavePrevoyanceRate,
    leaveMutuelleRate,
    leaveRetraiteTARate,
    leaveRetraiteTBRate,
    leaveCETRate,
    trainingBonus,
    businessCreationBonus,
    baseMonthlyInput,
    legalRefMonthlyInput,
    extraRefMonthlyInput,
    locale,
  } = params;

  const refMonthly = annualGross / Math.max(refMonths, 1);
  const baseMonthly = baseMonthlyInput > 0 ? baseMonthlyInput : refMonthly;
  const legalRefMonthly = legalRefMonthlyInput > 0 ? legalRefMonthlyInput : refMonthly;
  const extraRefMonthly = extraRefMonthlyInput > 0 ? extraRefMonthlyInput : refMonthly;
  const totalYears = seniorityYears + seniorityMonths / 12;

  const legal = computeLegalIndemnity(
    legalRefMonthly,
    seniorityYears,
    seniorityMonths,
    illFracFirst,
    illFracAfter,
    iclFracFirst,
    iclFracAfter,
    locale
  );

  const multiplier = extraMultiplier !== null ? extraMultiplier : getMultiplierBySeniority(totalYears);
  
  const extraRaw = computeExtraLegal(
    extraRefMonthly,
    totalYears,
    extraMinMonths,
    extraMultiplier,
    locale
  );

  const legalExtraSum = legal.amount + extraRaw.amount;
  const MIN_LEGAL_EXTRA = legalExtraFloor > 0 ? legalExtraFloor : null;
  const MAX_LEGAL_EXTRA = legalExtraCeiling > 0 ? legalExtraCeiling : null;
  const legalExtraAdjusted = clamp(legalExtraSum, MIN_LEGAL_EXTRA, MAX_LEGAL_EXTRA);

  const reclass = computeReclassification(
    baseMonthly,
    reclassPreavisMonths,
    reclassPreavisRate,
    reclassPreavisUsed,
    legalRefMonthly,
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
    locale
  );

  const totalBrut = legalExtraAdjusted + reclass.amount + trainingBonus + businessCreationBonus;

  const legalAdjusted = legal.amount;
  const extraAdjusted = Math.max(legalExtraAdjusted - legal.amount, 0);

  // 1. ILL/ICL Exonéré de charges & impôts
  const legalNet = legalAdjusted;

  // 2. Extra-légal : CSG/CRDS 9,7% uniquement, Exonéré d'impôts
  const SUPRA_LEGAL_CSG_CRDS_RATE = 9.7;
  const extraNet = extraAdjusted - (extraAdjusted * (SUPRA_LEGAL_CSG_CRDS_RATE / 100));

  // 3. Pré-avis : Charges normales 23%, Soumis à l'impôt
  const PREAVIS_CHARGES_RATE = 23;
  const preavisNet = reclass.preavisAmountBrut > 0
    ? reclass.preavisAmountBrut - (reclass.preavisAmountBrut * (PREAVIS_CHARGES_RATE / 100))
    : 0;

  // 4. Congé : Charges allégées calculées, Soumis à l'impôt
  const leaveNet = reclass.leaveAmountNet || 0;

  // 5. Primes : Pas de charges, Soumises à l'impôt
  const primesNet = trainingBonus + businessCreationBonus;

  // Total Net avant impôt
  const totalNet = legalNet + extraNet + preavisNet + leaveNet + primesNet;

  // Impôts sur le revenu
  const legalNetNet = legalNet;
  const extraNetNet = extraNet;
  const preavisNetNet = preavisNet > 0 ? preavisNet - (preavisNet * (incomeTaxRate / 100)) : 0;
  const leaveNetNet = leaveNet > 0 ? leaveNet - (leaveNet * (incomeTaxRate / 100)) : 0;
  const primesNetNet = primesNet > 0 ? primesNet - (primesNet * (incomeTaxRate / 100)) : 0;

  // Total Net Net après impôt
  const totalNetNet = legalNetNet + extraNetNet + preavisNetNet + leaveNetNet + primesNetNet;

  // Totaux indemnités seules
  const totalIndemnitesBrut = legalExtraAdjusted;
  const totalIndemnitesNet = legalNet + extraNet;
  const totalIndemnitesNetNet = legalNetNet + extraNetNet;

  const chargesDeducted = totalBrut - totalNet;
  const incomeTaxDeducted = totalNet - totalNetNet;
  const taxableAmount = preavisNet + leaveNet + primesNet;

  // Detailed Period totals
  const preavisPeriodBrut = reclass.preavisTotalPeriodBrut || 0;
  const preavisPeriodNet = preavisPeriodBrut * (1 - PREAVIS_CHARGES_RATE / 100);
  const preavisPeriodNetNet = preavisPeriodNet * (1 - incomeTaxRate / 100);

  const leaveChargeRatePct = reclass.leaveAmountBrut > 0
    ? (reclass.leaveTotalCharges / reclass.leaveAmountBrut) * 100
    : (leaveCSGCRDSRate + leavePrevoyanceRate + leaveMutuelleRate + leaveRetraiteTARate + leaveRetraiteTBRate + leaveCETRate);

  const leaveEffectuesBrut = reclass.leaveEffectuesBrut || 0;
  const leaveEffectuesNet = leaveEffectuesBrut * (1 - leaveChargeRatePct / 100);
  const leaveEffectuesNetNet = leaveEffectuesNet * (1 - incomeTaxRate / 100);

  const leaveNonEffectuesBrut = reclass.leaveNonEffectuesBrut || 0;
  let leaveNonEffectuesNet = 0;
  let leaveNonEffectuesNetNet = 0;
  if (leaveNonEffectuesBrut > 0 && reclass.leaveAmountBrut > 0) {
    const ratio = leaveNonEffectuesBrut / reclass.leaveAmountBrut;
    leaveNonEffectuesNet = leaveNet * ratio;
    leaveNonEffectuesNetNet = leaveNetNet * ratio;
  }

  return {
    refMonthly,
    baseMonthly,
    legalRefMonthly,
    extraRefMonthly,
    totalYears,
    legal,
    multiplier,
    extraRaw,
    legalExtraSum,
    legalExtraAdjusted,
    reclass,
    totalBrut,
    legalAdjusted,
    extraAdjusted,
    legalNet,
    extraNet,
    preavisNet,
    leaveNet,
    primesNet,
    totalNet,
    legalNetNet,
    extraNetNet,
    preavisNetNet,
    leaveNetNet,
    primesNetNet,
    totalNetNet,
    totalIndemnitesBrut,
    totalIndemnitesNet,
    totalIndemnitesNetNet,
    chargesDeducted,
    incomeTaxDeducted,
    taxableAmount,
    preavisPeriodBrut,
    preavisPeriodNet,
    preavisPeriodNetNet,
    leaveEffectuesBrut,
    leaveEffectuesNet,
    leaveEffectuesNetNet,
    leaveNonEffectuesBrut,
    leaveNonEffectuesNet,
    leaveNonEffectuesNetNet,
  };
}
