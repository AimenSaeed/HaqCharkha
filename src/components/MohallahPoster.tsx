import React, { useState } from 'react';
import { Language } from '../types';
import { playNeedleSnip, playCoinJingle } from '../utils/soundEffects';
import { downloadElementAsPDF, printElement } from '../utils/printDownload';
import { Printer, Share2, MapPin, CheckCircle, ShieldCheck, Download, Loader2 } from 'lucide-react';

interface MohallahPosterProps {
  language: Language;
}

const LOCALITIES_UR = [
  'محلہ حاجی بابا، مینگورہ (سوات)',
  'اسلام پور ہینڈلوم و کڑھائی مرکز (سوات)',
  'محلہ سیدو شریف (سوات)',
  'مدین و بحرین روڈ، سوات',
  'محلہ بنڑ، مینگورہ'
];

const LOCALITIES_PS = [
  'د حاجي بابا محله، مینګوره (سوات)',
  'اسلام پور هینډلوم او ګنډلو مرکز (سوات)',
  'سیدو شریف محله (سوات)',
  'مدین او بحرین سړک، سوات',
  'بنړ محله، مینګوره'
];

export const MohallahPoster: React.FC<MohallahPosterProps> = ({ language }) => {
  const localities = language === 'ur' ? LOCALITIES_UR : LOCALITIES_PS;
  const [selectedLocality, setSelectedLocality] = useState(localities[0]);
  const [customLocality, setCustomLocality] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const displayLocality = customLocality.trim() ? customLocality : selectedLocality;

  const handlePrint = () => {
    playNeedleSnip();
    printElement('printable-poster', language === 'ur' ? `حق چرخہ نرخ نامہ - ${displayLocality}` : `د حق څرخ نرخ نامه - ${displayLocality}`);
  };

  const handleDownloadPDF = async () => {
    playNeedleSnip();
    setIsExportingPDF(true);
    await downloadElementAsPDF({
      elementId: 'printable-poster',
      filename: `Haq-Charkha-NarkhNama-${language}.pdf`,
      title: language === 'ur' ? `حق چرخہ نرخ نامہ - ${displayLocality}` : `د حق څرخ نرخ نامه - ${displayLocality}`,
      onComplete: () => setIsExportingPDF(false),
      onError: () => setIsExportingPDF(false)
    });
  };

  const handleShare = () => {
    playNeedleSnip();
    const text =
      language === 'ur'
        ? `📜 محلے کا باہمی نرخ نامہ (${displayLocality})\nکاریگر بہنوں کا متفقہ فیصلہ:\n• ۱ دن کا کام = کم از کم ₨ 1,200\n• ۳ دن کا کام = کم از کم ₨ 2,500\n• ۷ دن کا کُرتا = کم از کم ₨ 4,800\n• ۱۴ دن کی شال = کم از کم ₨ 11,500\nپورے محلے کا یہی ایک ریٹ ہے!`
        : `📜 د محلي متفقه نرخ نامه (${displayLocality})\nد کاریګرو خویندو پرېکړه:\n• ۱ ورځ کار = لږ تر لږه ₨ 1,200\n• ۳ ورځې کار = لږ تر لږه ₨ 2,500\n• ۷ ورځې قمیص = لږ تر لږه ₨ 4,800\n• ۱۴ ورځې شال = لږ تر لږه ₨ 11,500\nټول کلي دا یوه پرېکړه کړې ده!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePledgeSign = () => {
    playCoinJingle();
    setIsSigned(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-2">
      {/* Purpose Banner */}
      <div className="bg-white rounded-2xl p-4 mb-4 border border-[#E8DCC9] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h3 className="font-bold text-base text-[#1F2937] leading-normal">
              {language === 'ur' ? 'محلے کا متفقہ نرخ نامہ (ایک آواز، ایک ریٹ)' : 'د محلي متفقه نرخ نامه (یو غږ، یو نرخ)'}
            </h3>
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {language === 'ur'
              ? 'اکیلی عورت جب بیوپاری کو ریٹ بتاتی ہے تو وہ انکار کر دیتا ہے۔ جب پورا محلہ درزی کی دکان پر یہ چارٹ لگا دیتا ہے تو سب کو برابر اور پورا حق ملتا ہے۔'
              : 'کله چې یوه ښځه یوازې بیوپاري ته نرخ ووایي، هغه انکار کوي. کله چې ټوله محله دا چارټ په دکان باندې ولګوي نو ټولو ته مساوي او پوره حق رسي.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer leading-normal"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>واٹس ایپ</span>
          </button>
          
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

      {/* Locality Selector */}
      <div className="bg-[#FAF6EE] p-3 rounded-2xl border border-[#E7D7C1] mb-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-[#78350F] flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#C53030]" />
          {language === 'ur' ? 'محلہ منتخب کریں:' : 'محله وټاکئ:'}
        </span>
        <select
          value={selectedLocality}
          onChange={(e) => setSelectedLocality(e.target.value)}
          className="bg-white border border-[#D97706]/40 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none leading-normal"
        >
          {localities.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <span className="text-slate-400">{language === 'ur' ? 'یا' : 'یا'}</span>
        <input
          type="text"
          placeholder={language === 'ur' ? 'اپنے محلے کا نام لکھیں...' : 'د خپلې محلي نوم ولیکئ...'}
          value={customLocality}
          onChange={(e) => setCustomLocality(e.target.value)}
          className="bg-white border border-[#D97706]/40 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-400 flex-1 min-w-[140px] leading-normal"
        />
      </div>

      {/* Printable Poster Container */}
      <div
        id="printable-poster"
        className="relative bg-[#FFFDF7] rounded-3xl p-6 sm:p-8 shadow-lg border-4 border-[#9B1C1C] overflow-hidden"
      >
        <div className="text-center pb-3 mb-4 border-b-2 border-dashed border-[#C53030]">
          <span className="inline-block px-3 py-1 rounded-full bg-[#9B1C1C] text-amber-100 font-bold text-xs mb-1.5">
            {language === 'ur' ? 'دستکاری یونین مینگورہ' : 'د مینګورې د لاسي صنایعو ټولنه'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#78350F] font-urdu leading-relaxed py-1">
            {language === 'ur' ? 'محلے کا باہمی نرخ نامہ' : 'د کلي او محلي متفقه نرخ نامه'}
          </h2>
          <p className="text-sm font-bold text-[#C53030] mt-0.5 leading-normal">{displayLocality}</p>
          <p className="text-xs text-[#92400E] mt-1.5 leading-relaxed">
            {language === 'ur'
              ? 'ہماری محنت، ہماری آنکھیں! کسی کو اپنی غربت کا ناجائز فائدہ نہیں اٹھانے دیں گے۔'
              : 'زموږ محنت، زموږ سترګې! هېڅوک نشي کولی زموږ له مجبوری ناجایزه ګټه پورته کړي.'}
          </p>
        </div>

        {/* Rates with exact consistent numbers matching the wheel */}
        <div className="space-y-3 mb-5">
          <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#E7D7C1] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">☀️</span>
              <div>
                <span className="font-bold text-sm text-[#1F2937] block leading-normal">
                  {language === 'ur' ? '۱ دن کا کام (کف / بارڈر)' : '۱ ورځ کار (د لستوڼو کف یا بارډر)'}
                </span>
                <span className="text-xs text-slate-500 block leading-normal">
                  {language === 'ur' ? 'سادہ زنجیری ٹانکہ · ۸ گھنٹے' : 'ساده زنځیري ټانکه · ۸ ساعته'}
                </span>
              </div>
            </div>
            <div className="text-right rtl:text-left shrink-0">
              <span className="text-[11px] text-[#9B1C1C] font-semibold block leading-normal">
                {language === 'ur' ? 'کم از کم ریٹ' : 'لږ تر لږه نرخ'}
              </span>
              <span className="text-lg font-black text-[#059669] font-mono">₨ 1,200</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#E7D7C1] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">☀️×۳</span>
              <div>
                <span className="font-bold text-sm text-[#1F2937] block leading-normal">
                  {language === 'ur' ? '۳ دن کا کام (گلا اور دونوں بازو)' : '۳ ورځې کار (غاړه او دواړه لستوڼي)'}
                </span>
                <span className="text-xs text-slate-500 block leading-normal">
                  {language === 'ur' ? 'پھلکاری کام · ۲۴ گھنٹے' : 'پلوکاري کار · ۲۴ ساعته'}
                </span>
              </div>
            </div>
            <div className="text-right rtl:text-left shrink-0">
              <span className="text-[11px] text-[#9B1C1C] font-semibold block leading-normal">
                {language === 'ur' ? 'کم از کم ریٹ' : 'لږ تر لږه نرخ'}
              </span>
              <span className="text-lg font-black text-[#059669] font-mono">₨ 2,500</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FEF3C7] border-2 border-[#D97706] flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">☀️×۷</span>
              <div>
                <span className="font-bold text-sm sm:text-base text-[#78350F] block leading-normal">
                  {language === 'ur' ? '۷ دن کا مکمل کُرتا (مینگوری پھلکاری دامن)' : '۷ ورځې پوره قمیص (د مینګورې پلوکاري دامن)'}
                </span>
                <span className="text-xs text-[#92400E] block leading-normal">
                  {language === 'ur' ? 'پورا ہفتہ محنت · گلا اور دامن' : 'پوره اوونۍ خواري · غاړه او دامن'}
                </span>
              </div>
            </div>
            <div className="text-right rtl:text-left shrink-0">
              <span className="text-[11px] text-[#9B1C1C] font-bold block leading-normal">
                {language === 'ur' ? 'کم از کم ریٹ' : 'لږ تر لږه نرخ'}
              </span>
              <span className="text-xl font-black text-[#9B1C1C] font-mono">₨ 4,800</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#E7D7C1] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🌙✨</span>
              <div>
                <span className="font-bold text-sm text-[#1F2937] block leading-normal">
                  {language === 'ur' ? '۱۴ دن کی شال یا دلہن کا جوڑا' : '۱۴ ورځې درنه شال یا د ناوی جوړه'}
                </span>
                <span className="text-xs text-slate-500 block leading-normal">
                  {language === 'ur' ? 'باریک تلا و شیشہ کام · ۱۱۲ گھنٹے' : 'باریک تلا او اینه کار · ۱۱۲ ساعته'}
                </span>
              </div>
            </div>
            <div className="text-right rtl:text-left shrink-0">
              <span className="text-[11px] text-[#9B1C1C] font-semibold block leading-normal">
                {language === 'ur' ? 'کم از کم ریٹ' : 'لږ تر لږه نرخ'}
              </span>
              <span className="text-lg font-black text-[#059669] font-mono">₨ 11,500</span>
            </div>
          </div>
        </div>

        {/* Sisterhood Pledge Stamp */}
        <div className="p-4 rounded-2xl bg-white border border-[#E7D7C1] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>{language === 'ur' ? 'فیصلہ:' : 'پرېکړه:'}</strong>{' '}
              {language === 'ur'
                ? 'کوئی بھی عورت اس ریٹ سے کم پر کام نہیں لے گی۔ جب بیوپاری آئے تو یہی چارٹ دکھائیں: "پورے محلے کا یہی متفقہ ریٹ ہے!"'
                : 'هېڅ خور به له دې کم کار نه اخلي. کله چې بیوپاري راشي، دا چارټ ور وښایئ: "د ټولې محلي همدا یوه متفقه بیه ده!"'}
            </p>
          </div>

          <button
            type="button"
            onClick={handlePledgeSign}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-transform active:scale-95 cursor-pointer leading-normal ${
              isSigned ? 'bg-[#059669] text-white shadow-xs' : 'bg-[#9B1C1C] hover:bg-[#78350F] text-white shadow-xs'
            }`}
          >
            {isSigned ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>{language === 'ur' ? 'مہر لگ چکی ہے' : 'ټاپه ولګېده'}</span>
              </>
            ) : (
              <>
                <span>👍</span>
                <span>{language === 'ur' ? 'انگوٹھا یا تائید لگائیں' : 'ګوته یا تائید ولګوئ'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
