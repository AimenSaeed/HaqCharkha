import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { SpoolOption, DayOption, ComplexityOption, Language, AudioVoice } from '../types';
import { calculateFairWage, breakdownCurrencyNotes } from '../data/charkhaData';
import { speakMessage, stopSpeaking } from '../utils/audioSpeech';
import { playCoinJingle, playNeedleSnip } from '../utils/soundEffects';
import { downloadElementAsPDF, printElement } from '../utils/printDownload';
import { CurrencyStack } from './CurrencyStack';
import { Volume2, VolumeX, CheckCircle2, Share2, Printer, Download, Loader2, Sparkles } from 'lucide-react';

interface HaqWindowProps {
  calculatedWage: {
    spool: SpoolOption;
    day: DayOption;
    complexity: ComplexityOption;
    wageInfo: ReturnType<typeof calculateFairWage>;
  };
  language: Language;
  voiceType: AudioVoice;
  zeroLiteracy: boolean;
}

export const HaqWindow: React.FC<HaqWindowProps> = ({
  calculatedWage,
  language,
  voiceType,
  zeroLiteracy
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { spool, day, complexity, wageInfo } = calculatedWage;
  const currencyNotes = breakdownCurrencyNotes(wageInfo.min);

  // Celebratory particles
  useEffect(() => {
    playCoinJingle();

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = canvas.parentElement?.clientWidth || 400;
        canvas.height = 140;

        const particles: Array<{
          x: number;
          y: number;
          vx: number;
          vy: number;
          color: string;
          size: number;
          life: number;
        }> = [];

        const colors = ['#0F766E', '#059669', '#D97706', '#2563EB', '#F59E0B', '#10B981'];
        for (let i = 0; i < 50; i++) {
          particles.push({
            x: canvas.width / 2,
            y: 50,
            vx: (Math.random() - 0.5) * 9,
            vy: (Math.random() - 0.6) * 7,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 4 + 3,
            life: 1.0
          });
        }

        let animId: number;
        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          let alive = false;
          particles.forEach((p) => {
            if (p.life > 0) {
              alive = true;
              p.x += p.vx;
              p.y += p.vy;
              p.vy += 0.15;
              p.life -= 0.022;
              ctx.fillStyle = p.color;
              ctx.globalAlpha = Math.max(0, p.life);
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
            }
          });
          if (alive) {
            animId = requestAnimationFrame(animate);
          }
        };
        animate();
        return () => cancelAnimationFrame(animId);
      }
    }
  }, [wageInfo.min]);

  const handlePlayVoice = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const text =
      language === 'ur'
        ? `باجی، اگر اس سوٹ پر آپ کے ${day.days} دن لگے ہیں، تو ${wageInfo.min} سے ${wageInfo.max} روپے سے کم لینا آپ کی کمر اور آنکھوں کے ساتھ ناانصافی ہے۔ یہ آپ کی محنت کا حق ہے!`
        : `خورې! په دې قمیص که تا پوره ${day.days} ورځې لګولې وي، نو له ${wageInfo.min} تر ${wageInfo.max} روپو کم مه اخلئ۔ دا ستا حق دی!`;

    speakMessage(text, 'ur', () => {
      setIsPlayingAudio(false);
    });
  };

  const handleWhatsAppShare = () => {
    playNeedleSnip();
    const text =
      language === 'ur'
        ? `حق چرخہ کا منصفانہ نرخ نامہ:\nکام کی تفصیل: ${day.labelUr}\nدھاگہ: ${spool.labelUr}\nٹانکہ: ${complexity.patternNameUr}\nمنصفانہ معاوضہ: ₨ ${wageInfo.min.toLocaleString()} سے ₨ ${wageInfo.max.toLocaleString()}\nاس سے کم پر کام مت کریں!`
        : `د حق څرخ منصفانه نرخ نامه:\nد کار تفصیل: ${day.labelPs}\nتار: ${spool.labelPs}\nټانکه: ${complexity.patternNamePs}\nمنصفانه مزدوري: ₨ ${wageInfo.min.toLocaleString()} تر ₨ ${wageInfo.max.toLocaleString()}\nله دې کم کار مه کوئ!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    playNeedleSnip();
    printElement('printable-haq-window', language === 'ur' ? 'حق دریچہ - معاوضہ پرچی' : 'د حق کړکۍ - مزدوري پرچی');
  };

  const handleDownloadPDF = async () => {
    playNeedleSnip();
    setIsExportingPDF(true);
    await downloadElementAsPDF({
      elementId: 'printable-haq-window',
      filename: `Haq-Wage-Slip-${language}.pdf`,
      title: language === 'ur' ? 'حق چرخہ منصفانہ معاوضہ' : 'د حق څرخ منصفانه مزدوري',
      onComplete: () => setIsExportingPDF(false),
      onError: () => setIsExportingPDF(false)
    });
  };

  return (
    <motion.div
      id="haq-result-section"
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative w-full max-w-xl mx-auto my-6"
    >
      <div className="relative rounded-3xl p-1 bg-gradient-to-b from-[#0F766E] via-[#059669] to-[#0F172A] shadow-2xl overflow-hidden">
        <div
          id="printable-haq-window"
          className="relative rounded-[22px] bg-gradient-to-b from-[#FFFFFF] via-[#FAF9F5] to-[#F3F4F6] p-5 sm:p-6 border-2 border-[#10B981]/30"
        >
          <canvas ref={canvasRef} className="absolute top-0 left-0 right-0 w-full pointer-events-none z-20" />

          {/* Shutter Header with Dark Teal and Emerald branding */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#059669] text-white flex items-center justify-center font-bold text-lg shadow-md">
                ⚖️
              </span>
              <div>
                <h3 className="font-bold text-[#0F172A] text-base sm:text-lg leading-normal py-0.5 flex items-center gap-1.5">
                  <span>{language === 'ur' ? 'حق دریچہ (آپ کی محنت کا حق)' : 'د حق کړکۍ (ستاسو د لاس مزدوري)'}</span>
                  <Sparkles className="w-4 h-4 text-amber-500 inline" />
                </h3>
                <p className="text-xs text-[#0F766E] font-medium leading-normal">
                  {language === 'ur' ? `${day.labelUr} · ${spool.labelUr}` : `${day.labelPs} · ${spool.labelPs}`}
                </p>
              </div>
            </div>

            {/* Audio Button */}
            <button
              type="button"
              onClick={handlePlayVoice}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all shadow-xs cursor-pointer ${
                isPlayingAudio
                  ? 'bg-[#C53030] text-white animate-pulse'
                  : 'bg-teal-50 text-[#0F766E] hover:bg-teal-100 border border-teal-300'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4 animate-bounce" />
                  <span>{language === 'ur' ? 'آواز بند کریں' : 'غږ بند کړئ'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#0F766E]" />
                  <span>{language === 'ur' ? 'آواز سنیں' : 'غږ واورئ'}</span>
                </>
              )}
            </button>
          </div>

          {/* Main Price Highlight */}
          <div className="text-center my-4 py-3 bg-gradient-to-b from-emerald-50/70 to-teal-50/50 rounded-2xl border border-emerald-200/60 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] block mb-1">
              {language === 'ur' ? 'کاریگر بہن کا منصفانہ معاوضہ' : 'د کاریګرې لږ تر لږه حق'}
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2 my-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#0F766E]">₨</span>
              <span className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight font-mono">
                {wageInfo.min.toLocaleString()}
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-500 px-1">
                {language === 'ur' ? 'سے' : 'تر'}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-[#059669]">₨</span>
              <span className="text-3xl sm:text-4xl font-black text-[#059669] font-mono">
                {wageInfo.max.toLocaleString()}
              </span>
            </div>

            <p className="text-xs font-semibold text-[#0F766E] flex items-center justify-center gap-1.5 mt-2 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
              <span>
                {language === 'ur'
                  ? 'اس سے ایک روپیہ بھی کم لینا آپ کی کمر اور آنکھوں پر ظلم ہے'
                  : 'له دې کم اخیستل ظلم دی'}
              </span>
            </p>
          </div>

          {/* Spoken Advice Quote */}
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border-r-4 border-amber-500 shadow-2xs">
            <p className="text-xs sm:text-sm font-medium text-amber-950 leading-relaxed">
              {language === 'ur'
                ? `باجی، اگر اس سوٹ پر آپ کے ${day.days} دن لگے ہیں، تو ₨ ${wageInfo.min.toLocaleString()} سے کم لینا ناانصافی ہے۔ بیوپاری کو کہیں پورا محلہ اس سے کم پر راضی نہیں ہوگا!`
                : `خورې! په دې کار که تا ${day.days} ورځې لګولې وي، نو له ₨ ${wageInfo.min.toLocaleString()} کم مه اخلئ۔ ټوله محله په یوه نرخ ولاړه ده!`}
            </p>
          </div>

          {/* Visual Banknote Breakdown - FOR LOW LITERACY & CASH VERIFICATION */}
          <CurrencyStack notes={currencyNotes} language={language} zeroLiteracy={zeroLiteracy} />

          {/* Transparent Wage Math */}
          {!zeroLiteracy && (
            <div className="grid grid-cols-3 gap-2 py-3 px-2 bg-slate-100/80 rounded-xl text-center text-xs border border-slate-200 mb-3">
              <div>
                <span className="block text-[10px] text-slate-500 font-semibold leading-normal">
                  {language === 'ur' ? 'سامان کی لاگت' : 'د سامان لګښت'}
                </span>
                <span className="font-bold text-[#0F172A] text-sm font-mono">
                  ₨ {wageInfo.materialCost.toLocaleString()}
                </span>
              </div>
              <div className="border-x border-slate-300">
                <span className="block text-[10px] text-slate-500 font-semibold leading-normal">
                  {language === 'ur' ? 'خالص مزدوری' : 'خالصه مزدوري'}
                </span>
                <span className="font-bold text-[#059669] text-sm font-mono">
                  ₨ {wageInfo.laborPortion.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 font-semibold leading-normal">
                  {language === 'ur' ? 'کل وقت' : 'ټول ساعتونه'}
                </span>
                <span className="font-bold text-[#2563EB] text-sm font-mono">
                  {wageInfo.hours} {language === 'ur' ? 'گھنٹے' : 'ساعته'}
                </span>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition-transform active:scale-[0.98] cursor-pointer leading-normal"
                title={language === 'ur' ? 'پرچی پرنٹ کریں' : 'پرچی چاپ کړئ'}
              >
                <Printer className="w-4 h-4" />
                <span>{language === 'ur' ? 'پرنٹ نکالیں' : 'پرنټ کړئ'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isExportingPDF}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs shadow-xs transition-transform active:scale-[0.98] cursor-pointer leading-normal disabled:opacity-50"
                title={language === 'ur' ? 'معاوضہ کی پرچی PDF ڈاؤنلوڈ کریں' : 'د مزدوري پرچی PDF ډاونلوډ کړئ'}
              >
                {isExportingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>
                  {isExportingPDF
                    ? language === 'ur'
                      ? 'تیار ہو رہا ہے...'
                      : 'جوړیږي...'
                    : language === 'ur'
                    ? 'PDF محفوظ کریں'
                    : 'PDF ډاونلوډ'}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs sm:text-sm shadow-md transition-transform active:scale-[0.98] cursor-pointer leading-normal"
            >
              <Share2 className="w-4 h-4" />
              <span>{language === 'ur' ? 'واٹس ایپ پر باجیوں اور بیوپاری کو بھیجیں' : 'په واټس‌اپ نرخ شریک کړئ'}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
