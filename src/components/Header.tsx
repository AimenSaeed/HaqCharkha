import React from 'react';
import { Language, AudioVoice } from '../types';
import { playNeedleSnip } from '../utils/soundEffects';
import { Globe, Eye, EyeOff } from 'lucide-react';

export type NavTab = 'wheel' | 'voicenote' | 'mohallah' | 'split' | 'paper';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  language: Language;
  onToggleLanguage: () => void;
  voiceType: AudioVoice;
  onToggleVoice: () => void;
  zeroLiteracy: boolean;
  onToggleZeroLiteracy: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  language,
  onToggleLanguage,
  zeroLiteracy,
  onToggleZeroLiteracy
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab('wheel')}
            className="flex items-center gap-2.5 text-right cursor-pointer group"
          >
            {/* Spinning charkha icon with glow ring */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-teal-400/30 blur-md group-hover:bg-teal-400/50 transition-all duration-500" />
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#0F766E] to-[#134e4a] flex items-center justify-center shadow-md group-hover:shadow-teal-400/50 group-hover:shadow-lg transition-all duration-300">
                <span className="text-xl group-hover:rotate-180 transition-transform duration-700 inline-block">🌀</span>
              </div>
            </div>
            <div className="flex flex-col text-right leading-none gap-0.5">
              <span
                className="text-xl sm:text-2xl font-black tracking-tight font-heading leading-tight"
                style={{ background: 'linear-gradient(135deg, #0F766E 0%, #059669 50%, #D97706 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                {language === 'ur' ? 'حق چرخہ' : 'حق څرخ'}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold leading-tight tracking-wide uppercase">
                {language === 'ur' ? 'منصفانہ اجرت پلیٹفارم' : 'Fair Wage Platform'}
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              playNeedleSnip();
              onSelectTab('wheel');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap leading-normal ${
              activeTab === 'wheel' ? 'bg-[#0F766E] text-white shadow-xs' : 'text-slate-700 hover:bg-white'
            }`}
          >
            🎡 {language === 'ur' ? 'چرخہ' : 'څرخ'}
          </button>

          <button
            type="button"
            onClick={() => {
              playNeedleSnip();
              onSelectTab('voicenote');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap leading-normal ${
              activeTab === 'voicenote' ? 'bg-[#0F766E] text-white shadow-xs' : 'text-slate-700 hover:bg-white'
            }`}
          >
            🎙️ {language === 'ur' ? 'آواز و مشیر' : 'غږیز مشاور'}
          </button>

          <button
            type="button"
            onClick={() => {
              playNeedleSnip();
              onSelectTab('mohallah');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap leading-normal ${
              activeTab === 'mohallah' ? 'bg-[#0F766E] text-white shadow-xs' : 'text-slate-700 hover:bg-white'
            }`}
          >
            📜 {language === 'ur' ? 'نرخ نامہ' : 'نرخ نامه'}
          </button>

          <button
            type="button"
            onClick={() => {
              playNeedleSnip();
              onSelectTab('split');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap leading-normal ${
              activeTab === 'split' ? 'bg-[#0F766E] text-white shadow-xs' : 'text-slate-700 hover:bg-white'
            }`}
          >
            ⚖️ {language === 'ur' ? 'آئینہ' : 'هینداره'}
          </button>

          <button
            type="button"
            onClick={() => {
              playNeedleSnip();
              onSelectTab('paper');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap leading-normal ${
              activeTab === 'paper' ? 'bg-[#0F766E] text-white shadow-xs' : 'text-slate-700 hover:bg-white'
            }`}
          >
            ✂️ {language === 'ur' ? 'کاغذی' : 'کاغذي'}
          </button>
        </nav>

        {/* Top Controls: Zero-Literacy Mode Toggle + Language Switch */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Zero-Literacy Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              playNeedleSnip();
              onToggleZeroLiteracy();
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer leading-normal ${
              zeroLiteracy
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title={language === 'ur' ? 'تصویری / آسان موڈ آن یا آف کریں' : 'انځوریز موډ بدل کړئ'}
          >
            {zeroLiteracy ? <Eye className="w-3.5 h-3.5 text-amber-700" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">
              {zeroLiteracy
                ? language === 'ur'
                  ? 'تصویری موڈ آن'
                  : 'انځوریز موډ فعال'
                : language === 'ur'
                ? 'تصویری موڈ'
                : 'انځوریز موډ'}
            </span>
          </button>

          {/* Language Switcher: Toggle between اردو and پښتو */}
          <button
            type="button"
            onClick={() => {
              playNeedleSnip();
              onToggleLanguage();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/30 hover:bg-[#0F766E]/20 transition-colors shadow-2xs cursor-pointer leading-normal"
            title={language === 'ur' ? 'پښتو ژبې ته واړوئ' : 'اردو میں دیکھیں'}
          >
            <Globe className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{language === 'ur' ? 'پښتو' : 'اردو'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden border-t border-slate-200 bg-white overflow-x-auto px-2 py-2 flex items-center justify-around gap-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            playNeedleSnip();
            onSelectTab('wheel');
          }}
          className={`px-3 py-1.5 rounded-lg shrink-0 cursor-pointer leading-normal ${
            activeTab === 'wheel' ? 'bg-[#0F766E] text-white shadow-xs' : 'text-slate-700'
          }`}
        >
          🎡 {language === 'ur' ? 'چرخہ' : 'څرخ'}
        </button>
        <button
          type="button"
          onClick={() => {
            playNeedleSnip();
            onSelectTab('voicenote');
          }}
          className={`px-3 py-1.5 rounded-lg shrink-0 cursor-pointer leading-normal ${
            activeTab === 'voicenote' ? 'bg-[#0F766E] text-white shadow-xs' : 'text-slate-700'
          }`}
        >
          🎙️ {language === 'ur' ? 'آواز' : 'غږ'}
        </button>
        <button
          type="button"
          onClick={() => {
            playNeedleSnip();
            onSelectTab('mohallah');
          }}
          className={`px-3 py-1.5 rounded-lg shrink-0 cursor-pointer leading-normal ${
            activeTab === 'mohallah' ? 'bg-[#0F766E] text-white shadow-xs' : 'text-slate-700'
          }`}
        >
          📜 {language === 'ur' ? 'نرخ نامہ' : 'نرخ نامه'}
        </button>
        <button
          type="button"
          onClick={() => {
            playNeedleSnip();
            onSelectTab('split');
          }}
          className={`px-3 py-1.5 rounded-lg shrink-0 cursor-pointer leading-normal ${
            activeTab === 'split' ? 'bg-[#0F766E] text-white shadow-xs' : 'text-slate-700'
          }`}
        >
          ⚖️ {language === 'ur' ? 'آئینہ' : 'هینداره'}
        </button>
        <button
          type="button"
          onClick={() => {
            playNeedleSnip();
            onSelectTab('paper');
          }}
          className={`px-3 py-1.5 rounded-lg shrink-0 cursor-pointer leading-normal ${
            activeTab === 'paper' ? 'bg-[#0F766E] text-white shadow-xs' : 'text-slate-700'
          }`}
        >
          ✂️ {language === 'ur' ? 'کاغذی' : 'کاغذي'}
        </button>
      </div>
    </header>
  );
};
