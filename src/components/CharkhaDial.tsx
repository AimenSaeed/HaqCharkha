import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SpoolOption, DayOption, ComplexityOption, Language, AudioVoice } from '../types';
import { SPOOL_OPTIONS, DAY_OPTIONS, COMPLEXITY_OPTIONS } from '../data/charkhaData';
import { playWoodenClack, playNeedleSnip } from '../utils/soundEffects';
import { speakMessage, stopSpeaking, SPOKEN_DESCRIPTIONS } from '../utils/audioSpeech';
import { Volume2, RotateCw, Check, Sparkles, SlidersHorizontal, Sun, Moon } from 'lucide-react';

interface CharkhaDialProps {
  selectedSpool: SpoolOption;
  selectedDay: DayOption;
  selectedComplexity: ComplexityOption;
  onSelectSpool: (s: SpoolOption) => void;
  onSelectDay: (d: DayOption) => void;
  onSelectComplexity: (c: ComplexityOption) => void;
  onSpinStart: () => void;
  onSpinComplete: () => void;
  hasCalculated: boolean;
  language: Language;
  voiceType: AudioVoice;
  zeroLiteracy: boolean;
}

export const CharkhaDial: React.FC<CharkhaDialProps> = ({
  selectedSpool,
  selectedDay,
  selectedComplexity,
  onSelectSpool,
  onSelectDay,
  onSelectComplexity,
  onSpinStart,
  onSpinComplete,
  hasCalculated,
  language,
  voiceType,
  zeroLiteracy
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [playingKey, setPlayingKey] = useState<string | null>(null);

  // Custom states (Single unified source of truth, NO duplicate modal forms)
  const [customSpoolCost, setCustomSpoolCost] = useState<number>(600);
  const [customSpoolName, setCustomSpoolName] = useState<string>('خاص دھاگہ / سلک تلا');

  const [customDaysCount, setCustomDaysCount] = useState<number>(5);
  const [customDayName, setCustomDayName] = useState<string>('۵ دن کا کام');

  const [customMultiplier, setCustomMultiplier] = useState<number>(1.5);
  const [customPatternName, setCustomPatternName] = useState<string>('کشمیری ٹانکہ / کٹ ورک');

  const isCustomSpoolActive = selectedSpool.id === 'spool-custom';
  const isCustomDayActive = selectedDay.id === 'day-custom';
  const isCustomComplexityActive = selectedComplexity.id === 'complexity-custom';

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    onSpinStart();

    // Tactile ratchet clicks
    let clicks = 0;
    const clickInterval = setInterval(() => {
      playWoodenClack(0.9 + Math.random() * 0.3);
      clicks++;
      if (clicks > 10) {
        clearInterval(clickInterval);
      }
    }, 70);

    const extraDegrees = 720 + Math.floor(Math.random() * 360);
    setWheelRotation((prev) => prev + extraDegrees);

    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete();
    }, 950);
  };

  const handlePlayVoiceOption = (e: React.MouseEvent, key: string, customSpeechText?: string) => {
    e.stopPropagation();
    playNeedleSnip();

    if (playingKey === key) {
      stopSpeaking();
      setPlayingKey(null);
      return;
    }

    setPlayingKey(key);
    let text = customSpeechText;
    if (!text) {
      const item = SPOKEN_DESCRIPTIONS[key];
      text = item ? item.ur : '';
    }

    if (text) {
      speakMessage(text, 'ur', () => {
        setPlayingKey(null);
      });
    } else {
      setPlayingKey(null);
    }
  };

  // Helper to apply custom spool
  const updateCustomSpool = (cost: number, name: string) => {
    const s: SpoolOption = {
      id: 'spool-custom',
      spools: 3,
      labelUr: name || 'کسٹم دھاگہ',
      labelPs: name || 'خپل تار',
      descriptionUr: `آپ کا سامان پر خرچ ₨ ${cost}`,
      descriptionPs: `ستاسو د سامان لګښت ₨ ${cost}`,
      cost: cost,
      icon: '🧵✨'
    };
    onSelectSpool(s);
  };

  // Helper to apply custom day
  const updateCustomDay = (days: number, name: string) => {
    const hours = days * 8;
    const d: DayOption = {
      id: 'day-custom',
      days: days,
      hours: hours,
      labelUr: name || `${days} دن کا کام`,
      labelPs: name || `${days} ورځې کار`,
      subUr: `${hours} گھنٹے محنت`,
      subPs: `${hours} ساعته محنت`,
      iconType: days >= 10 ? 'moon' : 'sun',
      iconCount: Math.min(days, 14)
    };
    onSelectDay(d);
  };

  // Helper to apply custom complexity
  const updateCustomComplexity = (mult: number, name: string) => {
    const c: ComplexityOption = {
      id: 'complexity-custom',
      multiplier: mult,
      labelUr: name || 'خاص کاریگری',
      labelPs: name || 'ځانګړی هنر',
      patternNameUr: name || 'خاص کاریگری',
      patternNamePs: name || 'ځانګړی هنر',
      swatchColor: mult >= 1.8 ? '#0F766E' : mult >= 1.4 ? '#D97706' : '#059669',
      texturePattern: 'repeating-linear-gradient(45deg, #0F766E 0, #0F766E 6px, #059669 6px, #059669 12px)',
      descriptionUr: `نزاکت کا درجہ ${mult} گنا`,
      descriptionPs: `د کار نزاکت ${mult} چنده`
    };
    onSelectComplexity(c);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* 3 Rings Selection Sections */}
      <div className="w-full space-y-4 px-1">
        {/* ======================================================== */}
        {/* Ring 1: دھاگہ اور کپڑا (Material / Spool Burden) */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200"
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                ۱
              </span>
              <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                {language === 'ur' ? 'دھاگہ اور کپڑا (خرچ کس کا ہے؟)' : 'تار او کپړه (خرڅ د چا دی؟)'}
              </h3>
            </div>
            <span className="text-xs font-bold text-[#0F766E] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              {language === 'ur' ? selectedSpool.labelUr : selectedSpool.labelPs}
            </span>
          </div>

          {/* Spool Options Grid (Preserves all presets + Single Clean Custom Option) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SPOOL_OPTIONS.map((spool) => {
              const active = selectedSpool.id === spool.id;
              const isVoicePlaying = playingKey === spool.id;
              return (
                <div
                  key={spool.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={active}
                  onClick={() => {
                    playWoodenClack(1.1);
                    onSelectSpool(spool);
                  }}
                  className={`relative p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center cursor-pointer select-none ${
                    active
                      ? 'border-[#0F766E] bg-teal-50/70 shadow-sm scale-[1.02]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{spool.icon}</div>
                  <span className="font-bold text-xs sm:text-sm text-[#0F172A] leading-normal py-0.5">
                    {language === 'ur' ? spool.labelUr : spool.labelPs}
                  </span>
                  {!zeroLiteracy && (
                    <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
                      {spool.cost === 0 ? (language === 'ur' ? 'گاہک کا کپڑا' : 'د ګاهک کپړه') : `₨ ${spool.cost}`}
                    </span>
                  )}

                  {/* Urdu voice button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      const text = `${spool.labelUr}۔ ${spool.descriptionUr}۔ ${spool.cost === 0 ? 'گاہک کا کپڑا اور دھاگہ، خرچ صفر روپے' : 'خرچ ' + spool.cost + ' روپے'}۔`;
                      handlePlayVoiceOption(e, spool.id, text);
                    }}
                    className={`absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isVoicePlaying
                        ? 'bg-[#0F766E] text-white animate-pulse'
                        : 'bg-slate-100 hover:bg-[#0F766E] hover:text-white text-slate-600'
                    }`}
                    title={language === 'ur' ? 'آواز سنیں' : 'غږ واورئ'}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {/* Custom Spool Card */}
            <div
              role="button"
              tabIndex={0}
              aria-pressed={isCustomSpoolActive}
              onClick={() => {
                playWoodenClack(1.1);
                updateCustomSpool(customSpoolCost, customSpoolName);
              }}
              className={`relative p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center cursor-pointer select-none ${
                isCustomSpoolActive
                  ? 'border-[#0F766E] bg-teal-50/70 shadow-sm scale-[1.02]'
                  : 'border-dashed border-teal-300 bg-teal-50/30 hover:bg-teal-50'
              }`}
            >
              <div className="text-xl mb-1">➕</div>
              <span className="font-bold text-xs sm:text-sm text-[#0F766E] leading-normal py-0.5">
                {language === 'ur' ? 'کسٹم دھاگہ' : 'خپل تار'}
              </span>
              <span className="text-[11px] font-bold text-teal-700 mt-0.5 font-mono">
                ₨ {customSpoolCost}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  const text = `${customSpoolName}۔ آپ کا اپنا سامان کا خرچ ${customSpoolCost} روپے۔`;
                  handlePlayVoiceOption(e, 'spool-custom', text);
                }}
                className={`absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  playingKey === 'spool-custom' ? 'bg-[#0F766E] text-white animate-pulse' : 'bg-teal-100 text-teal-800'
                }`}
                title={language === 'ur' ? 'آواز سنیں' : 'غږ واورئ'}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Unified Custom Spool Panel: Appears smoothly only when Custom Card is selected */}
          <AnimatePresence>
            {isCustomSpoolActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs space-y-2.5 overflow-hidden"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-[#0F766E] flex items-center gap-1">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{language === 'ur' ? 'اپنے سامان کا اصل خرچ مقرر کریں:' : 'د سامان اصلي لګښت وټاکئ:'}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const next = Math.max(0, customSpoolCost - 100);
                        setCustomSpoolCost(next);
                        updateCustomSpool(next, customSpoolName);
                      }}
                      className="px-2.5 py-1 rounded bg-white border border-teal-300 font-bold hover:bg-teal-100 cursor-pointer shadow-2xs"
                    >
                      - 100
                    </button>
                    <span className="font-bold text-sm font-mono text-[#0F766E] px-2 bg-white py-0.5 rounded border border-teal-200">
                      ₨ {customSpoolCost}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const next = customSpoolCost + 100;
                        setCustomSpoolCost(next);
                        updateCustomSpool(next, customSpoolName);
                      }}
                      className="px-2.5 py-1 rounded bg-white border border-teal-300 font-bold hover:bg-teal-100 cursor-pointer shadow-2xs"
                    >
                      + 100
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-teal-200/60">
                  <span className="text-slate-600 font-medium shrink-0">
                    {language === 'ur' ? 'دھاگے کا نام:' : 'د تار نوم:'}
                  </span>
                  <input
                    type="text"
                    value={customSpoolName}
                    onChange={(e) => {
                      setCustomSpoolName(e.target.value);
                      updateCustomSpool(customSpoolCost, e.target.value);
                    }}
                    placeholder={language === 'ur' ? 'مثلاً: خالص تلا، شیشہ دھاگہ' : 'مثلاً: خالص تلا'}
                    className="flex-1 bg-white border border-teal-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ======================================================== */}
        {/* Ring 2: محنت کے دن (Labor Days & Hours) */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200"
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#D97706] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                ۲
              </span>
              <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                {language === 'ur' ? 'محنت کے دن (آپ کا کتنا وقت لگا؟)' : 'د محنت ورځې (څومره وخت لګېدلی؟)'}
              </h3>
            </div>
            <span className="text-xs font-bold text-[#D97706] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {language === 'ur' ? selectedDay.labelUr : selectedDay.labelPs}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {DAY_OPTIONS.map((day) => {
              const active = selectedDay.id === day.id;
              const isVoicePlaying = playingKey === day.id;
              return (
                <div
                  key={day.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={active}
                  onClick={() => {
                    playWoodenClack(1.0);
                    onSelectDay(day);
                  }}
                  className={`relative p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center cursor-pointer select-none ${
                    active
                      ? 'border-[#D97706] bg-amber-50/70 shadow-sm scale-[1.02]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xl mb-1">
                    {day.days === 1 && '☀️'}
                    {day.days === 3 && '☀️☀️'}
                    {day.days === 7 && '📅'}
                    {day.days === 14 && '🌙'}
                  </div>

                  <span className="font-bold text-xs sm:text-sm text-[#0F172A] leading-normal py-0.5">
                    {language === 'ur' ? day.labelUr : day.labelPs}
                  </span>

                  {!zeroLiteracy && (
                    <span className="text-[11px] text-slate-500 line-clamp-1 leading-normal">
                      {language === 'ur' ? day.subUr : day.subPs}
                    </span>
                  )}

                  {/* Urdu voice button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      const text = `${day.labelUr}۔ ${day.subUr}۔ کل ${day.hours} گھنٹے محنت۔`;
                      handlePlayVoiceOption(e, day.id, text);
                    }}
                    className={`absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isVoicePlaying
                        ? 'bg-[#D97706] text-white animate-pulse'
                        : 'bg-slate-100 hover:bg-[#D97706] hover:text-white text-slate-600'
                    }`}
                    title={language === 'ur' ? 'آواز سنیں' : 'غږ واورئ'}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {/* Custom Day Card */}
            <div
              role="button"
              tabIndex={0}
              aria-pressed={isCustomDayActive}
              onClick={() => {
                playWoodenClack(1.0);
                updateCustomDay(customDaysCount, customDayName);
              }}
              className={`relative p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center cursor-pointer select-none ${
                isCustomDayActive
                  ? 'border-[#D97706] bg-amber-50/70 shadow-sm scale-[1.02]'
                  : 'border-dashed border-amber-300 bg-amber-50/30 hover:bg-amber-50'
              }`}
            >
              <div className="text-xl mb-1">⏳</div>
              <span className="font-bold text-xs sm:text-sm text-[#D97706] leading-normal py-0.5">
                {language === 'ur' ? 'اپنے دن' : 'خپلې ورځې'}
              </span>
              <span className="text-[11px] font-bold text-amber-800 mt-0.5 font-mono">
                {customDaysCount} {language === 'ur' ? 'دن' : 'ورځې'}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  const text = `${customDaysCount} دن کا کام۔ کل ${customDaysCount * 8} گھنٹے محنت۔`;
                  handlePlayVoiceOption(e, 'day-custom', text);
                }}
                className={`absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  playingKey === 'day-custom' ? 'bg-[#D97706] text-white animate-pulse' : 'bg-amber-100 text-amber-800'
                }`}
                title={language === 'ur' ? 'آواز سنیں' : 'غږ واورئ'}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Unified Custom Day Stepper */}
          <AnimatePresence>
            {isCustomDayActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2 overflow-hidden"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-[#D97706]">
                    {language === 'ur' ? 'سوئی دھاگے پر کل دن:' : 'د کار ټولې ورځې:'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const next = Math.max(1, customDaysCount - 1);
                        setCustomDaysCount(next);
                        updateCustomDay(next, `${next} دن کا کام`);
                      }}
                      className="w-8 h-8 rounded-lg bg-white border border-amber-300 font-bold hover:bg-amber-100 cursor-pointer shadow-2xs flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <span className="font-bold text-base font-mono text-[#D97706] px-3 bg-white py-1 rounded-lg border border-amber-200">
                      {customDaysCount} {language === 'ur' ? 'دن' : 'ورځې'} ({customDaysCount * 8}h)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const next = customDaysCount + 1;
                        setCustomDaysCount(next);
                        updateCustomDay(next, `${next} دن کا کام`);
                      }}
                      className="w-8 h-8 rounded-lg bg-white border border-amber-300 font-bold hover:bg-amber-100 cursor-pointer shadow-2xs flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ======================================================== */}
        {/* Ring 3: ٹانکے کی قسم (Stitch Complexity) */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200"
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                ۳
              </span>
              <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                {language === 'ur' ? 'ٹانکے کی نزاکت اور صفائی' : 'د ټانکې او ډیزاین ډول'}
              </h3>
            </div>
            <span className="text-xs font-bold text-[#059669] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {language === 'ur' ? selectedComplexity.patternNameUr : selectedComplexity.patternNamePs}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {COMPLEXITY_OPTIONS.map((c) => {
              const active = selectedComplexity.id === c.id;
              const isVoicePlaying = playingKey === c.id;
              return (
                <div
                  key={c.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={active}
                  onClick={() => {
                    playNeedleSnip();
                    onSelectComplexity(c);
                  }}
                  className={`relative p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center cursor-pointer select-none ${
                    active
                      ? 'border-[#059669] bg-emerald-50/70 shadow-sm scale-[1.02]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl mb-1.5 shadow-inner flex items-center justify-center text-white text-base font-bold"
                    style={{
                      background: c.texturePattern,
                      backgroundColor: c.swatchColor
                    }}
                  >
                    {c.id === 'simple' && '〰️'}
                    {c.id === 'phulkari' && '🌸'}
                    {c.id === 'shahi' && '🪞'}
                  </div>

                  <span className="font-bold text-xs sm:text-sm text-[#0F172A] leading-normal py-0.5">
                    {language === 'ur' ? c.patternNameUr : c.patternNamePs}
                  </span>

                  {!zeroLiteracy && (
                    <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 leading-normal">
                      {language === 'ur' ? c.descriptionUr : c.descriptionPs}
                    </span>
                  )}

                  {/* Urdu voice button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      const text = `${c.labelUr}۔ ${c.patternNameUr}۔ ${c.descriptionUr}۔`;
                      handlePlayVoiceOption(e, c.id, text);
                    }}
                    className={`absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isVoicePlaying
                        ? 'bg-[#059669] text-white animate-pulse'
                        : 'bg-slate-100 hover:bg-[#059669] hover:text-white text-slate-600'
                    }`}
                    title={language === 'ur' ? 'آواز سنیں' : 'غږ واورئ'}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {/* Custom Complexity Card */}
            <div
              role="button"
              tabIndex={0}
              aria-pressed={isCustomComplexityActive}
              onClick={() => {
                playNeedleSnip();
                updateCustomComplexity(customMultiplier, customPatternName);
              }}
              className={`relative p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center cursor-pointer select-none ${
                isCustomComplexityActive
                  ? 'border-[#059669] bg-emerald-50/70 shadow-sm scale-[1.02]'
                  : 'border-dashed border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl mb-1.5 border border-dashed border-emerald-400 bg-white flex items-center justify-center text-emerald-700 text-lg font-black">
                ✨
              </div>
              <span className="font-bold text-xs sm:text-sm text-[#059669] leading-normal py-0.5">
                {language === 'ur' ? 'خاص کاریگری' : 'ځانګړی هنر'}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 mt-0.5 font-mono">
                {customMultiplier}× {language === 'ur' ? 'نزاکت' : 'ضرب'}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  const text = `${customPatternName}۔ کام کی نزاکت کا ضرب ${customMultiplier} گنا۔`;
                  handlePlayVoiceOption(e, 'complexity-custom', text);
                }}
                className={`absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  playingKey === 'complexity-custom'
                    ? 'bg-[#059669] text-white animate-pulse'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
                title={language === 'ur' ? 'آواز سنیں' : 'غږ واورئ'}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Unified Custom Complexity Panel */}
          <AnimatePresence>
            {isCustomComplexityActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2.5 overflow-hidden"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-[#059669]">
                    {language === 'ur' ? 'کاریگری / نزاکت کا ضرب منتخب کریں:' : 'د کار د نزاکت کچه وټاکئ:'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[1.1, 1.3, 1.5, 1.8, 2.0].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setCustomMultiplier(m);
                          updateCustomComplexity(m, customPatternName);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          customMultiplier === m
                            ? 'bg-[#059669] text-white shadow-2xs'
                            : 'bg-white text-slate-700 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {m}×
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-emerald-200/60">
                  <span className="text-slate-600 font-medium shrink-0">
                    {language === 'ur' ? 'ٹانکے کا نام:' : 'د ټانکې نوم:'}
                  </span>
                  <input
                    type="text"
                    value={customPatternName}
                    onChange={(e) => {
                      setCustomPatternName(e.target.value);
                      updateCustomComplexity(customMultiplier, e.target.value);
                    }}
                    placeholder={language === 'ur' ? 'مثلاً: مکیش کا کام، کٹ ورک، کشمیری' : 'مثلاً: مکیش'}
                    className="flex-1 bg-white border border-emerald-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ======================================================== */}
      {/* Central Spinning Charkha Dial */}
      {/* ======================================================== */}
      <div className="relative my-7 flex flex-col items-center">
        {/* Pulsing prompt banner when waiting for spin */}
        {!hasCalculated && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="mb-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#0F766E] to-[#059669] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <span>👇</span>
            <span>
              {language === 'ur' ? 'اب چرخہ گھمائیں اور اپنا حق دیکھیں!' : 'اوس څرخ تاو کړئ او خپل حق ووینئ!'}
            </span>
          </motion.div>
        )}

        <div
          className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-3 shadow-2xl transition-transform duration-1000 ease-out flex items-center justify-center"
          style={{
            transform: `rotate(${wheelRotation}deg)`,
            background: 'conic-gradient(from 0deg, #0F766E, #059669, #D97706, #0F172A, #10B981, #0F766E)'
          }}
        >
          <div className="w-full h-full rounded-full p-2.5 bg-[#0F172A] shadow-inner flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-amber-400/40 pointer-events-none" />

            <div className="w-full h-full rounded-full bg-[#FAF6EE] relative flex items-center justify-center overflow-hidden border-4 border-amber-600/70">
              <div className="absolute top-2.5 text-base font-bold">🧵</div>
              <div className="absolute bottom-2.5 text-base font-bold">☀️</div>
              <div className="absolute left-2.5 text-base font-bold">🌸</div>
              <div className="absolute right-2.5 text-base font-bold">🪙</div>

              {/* Spin Button */}
              <button
                type="button"
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full wood-texture flex flex-col items-center justify-center text-white border-4 border-amber-400 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all group"
                title={language === 'ur' ? 'چرخہ گھمائیں' : 'څرخ تاو کړه'}
              >
                <div className="w-6 h-6 rounded-full bg-amber-400 mb-1 flex items-center justify-center text-xs shadow-xs text-amber-950 font-black">
                  ✦
                </div>
                <span className="font-extrabold text-base tracking-wide text-amber-100 font-heading">
                  {language === 'ur' ? 'چرخہ گھماؤ' : 'څرخ تاو کړه'}
                </span>
                <span className="text-[11px] text-amber-200 font-medium">
                  {language === 'ur' ? 'حق معلوم کریں' : 'حق معلوم کړه'}
                </span>
                <RotateCw
                  className={`w-4 h-4 text-amber-300 mt-0.5 group-hover:rotate-180 transition-transform ${
                    isSpinning ? 'animate-spin' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Needle Marker */}
        <div className="absolute -top-3 z-20 flex flex-col items-center pointer-events-none">
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-[#0F766E] filter drop-shadow-md" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-700 -mt-1" />
        </div>
      </div>
    </div>
  );
};
