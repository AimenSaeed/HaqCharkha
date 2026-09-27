import React, { useState } from 'react';
import { Language } from '../types';
import { playWoodenClack } from '../utils/soundEffects';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface MiddlemanSplitProps {
  language: Language;
}

export const MiddlemanSplit: React.FC<MiddlemanSplitProps> = ({ language }) => {
  const [splitRatio, setSplitRatio] = useState(25);

  const retailPrice = 8500; // Market price in big city bazaar
  const materialCost = 500;

  const minArtisan = 600;
  const fairArtisan = 4800;

  const artisanCut = Math.round(minArtisan + (fairArtisan - minArtisan) * (splitRatio / 100));
  const middlemanCut = retailPrice - artisanCut - materialCost;

  const artisanPercent = Math.round((artisanCut / retailPrice) * 100);
  const middlemanPercent = Math.round((middlemanCut / retailPrice) * 100);

  const isExploitative = splitRatio < 40;
  const isFair = splitRatio >= 75;

  return (
    <div className="w-full max-w-2xl mx-auto py-2">
      {/* Clear Purpose Card */}
      <div className="bg-white rounded-2xl p-4 mb-4 border border-[#E8DCC9] shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚖️</span>
          <h3 className="font-bold text-base text-[#1F2937] leading-normal">
            {language === 'ur' ? 'حقیقت کا آئینہ (یہ فیچر کیوں ہے؟)' : 'د حقیقت هینداره (دا ولې مهمه ده؟)'}
          </h3>
        </div>
        <p className="text-xs text-slate-700 mt-1 leading-relaxed">
          {language === 'ur'
            ? 'مقصد: یہ دکھانا کہ شہر کی دکان میں ۸,۵۰۰ روپے بکنے والے سوٹ پر کاریگر کو صرف ۶۰۰ روپے ملتے ہیں جبکہ بیوپاری بغیر محنت کے ۷,۴۰۰ روپے کما جاتا ہے۔ یہ سلیڈر بتاتا ہے کہ حق چرخہ کے ذریعے کاریگر کا حصہ کیسے بڑھتا ہے۔'
            : 'موخه: دا څرګندوي چې په ښار کې چې په ۸،۵۰۰ روپۍ سوټ پلورل کیږي، کاریګرې ته یوازې ۶۰۰ روپۍ ورکول کیږي او بیوپاري ۷،۴۰۰ روپۍ ګټي. دا ښيي چې د حق څرخ له لارې د خویندو برخه څنګه برابریږي.'}
        </p>
      </div>

      {/* Comparison Container */}
      <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE] rounded-3xl p-5 sm:p-6 shadow-md border-2 border-[#D97706]/30">
        <div className="text-center pb-4 mb-4 border-b border-[#E7D7C1]">
          <span className="text-xs font-bold text-slate-500 block uppercase leading-normal">
            {language === 'ur' ? 'شہر کے بازار میں سوٹ کی فروخت کی قیمت' : 'په ښار کې د سوټ د پلور بیه'}
          </span>
          <div className="text-3xl font-black text-[#1F2937] font-mono mt-0.5">
            ₨ {retailPrice.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 block leading-normal">
            {language === 'ur' ? '(دھاگے کا خرچ: ₨ ۵۰۰)' : '(د تار او رنګ لګښت: ۵۰۰ روپۍ)'}
          </span>
        </div>

        {/* 2-Side Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {/* Artisan Side */}
          <div
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              isExploitative
                ? 'bg-rose-50 border-rose-400'
                : isFair
                ? 'bg-emerald-50 border-emerald-500'
                : 'bg-amber-50 border-amber-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-2xl">{isExploitative ? '💔' : isFair ? '🤲✨' : '✋'}</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isExploitative
                      ? 'bg-rose-200 text-rose-900'
                      : isFair
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  {artisanPercent}% {language === 'ur' ? 'حصہ' : 'برخه'}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-800 leading-normal py-0.5">
                {language === 'ur' ? 'کاریگر بہن کا معاوضہ' : 'د کاریګرې خور مزدوري'}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed py-0.5">
                {isExploitative
                  ? language === 'ur' ? '۱۴ دن کی کمر توڑ محنت کے بعد صرف چند سو روپے!' : 'د ۱۴ ورځو سخت محنت وروسته یوازې څو سوه روپۍ!'
                  : isFair
                  ? language === 'ur' ? 'عزت کا پورا معاوضہ (حق چرخہ ریٹ)' : 'د عزت پوره مزدوري (د حق څرخ نرخ)'
                  : language === 'ur' ? 'بہتری کا آغاز' : 'د انصاف پیل'}
              </p>
            </div>

            <div className="mt-4 pt-2 border-t border-black/10">
              <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                ₨ {artisanCut.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Middleman Side */}
          <div
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              isExploitative
                ? 'bg-amber-100/70 border-amber-500'
                : isFair
                ? 'bg-slate-100 border-slate-300'
                : 'bg-amber-50 border-amber-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-2xl">{isExploitative ? '💰' : isFair ? '🤝' : '💼'}</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isExploitative
                      ? 'bg-amber-300 text-amber-950 font-black'
                      : isFair
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  {middlemanPercent}% {language === 'ur' ? 'منافع' : 'ګټه'}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-800 leading-normal py-0.5">
                {language === 'ur' ? 'بیوپاری کا منافع' : 'د بیوپاري ګټه'}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed py-0.5">
                {isExploitative
                  ? language === 'ur' ? 'بغیر کسی ہاتھ کی محنت کے سارا منافع جیب میں!' : 'بې له کوم کار نه ټوله ګټه په جیب کې!'
                  : isFair
                  ? language === 'ur' ? 'صرف مناسب ٹرانسپورٹ اور دکان کا خرچہ' : 'یوازې د مناسب کرایې او دکان لګښت'
                  : language === 'ur' ? 'منافع میں کمی' : 'د ګټې اعتدال'}
              </p>
            </div>

            <div className="mt-4 pt-2 border-t border-black/10">
              <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                ₨ {middlemanCut.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* The Interactive Slider */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7D7C1] shadow-xs">
          <div className="flex items-center justify-between mb-2 text-xs font-bold leading-normal">
            <span className="text-rose-600 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {language === 'ur' ? 'پرانا غیر منصفانہ طریقہ' : 'پخوانۍ بې انصافه طریقه'}
            </span>
            <span className="text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {language === 'ur' ? 'حق چرخہ کا عادلانہ طریقہ' : 'د حق څرخ عادلانه طریقه'}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={splitRatio}
            onChange={(e) => {
              playWoodenClack(0.9);
              setSplitRatio(Number(e.target.value));
            }}
            className="w-full h-3 bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-500 rounded-lg appearance-none cursor-pointer accent-[#9B1C1C]"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 leading-normal">
            <span>{language === 'ur' ? 'سلیڈر آگے بڑھا کر فرق دیکھیں' : 'تڼۍ مخکې کړئ او فرق ووینئ'}</span>
            <span className="font-bold text-[#78350F]">
              {splitRatio < 40
                ? language === 'ur' ? '⚠️ کاریگر کا شدید نقصان' : '⚠️ د کاریګرې سخت زیان'
                : splitRatio >= 75
                ? language === 'ur' ? '✅ عزت اور برابری کا حق' : '✅ د عزت او انصاف حق'
                : language === 'ur' ? 'درمیانی کیفیت' : 'منځنی حالت'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
