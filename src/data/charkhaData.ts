import { SpoolOption, DayOption, ComplexityOption, CurrencyNote } from '../types';

export const SPOOL_OPTIONS: SpoolOption[] = [
  {
    id: 'spool-1',
    spools: 1,
    labelUr: 'گاہک کا دھاگہ',
    labelPs: 'د ګاهک تار',
    descriptionUr: 'کپڑا اور دھاگہ گاہک کا ہے (آپ کا خرچ صفر)',
    descriptionPs: 'کپړه او تار د ګاهک دي (ستاسو خرڅ صفر)',
    cost: 0,
    icon: '🧵'
  },
  {
    id: 'spool-2',
    spools: 2,
    labelUr: 'عام سوتی / اونی',
    labelPs: 'عام سوتی / اونی',
    descriptionUr: 'آپ نے بازار سے پکا سوتی دھاگہ خریدا',
    descriptionPs: 'تاسو له بازاره پخپله تار اخیستی دی',
    cost: 400,
    icon: '🧵🧵'
  },
  {
    id: 'spool-3',
    spools: 3,
    labelUr: 'خالص ریشم و تلا',
    labelPs: 'خالص وریښم او تلا',
    descriptionUr: 'اعلیٰ کوالٹی زری، تلا یا خالص سواتی اون',
    descriptionPs: 'دروند وریښم، تلا او اصلي سواتۍ وړۍ',
    cost: 950,
    icon: '🧵✨🧵'
  }
];

export const DAY_OPTIONS: DayOption[] = [
  {
    id: 'day-1',
    days: 1,
    hours: 8,
    labelUr: '۱ دن کا کام',
    labelPs: '۱ ورځ کار',
    subUr: 'کف یا باریک پٹی',
    subPs: 'د لستوڼو کف یا پټۍ',
    iconType: 'sun',
    iconCount: 1
  },
  {
    id: 'day-3',
    days: 3,
    hours: 24,
    labelUr: '۳ دن کا کام',
    labelPs: '۳ ورځې کار',
    subUr: 'گلے اور بازو کا کام',
    subPs: 'د غاړې او لستوڼو ښکلی کار',
    iconType: 'suns',
    iconCount: 3
  },
  {
    id: 'day-7',
    days: 7,
    hours: 56,
    labelUr: '۷ دن (پورا ہفتہ)',
    labelPs: '۷ ورځې (پوره اوونۍ)',
    subUr: 'پوری قمیص کا دامن اور گلا',
    subPs: 'د ټولې قمیص دامن او غاړه',
    iconType: 'week',
    iconCount: 7
  },
  {
    id: 'day-14',
    days: 14,
    hours: 112,
    labelUr: '۱۴ دن (چاند و سورج)',
    labelPs: '۱۴ ورځې (درنه شال)',
    subUr: 'دلہن کا جوڑا یا بھاری شال',
    subPs: 'د ناوی کالي یا درنه ګرمه شال',
    iconType: 'moon',
    iconCount: 14
  }
];

export const COMPLEXITY_OPTIONS: ComplexityOption[] = [
  {
    id: 'simple',
    multiplier: 1.0,
    labelUr: 'سادہ زنجیری',
    labelPs: 'ساده زنځیري',
    patternNameUr: 'سادہ ٹانکہ',
    patternNamePs: 'ساده ټانکه',
    swatchColor: '#38A169',
    texturePattern: 'repeating-linear-gradient(45deg, #2F855A 0, #2F855A 6px, #38A169 6px, #38A169 12px)',
    descriptionUr: 'کھلا ٹانکہ، آنکھوں پر زور کم',
    descriptionPs: 'خلاص ټانکه، تېز او اسانه کار'
  },
  {
    id: 'phulkari',
    multiplier: 1.45,
    labelUr: 'سواتی پھلکاری',
    labelPs: 'سواتۍ پلوکاري',
    patternNameUr: 'گھنی روایتی پھلکاری',
    patternNamePs: 'درنه دودیزه پلوکاري',
    swatchColor: '#DD6B20',
    texturePattern: 'radial-gradient(circle, #C53030 25%, #D69E2E 26%, #D69E2E 50%, #FAF6EE 51%)',
    descriptionUr: 'گھنے روایتی پھول، کافی محنت',
    descriptionPs: 'درانده ګلونه، د سترګو خوږوونکی کار'
  },
  {
    id: 'shahi',
    multiplier: 1.95,
    labelUr: 'شاہی شیشہ و باریک',
    labelPs: 'شاهي اینه او باریک کار',
    patternNameUr: 'شاہکار نفیس کام',
    patternNamePs: 'شاهي او باریک کار',
    swatchColor: '#805AD5',
    texturePattern: 'repeating-radial-gradient(circle at 50% 50%, #FAF6EE 0, #FAF6EE 4px, #B794F4 5px, #805AD5 10px)',
    descriptionUr: 'خالص فن پارہ، آنکھ اور کمر کا انتہائی امتحان',
    descriptionPs: 'لوړ هنر، د سترګو او ملا کلک امتحان'
  }
];

// Calculate fair artisan living wage in Pakistan
export function calculateFairWage(spool: SpoolOption, day: DayOption, complexity: ComplexityOption) {
  const HOURLY_RATE = 160;
  const baseLabor = day.hours * HOURLY_RATE * complexity.multiplier;
  const rawTotal = baseLabor + spool.cost;

  // Round up to nearest 100 for dignity
  const minFair = Math.ceil(rawTotal / 100) * 100;
  const maxFair = Math.ceil((rawTotal * 1.18) / 100) * 100;

  return {
    min: minFair,
    max: maxFair,
    materialCost: spool.cost,
    laborPortion: minFair - spool.cost,
    hours: day.hours,
    hourlyEffective: Math.round((minFair - spool.cost) / day.hours)
  };
}

// Convert fair price to visual stacks of Pakistani Rupee notes
export function breakdownCurrencyNotes(amount: number): CurrencyNote[] {
  let remaining = amount;
  const notes: CurrencyNote[] = [];

  const denominations = [
    {
      value: 5000,
      color: 'bg-amber-100 border-amber-500 text-amber-900',
      accentColor: '#D97706',
      titleUr: '۵,۰۰۰ کا نوٹ',
      titlePs: '۵،۰۰۰ نوټ',
      landmarkUr: 'اسٹیٹ بینک عمارت (خردلی نوٹ)',
      landmarkPs: 'سټیټ بینک ودانۍ'
    },
    {
      value: 1000,
      color: 'bg-indigo-100 border-indigo-600 text-indigo-950',
      accentColor: '#2563EB',
      titleUr: '۱,۰۰۰ کا نوٹ',
      titlePs: '۱،۰۰۰ نوټ',
      landmarkUr: 'اسلامیہ کالج پشاور (نیلا نوٹ)',
      landmarkPs: 'اسلامیه کالج پیښور'
    },
    {
      value: 500,
      color: 'bg-emerald-100 border-emerald-600 text-emerald-950',
      accentColor: '#059669',
      titleUr: '۵۰۰ کا نوٹ',
      titlePs: '۵۰۰ نوټ',
      landmarkUr: 'بادشاہی مسجد لاہور (سبز نوٹ)',
      landmarkPs: 'بادشاهي جومات'
    },
    {
      value: 100,
      color: 'bg-rose-100 border-rose-500 text-rose-950',
      accentColor: '#E11D48',
      titleUr: '۱۰۰ کا نوٹ',
      titlePs: '۱۰۰ نوټ',
      landmarkUr: 'زیارت ریزیڈنسی قائد (سرخ نوٹ)',
      landmarkPs: 'زیارت ریزیډنسي'
    },
    {
      value: 50,
      color: 'bg-purple-100 border-purple-500 text-purple-950',
      accentColor: '#7C3AED',
      titleUr: '۵۰ کا نوٹ',
      titlePs: '۵۰ نوټ',
      landmarkUr: 'شاہراہ قراقرم (جامنی نوٹ)',
      landmarkPs: 'شاهراه قراقرم'
    }
  ];

  for (const d of denominations) {
    if (remaining >= d.value) {
      const count = Math.floor(remaining / d.value);
      remaining = remaining % d.value;
      notes.push({
        denomination: d.value,
        color: d.color,
        accentColor: d.accentColor,
        titleUr: d.titleUr,
        titlePs: d.titlePs,
        landmarkUr: d.landmarkUr,
        landmarkPs: d.landmarkPs,
        count
      });
    }
  }

  return notes;
}
