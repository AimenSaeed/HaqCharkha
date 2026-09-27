import React from 'react';
import { motion } from 'motion/react';
import { CurrencyNote, Language } from '../types';
import { speakMessage } from '../utils/audioSpeech';
import { playCoinJingle } from '../utils/soundEffects';
import { Volume2 } from 'lucide-react';

interface CurrencyStackProps {
  notes: CurrencyNote[];
  language: Language;
  zeroLiteracy: boolean;
}

export const CurrencyStack: React.FC<CurrencyStackProps> = ({ notes, language, zeroLiteracy }) => {
  const handleSpeakNote = (note: CurrencyNote) => {
    playCoinJingle();
    const countText =
      note.count === 1
        ? 'ایک نوٹ'
        : note.count === 2
        ? 'دو نوٹ'
        : note.count === 3
        ? 'تین نوٹ'
        : `${note.count} نوٹ`;
    const speech = `${note.titleUr}، کل ${countText}۔ ${note.landmarkUr}۔`;
    speakMessage(speech, 'ur');
  };

  return (
    <div className="w-full my-3 p-3.5 rounded-2xl bg-white/95 border border-[#0F766E]/20 shadow-xs">
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
        <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
          <span className="text-lg">💵</span>
          <span>
            {language === 'ur'
              ? 'نقدی نوٹوں کی تصویری گنتی (ہاتھ میں رقم)'
              : 'د نغدو نوټونو حساب (په لاس پیسې)'}
          </span>
        </h4>
        <span className="text-[11px] font-medium text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
          {language === 'ur' ? 'نوٹ گننے کا آسان طریقہ' : 'د نوټونو اسانه شمېرنه'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {notes.map((note, index) => (
          <motion.div
            key={note.denomination}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.3 }}
            className={`relative p-3 rounded-xl border-2 flex items-center justify-between overflow-hidden shadow-xs hover:shadow-md transition-all ${note.color}`}
          >
            {/* Watermark circle */}
            <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full border-4 border-black/5 opacity-40 pointer-events-none" />

            <div className="flex items-center gap-3">
              {/* Stack visual badge */}
              <div
                className="w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold shadow-xs text-white shrink-0"
                style={{ backgroundColor: note.accentColor }}
              >
                <span className="text-[10px] tracking-tighter opacity-80">₨</span>
                <span className="text-sm font-black leading-tight">
                  {note.denomination >= 1000 ? `${note.denomination / 1000}k` : note.denomination}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm sm:text-base font-black text-[#0F172A]">
                    {language === 'ur' ? note.titleUr : note.titlePs}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/90 border border-black/10 text-slate-900 shadow-2xs">
                    × {note.count} {language === 'ur' ? 'نوٹ' : 'نوټونه'}
                  </span>
                </div>
                {!zeroLiteracy && (
                  <p className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">
                    {language === 'ur' ? note.landmarkUr : note.landmarkPs}
                  </p>
                )}
              </div>
            </div>

            {/* Visual bill representations + Audio Listen Button */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex -space-x-2 rtl:space-x-reverse overflow-hidden">
                {Array.from({ length: Math.min(note.count, 4) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-9 rounded border border-black/20 bg-white/95 shadow-xs flex items-center justify-center text-[9px] font-bold text-slate-800"
                    style={{
                      transform: `rotate(${(i - 1) * 4}deg)`,
                      borderColor: note.accentColor
                    }}
                  >
                    ₨
                  </div>
                ))}
                {note.count > 4 && (
                  <div className="w-6 h-9 rounded border border-black/20 bg-amber-100 shadow-xs flex items-center justify-center text-[10px] font-black text-amber-900">
                    +{note.count - 4}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleSpeakNote(note)}
                className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#0F766E] border border-black/10 shadow-2xs flex items-center justify-center cursor-pointer transition-transform active:scale-95"
                title={language === 'ur' ? 'نوٹ کی آواز سنیں' : 'د نوټ غږ واورئ'}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
