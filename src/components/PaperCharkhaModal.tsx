import React, { useState } from 'react';
import { Language } from '../types';
import { playNeedleSnip } from '../utils/soundEffects';
import { downloadElementAsPDF, printElement } from '../utils/printDownload';
import { Printer, Scissors, WifiOff, RotateCw, Download, Loader2 } from 'lucide-react';

interface PaperCharkhaModalProps {
  language: Language;
}

export const PaperCharkhaModal: React.FC<PaperCharkhaModalProps> = ({ language }) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handlePrint = () => {
    playNeedleSnip();
    printElement('printable-paper-charkha', language === 'ur' ? 'کاغذی حق چرخہ - پرنٹ پیج' : 'کاغذي حق څرخ - د پرنټ پاڼه');
  };

  const handleDownloadPDF = async () => {
    playNeedleSnip();
    setIsExportingPDF(true);
    await downloadElementAsPDF({
      elementId: 'printable-paper-charkha',
      filename: `Paper-Charkha-Dial-${language}.pdf`,
      title: language === 'ur' ? 'کاغذی حق چرخہ' : 'کاغذي حق څرخ',
      onComplete: () => setIsExportingPDF(false),
      onError: () => setIsExportingPDF(false)
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-2">
      {/* Intro Header explaining purpose clearly */}
      <div className="bg-white rounded-2xl p-4 mb-4 border border-[#E8DCC9] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">✂️</span>
            <h3 className="font-bold text-base text-[#1F2937] leading-normal">
              {language === 'ur' ? 'کاغذی چرخہ (بغیر موبائل اور انٹرنیٹ)' : 'کاغذي څرخ (بې له موبایل او انټرنیټ)'}
            </h3>
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {language === 'ur'
              ? 'مقصد: دیہات میں جب موبائل چارج نہ ہو یا انٹرنیٹ بند ہو، کاریگر بہنیں اس کاغذ کو کاٹ کر گود میں رکھ کر ہاتھ سے چرخہ گھما سکتی ہیں۔'
              : 'موخه: په کلیو کې کله چې موبایل چارج نه وي یا انټرنیټ بند وي، خویندې دا کاغذ پرې کوي او په لاس یې تاووي.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer leading-normal"
            title={language === 'ur' ? 'پرنٹ نکالیں' : 'چاپ کړئ'}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{language === 'ur' ? 'پرنٹ' : 'پرنټ'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isExportingPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#9B1C1C] hover:bg-[#78350F] text-white text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer leading-normal disabled:opacity-50"
            title={language === 'ur' ? 'اصل PDF ڈاؤنلوڈ کریں' : 'اصلي PDF ډاونلوډ کړئ'}
          >
            {isExportingPDF ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>{isExportingPDF ? (language === 'ur' ? 'تیار ہو رہا ہے...' : 'جوړیږي...') : (language === 'ur' ? 'PDF محفوظ کریں' : 'PDF ډاونلوډ')}</span>
          </button>
        </div>
      </div>

      {/* 4 Simple Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-center">
        <div className="p-3 rounded-xl bg-white border border-[#E7D7C1] shadow-xs">
          <div className="w-6 h-6 mx-auto rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs mb-1">
            ۱
          </div>
          <span className="font-bold text-xs text-slate-800 block leading-normal py-0.5">
            {language === 'ur' ? 'پرنٹ کریں' : 'کاغذ چاپ کړئ'}
          </span>
          <span className="text-[10px] text-slate-500 block leading-normal">
            {language === 'ur' ? 'A4 کاغذ یا گتے پر' : 'په A4 کاغذ یا کارت'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white border border-[#E7D7C1] shadow-xs">
          <div className="w-6 h-6 mx-auto rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs mb-1">
            ۲
          </div>
          <span className="font-bold text-xs text-slate-800 block leading-normal py-0.5">
            {language === 'ur' ? 'دائرے کاٹیں' : 'دایرې پرې کړئ'}
          </span>
          <span className="text-[10px] text-slate-500 block leading-normal">
            {language === 'ur' ? 'قینچی سے گولائی میں' : 'په قیچۍ باندې په ګرد شکل'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white border border-[#E7D7C1] shadow-xs">
          <div className="w-6 h-6 mx-auto rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs mb-1">
            ۳
          </div>
          <span className="font-bold text-xs text-slate-800 block leading-normal py-0.5">
            {language === 'ur' ? 'پن لگائیں' : 'ستن ولګوئ'}
          </span>
          <span className="text-[10px] text-slate-500 block leading-normal">
            {language === 'ur' ? 'درمیان کے سوراخ میں' : 'په منځني سوري کې'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white border border-[#E7D7C1] shadow-xs">
          <div className="w-6 h-6 mx-auto rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs mb-1">
            ۴
          </div>
          <span className="font-bold text-xs text-slate-800 block leading-normal py-0.5">
            {language === 'ur' ? 'چرخہ گھمائیں' : 'څرخ تاو کړئ'}
          </span>
          <span className="text-[10px] text-slate-500 block leading-normal">
            {language === 'ur' ? 'گود میں رکھ کر ریٹ دیکھیں' : 'په غېږ کې نرخ معلوم کړئ'}
          </span>
        </div>
      </div>

      {/* Clean Printable Diagram (No overflow, properly proportioned) */}
      <div
        id="printable-paper-charkha"
        className="bg-white rounded-3xl p-6 shadow-md border-2 border-slate-300 relative print:border-none print:shadow-none print:p-0"
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <div>
            <h4 className="font-bold text-base text-[#78350F] leading-normal py-0.5">
              {language === 'ur' ? 'کاغذی چرخہ کے دو دائرے' : 'د کاغذي څرخ دوه دایرې'}
            </h4>
            <span className="text-xs text-slate-500 block leading-normal">
              {language === 'ur' ? 'باہر کی کٹی ہوئی لکیر سے کاٹیں' : 'د دایرې د کرښې له مخې پرې کړئ'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#9B1C1C] font-bold">
            <Scissors className="w-4 h-4" />
            <span>{language === 'ur' ? 'قینچی سے کاٹیں' : 'په قیچۍ پرې کړئ'}</span>
          </div>
        </div>

        {/* Both Discs neatly aligned and spaced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center justify-items-center py-4">
          {/* Disc 1: Large Base Wheel (Labor Days & Wages) */}
          <div className="flex flex-col items-center w-full max-w-[270px]">
            <span className="text-xs font-bold text-slate-800 mb-2 text-center leading-normal">
              {language === 'ur' ? 'ڈسک نمبر ۱: نچلا دائرہ (ریٹ چارٹ)' : 'ډیسک ۱: لاندینۍ دایره (نرخونه)'}
            </span>

            <div className="relative w-60 h-60 rounded-full border-4 border-dashed border-[#C53030] bg-[#FAF6EE] flex items-center justify-center p-3 shadow-inner">
              {/* Spoke items with ample padding to avoid any text clipping */}
              <div className="absolute top-2.5 text-center">
                <span className="text-[11px] font-bold text-[#78350F] block leading-normal">
                  {language === 'ur' ? '۱ دن ☀️' : '۱ ورځ ☀️'}
                </span>
                <span className="text-[11px] font-black text-[#059669]">₨ 1,200</span>
              </div>

              <div className="absolute right-2.5 text-right rtl:text-left">
                <span className="text-[11px] font-bold text-[#78350F] block leading-normal">
                  {language === 'ur' ? '۳ دن ☀️×۳' : '۳ ورځې ☀️×۳'}
                </span>
                <span className="text-[11px] font-black text-[#059669]">₨ 2,500</span>
              </div>

              <div className="absolute bottom-2.5 text-center">
                <span className="text-[11px] font-bold text-[#78350F] block leading-normal">
                  {language === 'ur' ? '۷ دن ☀️×۷' : '۷ ورځې ☀️×۷'}
                </span>
                <span className="text-[11px] font-black text-[#9B1C1C]">₨ 4,800</span>
              </div>

              <div className="absolute left-2.5 text-left rtl:text-right">
                <span className="text-[11px] font-bold text-[#78350F] block leading-normal">
                  {language === 'ur' ? '۱۴ دن 🌙' : '۱۴ ورځې 🌙'}
                </span>
                <span className="text-[11px] font-black text-[#059669]">₨ 11,500</span>
              </div>

              {/* Center Pin Indicator */}
              <div className="w-10 h-10 rounded-full border-2 border-red-600 bg-white flex flex-col items-center justify-center text-[9px] font-bold text-red-600 shadow-xs">
                <span>📌</span>
                <span className="leading-tight">{language === 'ur' ? 'پن' : 'ستن'}</span>
              </div>
            </div>

            <span className="text-[11px] text-slate-500 mt-2 text-center leading-normal">
              {language === 'ur' ? 'اس دائرے کو نیچے رکھیں' : 'دا دایره لاندې کېږدئ'}
            </span>
          </div>

          {/* Disc 2: Top Cover Disc with Cutout Window */}
          <div className="flex flex-col items-center w-full max-w-[270px]">
            <span className="text-xs font-bold text-slate-800 mb-2 text-center leading-normal">
              {language === 'ur' ? 'ڈسک نمبر ۲: اوپر والا دائرہ (دریچہ)' : 'ډیسک ۲: پورتنۍ دایره (کړکۍ)'}
            </span>

            <div className="relative w-52 h-52 rounded-full border-4 border-dashed border-[#0F766E] bg-[#F0FDFA] flex items-center justify-center p-3 shadow-inner">
              {/* The Cutout Shutter Window */}
              <div className="absolute top-2 w-22 h-14 rounded-lg border-2 border-red-500 bg-white flex flex-col items-center justify-center text-center shadow-xs">
                <span className="text-[9px] text-red-600 font-bold uppercase leading-normal">
                  {language === 'ur' ? 'کھڑکی کاٹیں' : 'کړکۍ پرې کړئ'}
                </span>
                <span className="text-[10px] font-black text-red-700 leading-normal">
                  {language === 'ur' ? '✂️ ونڈو' : '✂️ کړکۍ'}
                </span>
              </div>

              <div className="absolute bottom-3 text-center">
                <span className="text-xs font-bold text-[#0F766E] flex items-center gap-1 justify-center leading-normal">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{language === 'ur' ? 'چرخہ گھمائیں' : 'څرخ تاو کړئ'}</span>
                </span>
              </div>

              {/* Center Pin Indicator */}
              <div className="w-10 h-10 rounded-full border-2 border-teal-700 bg-white flex flex-col items-center justify-center text-[9px] font-bold text-teal-800 shadow-xs">
                <span>📌</span>
                <span className="leading-tight">{language === 'ur' ? 'پن' : 'ستن'}</span>
              </div>
            </div>

            <span className="text-[11px] text-slate-500 mt-2 text-center leading-normal">
              {language === 'ur' ? 'کھڑکی کاٹ کر نچلی ڈسک کے اوپر رکھیں' : 'کړکۍ پرې کړئ او په لاندینۍ دایره یې کېږدئ'}
            </span>
          </div>
        </div>

        {/* Offline Banner */}
        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-[#78350F] flex items-center justify-between">
          <span className="flex items-center gap-1.5 leading-normal">
            <WifiOff className="w-4 h-4 text-[#C53030] shrink-0" />
            <span>
              {language === 'ur'
                ? 'دیہی سوات کی بہنوں کے لیے: بغیر بجلی اور اسمارٹ فون کے ہمیشہ کارآمد'
                : 'د کلیوالو خویندو لپاره: بې له برېښنا او سمارټ فون تل ګټور'}
            </span>
          </span>
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="font-bold underline text-[#9B1C1C] hover:text-black cursor-pointer shrink-0 leading-normal"
          >
            {language === 'ur' ? 'PDF محفوظ کریں' : 'PDF ډاونلوډ'}
          </button>
        </div>
      </div>
    </div>
  );
};
