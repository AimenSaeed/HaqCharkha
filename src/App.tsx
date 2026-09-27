/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, AudioVoice, SpoolOption, DayOption, ComplexityOption } from './types';
import { SPOOL_OPTIONS, DAY_OPTIONS, COMPLEXITY_OPTIONS, calculateFairWage } from './data/charkhaData';
import { Header, NavTab } from './components/Header';
import { CharkhaDial } from './components/CharkhaDial';
import { HaqWindow } from './components/HaqWindow';
import { VoiceNoteHelper } from './components/VoiceNoteHelper';
import { MohallahPoster } from './components/MohallahPoster';
import { MiddlemanSplit } from './components/MiddlemanSplit';
import { PaperCharkhaModal } from './components/PaperCharkhaModal';
import { playWoodenClack } from './utils/soundEffects';

export default function App() {
  const [language, setLanguage] = useState<Language>('ur');
  const [voiceType, setVoiceType] = useState<AudioVoice>('ur');
  const [activeTab, setActiveTab] = useState<NavTab>('wheel');
  const [zeroLiteracy, setZeroLiteracy] = useState<boolean>(false);

  // Artisan current ring selections
  const [selectedSpool, setSelectedSpool] = useState<SpoolOption>(SPOOL_OPTIONS[1]);
  const [selectedDay, setSelectedDay] = useState<DayOption>(DAY_OPTIONS[2]); // 7 days (1 week)
  const [selectedComplexity, setSelectedComplexity] = useState<ComplexityOption>(COMPLEXITY_OPTIONS[1]); // Phulkari

  // The calculated result is only updated when the wheel is spun!
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [calculatedResult, setCalculatedResult] = useState<{
    spool: SpoolOption;
    day: DayOption;
    complexity: ComplexityOption;
    wageInfo: ReturnType<typeof calculateFairWage>;
  } | null>(null);

  // Sync RTL and lang on root html
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = language;
  }, [language]);

  const handleToggleLanguage = () => {
    const nextLang: Language = language === 'ur' ? 'ps' : 'ur';
    setLanguage(nextLang);
    setVoiceType(nextLang);
  };

  const handleToggleVoice = () => {
    setVoiceType((prev) => (prev === 'ur' ? 'ps' : 'ur'));
  };

  const handleToggleZeroLiteracy = () => {
    setZeroLiteracy((prev) => !prev);
  };

  // Only on spin complete do we lock in the fair wage calculation and reveal the Haq Window
  const handleSpinComplete = () => {
    const wage = calculateFairWage(selectedSpool, selectedDay, selectedComplexity);
    setCalculatedResult({
      spool: selectedSpool,
      day: selectedDay,
      complexity: selectedComplexity,
      wageInfo: wage
    });
    setHasCalculated(true);

    // Smooth scroll to the revealed Haq result
    setTimeout(() => {
      const el = document.getElementById('haq-result-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans relative selection:bg-teal-100 selection:text-[#0F766E]">
      {/* Clean Header Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        voiceType={voiceType}
        onToggleVoice={handleToggleVoice}
        zeroLiteracy={zeroLiteracy}
        onToggleZeroLiteracy={handleToggleZeroLiteracy}
      />

      {/* Hero Sub Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-xs py-3.5 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F766E] font-heading tracking-tight leading-normal py-0.5 flex items-center gap-2">
              <span>{language === 'ur' ? 'حق چرخہ' : 'حق څرخ'}</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500">
                · {language === 'ur' ? 'مینگورہ اور خیبر پختونخوا کے کاریگروں کا عادلانہ معاوضہ' : 'د مینګوره او پښتونخوا د کاریګرو عادلانه حق'}
              </span>
            </h1>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              {language === 'ur'
                ? 'آسان تصویری اور صوتی رہنمائی — اپنی محنت کا پورا حق معلوم کریں اور بیوپاری کے سامنے ڈٹ جائیں'
                : 'اسانه انځوریز او غږیز لارښود — د خپل کار پوره حق معلوم کړئ او خپل حق واخلئ'}
            </p>
          </div>
        </div>
      </div>


      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 py-5">
        <AnimatePresence mode="wait">
          {/* Tab 1: 🎡 The Fair Price Wheel */}
          {activeTab === 'wheel' && (
            <motion.div
              key="tab-wheel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Quick Presets */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="font-bold text-[#0F766E] shrink-0 leading-normal">
                  {language === 'ur' ? 'تیز مثالیں:' : 'ګړندۍ بېلګې:'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    playWoodenClack();
                    setSelectedDay(DAY_OPTIONS[0]); // 1 day
                    setSelectedSpool(SPOOL_OPTIONS[0]); // Client thread
                    setSelectedComplexity(COMPLEXITY_OPTIONS[0]); // Simple
                    setHasCalculated(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:border-teal-300 whitespace-nowrap cursor-pointer leading-normal shadow-2xs transition-all font-semibold"
                >
                  ☀️ {language === 'ur' ? '۱ دن کا بارڈر' : '۱ ورځ بارډر'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playWoodenClack();
                    setSelectedDay(DAY_OPTIONS[2]); // 7 days
                    setSelectedSpool(SPOOL_OPTIONS[1]); // Cotton thread
                    setSelectedComplexity(COMPLEXITY_OPTIONS[1]); // Phulkari
                    setHasCalculated(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-300 text-[#0F766E] font-bold whitespace-nowrap cursor-pointer leading-normal shadow-2xs hover:bg-teal-100 transition-all"
                >
                  🌸 {language === 'ur' ? '۷ دن کا کُرتا (پھلکاری)' : '۷ ورځې قمیص (پلوکاري)'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playWoodenClack();
                    setSelectedDay(DAY_OPTIONS[3]); // 14 days
                    setSelectedSpool(SPOOL_OPTIONS[2]); // Silk / Tilla
                    setSelectedComplexity(COMPLEXITY_OPTIONS[2]); // Royal Heirloom
                    setHasCalculated(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:border-teal-300 whitespace-nowrap cursor-pointer leading-normal shadow-2xs transition-all font-semibold"
                >
                  🪞 {language === 'ur' ? '۱۴ دن کی شال / دلہن' : '۱۴ ورځې شال / ناوی'}
                </button>
              </div>

              {/* Interactive 3-Ring Charkha Dial */}
              <CharkhaDial
                selectedSpool={selectedSpool}
                selectedDay={selectedDay}
                selectedComplexity={selectedComplexity}
                onSelectSpool={setSelectedSpool}
                onSelectDay={setSelectedDay}
                onSelectComplexity={setSelectedComplexity}
                onSpinStart={() => {}}
                onSpinComplete={handleSpinComplete}
                hasCalculated={hasCalculated}
                language={language}
                voiceType={voiceType}
                zeroLiteracy={zeroLiteracy}
              />

              {/* Haq Window Reveal: Displays once the wheel is spun! */}
              {hasCalculated && calculatedResult && (
                <HaqWindow
                  calculatedWage={calculatedResult}
                  language={language}
                  voiceType={voiceType}
                  zeroLiteracy={zeroLiteracy}
                />
              )}
            </motion.div>
          )}

          {/* Tab 2: 🎙️ Voice Assistant */}
          {activeTab === 'voicenote' && (
            <motion.div
              key="tab-voicenote"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <VoiceNoteHelper
                language={language}
                voiceType={voiceType}
                onSetVoiceType={setVoiceType}
              />
            </motion.div>
          )}

          {/* Tab 3: 📜 Mohallah Collective Poster */}
          {activeTab === 'mohallah' && (
            <motion.div
              key="tab-mohallah"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <MohallahPoster language={language} />
            </motion.div>
          )}

          {/* Tab 4: ⚖️ Middleman Reality Mirror */}
          {activeTab === 'split' && (
            <motion.div
              key="tab-split"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <MiddlemanSplit language={language} />
            </motion.div>
          )}

          {/* Tab 5: ✂️ The Printable Paper Charkha */}
          {activeTab === 'paper' && (
            <motion.div
              key="tab-paper"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <PaperCharkhaModal language={language} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Clean Footer */}
      <footer className="mt-8 border-t border-slate-200 bg-white py-5 px-4 text-center text-xs text-slate-500 no-print leading-relaxed">
        <p className="font-bold text-[#0F766E] py-0.5">
          {language === 'ur' ? 'حق چرخہ © 2026' : 'د حق څرخ © 2026'}
        </p>
        <p className="mt-0.5 py-0.5">
          {language === 'ur'
            ? 'سوات، اسلام پور اور خیبر پختونخوا کی محنتی کاریگر بہنوں کے عادلانہ روزگار کے لیے'
            : 'د سوات، اسلام پور او خیبر پښتونخوا د زحمتکښو خویندو د عادلانه روزګار لپاره'}
        </p>
      </footer>
    </div>
  );
}
