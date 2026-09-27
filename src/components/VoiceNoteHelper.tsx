import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, AudioVoice } from '../types';
import { speakMessage, stopSpeaking } from '../utils/audioSpeech';
import { playVoiceBubble, playNeedleSnip, playCoinJingle } from '../utils/soundEffects';
import { askHaqMentor } from '../utils/geminiService';
import { Mic, MicOff, Volume2, VolumeX, CheckCheck, Send, RotateCcw, Sparkles, MessageSquareQuote } from 'lucide-react';

interface VoiceNoteHelperProps {
  language: Language;
  voiceType: AudioVoice;
  onSetVoiceType: (v: AudioVoice) => void;
}

interface ChatMessage {
  id: string;
  sender: 'artisan' | 'assistant';
  text: string;
  price?: string;
  time: string;
}

export const VoiceNoteHelper: React.FC<VoiceNoteHelperProps> = ({
  language,
  voiceType,
  onSetVoiceType
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'artisan',
      text:
        language === 'ur'
          ? 'سلام باجی! میں نے ۷ دن لگا کر پورے کُرتے کا دامن اور گلا سواتی پھلکاری میں تیار کیا ہے۔ دھاگہ میرا اپنا ہے۔ اس کا کتنا حق مانگوں؟'
          : 'سلام خورې! ما اووه ورځې کار کړی او د ټولې قمیص دامن او غاړه مې په سواتۍ پلوکاري جوړه کړې ده۔ تار زما خپل دی، څومره حق وغواړم؟',
      time: '10:42 AM'
    },
    {
      id: 'm2',
      sender: 'assistant',
      text:
        'وعلیکم السلام باجی! مبارک ہو بہت پیارا کام ہے۔ ۷ دن کی محنت اور اپنے دھاگے کے حساب سے آپ کا کم از کم حق ₨ 4,800 سے ₨ 5,500 بنتا ہے۔ بیوپاری کو بولیں پورا محلہ اس سے کم پر نہیں مانے گا!',
      price: '₨ 4,800 – ₨ 5,500',
      time: '10:43 AM'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleSpeakText = (msgId: string, text: string) => {
    if (playingMessageId === msgId) {
      stopSpeaking();
      setPlayingMessageId(null);
      return;
    }

    setPlayingMessageId(msgId);
    speakMessage(text, 'ur', () => {
      setPlayingMessageId((curr) => (curr === msgId ? null : curr));
    });
  };

  const processUserQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isProcessing) return;

    playVoiceBubble();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'artisan',
      text: trimmed,
      time: now
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    try {
      const { replyText, priceEstimate } = await askHaqMentor(trimmed);
      const replyMsgId = 'ast_' + Date.now();
      const replyMsg: ChatMessage = {
        id: replyMsgId,
        sender: 'assistant',
        text: replyText,
        price: priceEstimate,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, replyMsg]);
      playCoinJingle();

      // Automatically speak the response aloud in clean, authentic Urdu
      setPlayingMessageId(replyMsgId);
      speakMessage(replyText, 'ur', () => {
        setPlayingMessageId((curr) => (curr === replyMsgId ? null : curr));
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    processUserQuery(inputText);
  };

  const handleToggleMic = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(language === 'ur' ? 'آپ کا براؤزر مائیکروفون اسپیچ سپورٹ نہیں کرتا۔' : 'ستاسو براوزر د غږ پېژندنه نه لري.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'ur-PK';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        playNeedleSnip();
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          processUserQuery(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Quick preset voice prompts for low-literacy artisans
  const quickPrompts = [
    {
      title: language === 'ur' ? '🌸 کُرتا اور سواتی پھلکاری' : '🌸 قمیص او سواتۍ پلوکاري',
      query:
        language === 'ur'
          ? 'باجی میں نے ۷ دن لگا کر سواتی پھلکاری میں کُرتا بنایا ہے، میرا اپنا دھاگہ ہے کتنا معاوضہ لوں؟'
          : 'ما اووه ورځې په سواتۍ پلوکاري قمیص جوړه کړې ده، څومره مزدوري وغواړم؟'
    },
    {
      title: language === 'ur' ? '🪞 دلہن کی شال اور شیشہ' : '🪞 د ناوی شال او اینه',
      query:
        language === 'ur'
          ? 'چودہ دن لگے ہیں دلہن کے جوڑے اور شیشے کے کام پر، اس کا منصفانہ ریٹ کیا ہے؟'
          : 'څوارلس ورځې په درنه شال او شیشه کار تېرې شوې دي، پوره حق څومره دی؟'
    },
    {
      title: language === 'ur' ? '☀️ ۳ دن کا گلا اور بازو' : '☀️ د غاړې او بازو کار',
      query:
        language === 'ur'
          ? 'تین دن میں گلا اور بازو تیار کیے ہیں، گاہک کا دھاگہ ہے کتنا حق بنتا ہے؟'
          : 'د دریو ورځو کار غاړه او آستین حق څومره جوړیږي؟'
    },
    {
      title: language === 'ur' ? '🤝 بیوپاری کم پیسے دے تو کیا کہوں؟' : '🤝 که بیوپاري کمې پیسې راکوي؟',
      query:
        language === 'ur'
          ? 'بیوپاری کہتا ہے مارکیٹ میں مندی ہے، کم پیسے لو۔ میں اس کو کیا جواب دوں؟'
          : 'بیوپاري وایي بازار خراب دی، کمې پیسې واخله۔ څه ورته ووایم؟'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto py-2">
      {/* Purpose Banner */}
      <div className="bg-white rounded-2xl p-4 mb-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F766E] to-[#059669] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              🎙️
            </span>
            <h3 className="font-bold text-base text-[#0F172A] leading-normal">
              {language === 'ur' ? 'حق چرخہ صوتی مشیر (باجی رہبر)' : 'د حق څرخ غږیز مشاور'}
            </h3>
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {language === 'ur'
              ? 'مائیکروفون کا بٹن دبائیں اور بولیں، یا نیچے دی گئی مثالوں پر کلک کریں۔ باجی رہبر آپ کو مکمل منصفانہ ریٹ بول کر بتائے گی۔'
              : 'د مایک بټن کېکاږئ او خبرې وکړئ، یا په لاندینیو پوښتنو کلیک وکړئ ترڅو غږیز لارښود واورئ.'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-[#0F766E] text-xs font-bold shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'ur' ? 'مستند صوتی اردو رہنمائی' : 'مستند غږیز لارښود'}</span>
        </div>
      </div>

      {/* Quick Prompts for Low-Literacy Artisans */}
      <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-[#0F766E] shrink-0 leading-normal flex items-center gap-1">
          <MessageSquareQuote className="w-3.5 h-3.5" />
          <span>{language === 'ur' ? 'پوچھیں:' : 'وپوښتئ:'}</span>
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => processUserQuery(p.query)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-teal-50 hover:border-teal-300 font-semibold whitespace-nowrap cursor-pointer transition-all shadow-2xs leading-normal"
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Chat Thread */}
      <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF9F5] to-[#F1F5F9] rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 min-h-[380px] max-h-[520px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'artisan';
          const isPlaying = playingMessageId === msg.id;

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs shrink-0 ${
                  isUser ? 'bg-[#0F766E] text-white' : 'bg-[#D97706] text-white'
                }`}
              >
                {isUser ? '🧕' : '⚖️'}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 sm:p-4 shadow-xs relative ${
                  isUser
                    ? 'bg-[#0F766E] text-white rounded-br-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                }`}
              >
                <p className="text-xs sm:text-sm font-medium leading-relaxed">{msg.text}</p>

                {msg.price && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-500">
                      {language === 'ur' ? 'منصفانہ معاوضہ:' : 'منصفانه حق:'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-[#059669] font-black text-xs sm:text-sm font-mono">
                      {msg.price}
                    </span>
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className={`text-[10px] ${isUser ? 'text-teal-100' : 'text-slate-400'}`}>{msg.time}</span>

                  <button
                    type="button"
                    onClick={() => handleSpeakText(msg.id, msg.text)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-[#C53030] text-white animate-pulse'
                        : isUser
                        ? 'bg-teal-700/80 text-teal-100 hover:bg-teal-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-[#0F766E] hover:text-white'
                    }`}
                  >
                    {isPlaying ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    <span>{isPlaying ? (language === 'ur' ? 'بند کریں' : 'بند کړئ') : (language === 'ur' ? 'سنیں' : 'واورئ')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {isProcessing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-ping" />
            <span>{language === 'ur' ? 'باجی رہبر منصفانہ معاوضہ حساب کر رہی ہیں...' : 'باجی لارښود ځواب چمتو کوي...'}</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="mt-3 p-2 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleMic}
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs ${
            isListening
              ? 'bg-[#C53030] text-white animate-pulse ring-4 ring-rose-200'
              : 'bg-teal-50 text-[#0F766E] hover:bg-teal-100 border border-teal-300'
          }`}
          title={isListening ? 'مائیک بند کریں' : 'بول کر پوچھیں'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          placeholder={
            isListening
              ? language === 'ur'
                ? 'سن رہا ہوں، بولیے...'
                : 'اورم، خبرې وکړئ...'
              : language === 'ur'
              ? 'اپنے کام کی تفصیل لکھیں یا مائیک دبائیں...'
              : 'د کار تفصیل ولیکئ یا مایک کېکاږئ...'
          }
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />

        <button
          type="button"
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isProcessing}
          className="w-10 h-10 rounded-xl bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-40 text-white flex items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-xs"
        >
          <Send className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
};
