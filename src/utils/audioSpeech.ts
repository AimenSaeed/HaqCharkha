import { AudioVoice } from '../types';

let currentUtterance: SpeechSynthesisUtterance | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

// Initialize and keep voices updated
function initVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    cachedVoices = window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
    };
  } catch {
    // ignore
  }
}
initVoices();

/**
 * Convert numbers, currency notations, and Eastern digits to natural spoken Urdu words
 */
export function convertNumbersToUrduWords(text: string): string {
  let s = text;

  // Currency amounts
  s = s
    .replace(/₨\s*14,000/g, 'چودہ ہزار روپے')
    .replace(/₨\s*13,500/g, 'تیرہ ہزار پانچ سو روپے')
    .replace(/₨\s*13,000/g, 'تیرہ ہزار روپے')
    .replace(/₨\s*12,500/g, 'بارہ ہزار پانچ سو روپے')
    .replace(/₨\s*12,000/g, 'بارہ ہزار روپے')
    .replace(/₨\s*11,500/g, 'گیارہ ہزار پانچ سو روپے')
    .replace(/₨\s*11,000/g, 'گیارہ ہزار روپے')
    .replace(/₨\s*10,500/g, 'دس ہزار پانچ سو روپے')
    .replace(/₨\s*10,000/g, 'دس ہزار روپے')
    .replace(/₨\s*9,500/g, 'نو ہزار پانچ سو روپے')
    .replace(/₨\s*9,000/g, 'نو ہزار روپے')
    .replace(/₨\s*8,500/g, 'آٹھ ہزار پانچ سو روپے')
    .replace(/₨\s*8,000/g, 'آٹھ ہزار روپے')
    .replace(/₨\s*7,500/g, 'سات ہزار پانچ سو روپے')
    .replace(/₨\s*7,400/g, 'سات ہزار چار سو روپے')
    .replace(/₨\s*7,000/g, 'سات ہزار روپے')
    .replace(/₨\s*6,500/g, 'چھ ہزار پانچ سو روپے')
    .replace(/₨\s*6,000/g, 'چھ ہزار روپے')
    .replace(/₨\s*5,500/g, 'پانچ ہزار پانچ سو روپے')
    .replace(/₨\s*5,000/g, 'پانچ ہزار روپے')
    .replace(/₨\s*4,800/g, 'چار ہزار آٹھ سو روپے')
    .replace(/₨\s*4,500/g, 'چار ہزار پانچ سو روپے')
    .replace(/₨\s*4,000/g, 'چار ہزار روپے')
    .replace(/₨\s*3,500/g, 'تین ہزار پانچ سو روپے')
    .replace(/₨\s*3,000/g, 'تین ہزار روپے')
    .replace(/₨\s*2,800/g, 'اٹھائیس سو روپے')
    .replace(/₨\s*2,500/g, 'پچیس سو روپے')
    .replace(/₨\s*2,000/g, 'دو ہزار روپے')
    .replace(/₨\s*1,800/g, 'اٹھارہ سو روپے')
    .replace(/₨\s*1,500/g, 'پندرہ سو روپے')
    .replace(/₨\s*1,400/g, 'چودہ سو روپے')
    .replace(/₨\s*1,200/g, 'بارہ سو روپے')
    .replace(/₨\s*1,000/g, 'ایک ہزار روپے')
    .replace(/₨\s*950/g, 'نو سو پچاس روپے')
    .replace(/₨\s*900/g, 'نو سو روپے')
    .replace(/₨\s*800/g, 'آٹھ سو روپے')
    .replace(/₨\s*700/g, 'سات سو روپے')
    .replace(/₨\s*600/g, 'چھ سو روپے')
    .replace(/₨\s*500/g, 'پانچ سو روپے')
    .replace(/₨\s*400/g, 'چار سو روپے')
    .replace(/₨\s*300/g, 'تین سو روپے')
    .replace(/₨\s*200/g, 'دو سو روپے')
    .replace(/₨\s*100/g, 'ایک سو روپے')
    .replace(/₨\s*50/g, 'پچاس روپے')
    .replace(/₨\s*(\d+)/g, '$1 روپے');

  // Eastern Arabic numerals
  s = s
    .replace(/۱۴/g, 'چودہ')
    .replace(/۱۱۲/g, 'ایک سو بارہ')
    .replace(/۵۶/g, 'چھپن')
    .replace(/۲۴/g, 'چوبیس')
    .replace(/۱۰/g, 'دس')
    .replace(/۹/g, 'نو')
    .replace(/۸/g, 'آٹھ')
    .replace(/۷/g, 'سات')
    .replace(/۶/g, 'چھ')
    .replace(/۵/g, 'پانچ')
    .replace(/۴/g, 'چار')
    .replace(/۳/g, 'تین')
    .replace(/۲/g, 'دو')
    .replace(/۱/g, 'ایک')
    .replace(/۰/g, 'صفر');

  // Multipliers
  s = s
    .replace(/1\.95[x×]/g, 'تقریباً دو گنا')
    .replace(/1\.45[x×]/g, 'ڈیڑھ گنا')
    .replace(/1\.5[x×]/g, 'ڈیڑھ گنا')
    .replace(/2\.0[x×]/g, 'دو گنا')
    .replace(/1\.1[x×]/g, 'سوا گنا')
    .replace(/1\.0[x×]/g, 'ایک گنا')
    .replace(/\b14\b/g, 'چودہ')
    .replace(/\b112\b/g, 'ایک سو بارہ')
    .replace(/\b56\b/g, 'چھپن')
    .replace(/\b24\b/g, 'چوبیس')
    .replace(/\b8\b/g, 'آٹھ')
    .replace(/\b7\b/g, 'سات')
    .replace(/\b3\b/g, 'تین')
    .replace(/\b1\b/g, 'ایک');

  return s;
}

/**
 * Mapping of common Urdu words and phrases to natural Devanagari script.
 * When the browser does NOT have an Urdu voice but has a Hindi voice (which almost all Windows and Android devices do),
 * this allows the Hindi voice to speak natural Hindustani with 100% accurate pronunciation,
 * without sounding like broken English!
 */
const URDU_TO_DEVANAGARI_MAP: Array<[RegExp, string]> = [
  [/وعلیکم السلام باجی! مبارک ہو بہت پیارا کام ہے۔/g, 'वालेकुम अस्सलाम बाजी! मुबारक हो बहुत प्यारा काम है। '],
  [/وعلیکم السلام باجی!/g, 'वालेकुम अस्सलाम बाजी! '],
  [/وعلیکم السلام خورې!/g, 'वालेकुम अस्सलाम बाजी! '],
  [/وعلیکم السلام/g, 'वालेकुम अस्सलाम '],
  [/سلام باجی!/g, 'सलाम बाजी! '],
  [/سلام باجی/g, 'सलाम बाजी '],
  [/سلام/g, 'सलाम '],
  [/مبارک ہو بہت پیارا کام ہے۔/g, 'मुबारक हो बहुत प्यारा काम है। '],
  [/مبارک ہو/g, 'मुबारक हो '],
  [/بہت پیارا کام ہے/g, 'बहुत प्यारा काम है '],
  [/بہت پیارا/g, 'बहुत प्यारा '],
  [/حق چرخہ/g, 'हक़ चरखा '],
  [/حق دریچہ/g, 'हक़ दरीचा '],
  [/منصفانہ ریٹ/g, 'मुनसिफ़ाना रेट '],
  [/منصفانہ معاوضہ/g, 'मुनसिफ़ाना मुआवज़ा '],
  [/کم از کم حق/g, 'कम अज़ कम हक़ '],
  [/کم از کم/g, 'कम अज़ कम '],
  [/حق بنتا ہے/g, 'हक़ बनता है '],
  [/حق ہے/g, 'हक़ है '],
  [/بنتا ہے/g, 'बनता है '],
  [/پورا محلہ اس سے کم پر نہیں مانے گا!/g, 'पूरा मोहल्ला इस से कम पर नहीं मानेगा! '],
  [/پورا محلہ/g, 'पूरा मोहल्ला '],
  [/اس سے کم پر نہیں مانے گا/g, 'इस से कम पर नहीं मानेगा '],
  [/اس سے کم ہرگز نہ مانیں!/g, 'इस से कम हरगिज़ ना मानें! '],
  [/اس سے کم پر ہاتھ مت ڈالیں/g, 'इस से कम पर हाथ मत डालें '],
  [/یہ آپ کی محنت کی قدر ہے!/g, 'यह आपकी मेहनत की क़द्र है! '],
  [/یہ آپ کی محنت کا حق ہے!/g, 'यह आपकी मेहनत का हक़ है! '],
  [/بیوپاری کو بولیں/g, 'ब्योपारी को बोलें '],
  [/بیوپاری کو کہیں/g, 'ब्योपारी को कहें '],
  [/بیوپاری/g, 'ब्योपारी '],
  [/شاہکار کام کی کم اجرت دینا ظلم ہے/g, 'शाहकार काम की कम उजरत देना ज़ुल्म है '],
  [/شاہکار کام/g, 'शाहकार काम '],
  [/شاہکار/g, 'शाहकार '],
  [/اجرت دینا ظلم ہے/g, 'उजरत देना ज़ुल्म है '],
  [/کم اجرت/g, 'कम उजरत '],
  [/اجرت/g, 'उजरत '],
  [/ظلم ہے/g, 'ज़ुल्म है '],
  [/اپنی کمر اور آنکھوں کا پورا حق مانگیں/g, 'अपनी कमर और आँखों का पूरा हक़ मांगें '],
  [/اپنی کمر اور آنکھوں/g, 'अपनी कमर और आँखों '],
  [/پورا حق مانگیں/g, 'पूरा हक़ मांगें '],
  [/پورا حق/g, 'पूरा हक़ '],
  [/حق مانگیں/g, 'हक़ मांगें '],
  [/مینگوری پھلکاری/g, 'Mingori phulkaari '],
  [/گھنی روایتی پھلکاری/g, 'घनी रिवायती फुलकारी '],
  [/پھلکاری/g, 'फुलकारी '],
  [/سادہ زنجیری/g, 'सादा ज़ंजीरी '],
  [/سادہ ٹانکہ/g, 'सादा टांका '],
  [/زنجیری/g, 'ज़ंजीरी '],
  [/شاہی شیشہ اور باریک کام/g, 'शाही शीशा और बारीक काम '],
  [/شاہی شیشہ و باریک/g, 'शाही शीशा और बारीक '],
  [/شاہی شیشہ/g, 'शाही शीशा '],
  [/شیشہ/g, 'शीशा '],
  [/باریک کام/g, 'बारीक काम '],
  [/گاہک کا دھاگہ/g, 'गाहक का धागा '],
  [/عام سوتی اور اونی/g, 'आम सूती और ऊनी '],
  [/عام سوتی \/ اونی/g, 'आम सूती और ऊनी '],
  [/خالص ریشم اور تلا/g, 'ख़ालिस रेशम और तिल्ला '],
  [/خالص ریشم و تلا/g, 'ख़ालिस रेशम और तिल्لا '],
  [/ریشم اور تلا/g, 'रेशम और तिल्ला '],
  [/ریشم/g, 'रेशम '],
  [/تلا/g, 'तिल्ला '],
  [/دھاگہ/g, 'धागा '],
  [/کپڑا اور دھاگہ گاہک کا ہے/g, 'कपड़ा और धागा गाहक का है '],
  [/آپ کا خرچ صفر روپے ہے/g, 'आपका ख़र्च सिफ़र रुपये है '],
  [/آپ کا خرچ صفر/g, 'आपका ख़र्च सिफ़र '],
  [/صفر روپے/g, 'सिफ़र रुपये '],
  [/ایک دن کا کام/g, 'एक दिन का काम '],
  [/تین دن کا کام/g, 'तीन दिन का काम '],
  [/سات دن کا کام/g, 'सात दिन का काम '],
  [/چودہ دن کا کام/g, 'चौदह दिन का काम '],
  [/پورا ہفتہ/g, 'पूरा हफ़्ता '],
  [/کف یا باریک پٹی/g, 'कफ़ या बारीक पट्टी '],
  [/گلے اور بازو کا کام/g, 'गले और बाज़ू का काम '],
  [/پوری قمیص کا دامن اور گلا/g, 'पूरी क़मीज़ का दामन और गला '],
  [/دلہن کا جوڑا یا بھاری شال/g, 'दुल्हन का जोड़ा या भारी शॉल '],
  [/بھاری شال/g, 'भारी शॉल '],
  [/دلہن کا جوڑا/g, 'दुल्हन का जोड़ा '],
  [/شال/g, 'शॉल '],
  [/قمیص/g, 'क़मीज़ '],
  [/دامن/g, 'दामन '],
  [/گھنٹے محنت/g, 'घंटे मेहनत '],
  [/گھنٹے/g, 'घंटे '],
  [/محنت/g, 'मेहनत '],
  [/کاریگر/g, 'कारीगर '],
  [/بہن/g, 'बहन '],
  [/روپے/g, 'रुपये '],
  [/روپوں/g, 'रुपयों '],
  [/سے/g, 'से '],
  [/تک/g, 'तक '],
  [/اور/g, 'और '],
  [/کا/g, 'का '],
  [/کی/g, 'की '],
  [/کے/g, 'के '],
  [/میں/g, 'में '],
  [/پر/g, 'पर '],
  [/ہے/g, 'है '],
  [/ہیں/g, 'हैं ']
];

function convertUrduToDevanagari(text: string): string {
  let s = convertNumbersToUrduWords(text);
  for (const [pattern, replacement] of URDU_TO_DEVANAGARI_MAP) {
    s = s.replace(pattern, replacement);
  }
  return s.trim();
}

/**
 * Natural Roman Urdu with complete phonetic vowels (never individual consonants!)
 */
export function toPhoneticRomanUrdu(text: string): string {
  let s = convertNumbersToUrduWords(text);

  s = s
    .replace(/وعلیکم السلام باجی! مبارک ہو بہت پیارا کام ہے۔/g, 'Walaikum Assalam baaji! Mubarak ho bohat pyaara kaam hai. ')
    .replace(/وعلیکم السلام باجی!/g, 'Walaikum Assalam baaji! ')
    .replace(/وعلیکم السلام/g, 'Walaikum Assalam ')
    .replace(/سلام باجی!/g, 'Salaam baaji! ')
    .replace(/مبارک ہو بہت پیارا کام ہے۔/g, 'Mubarak ho bohat pyaara kaam hai. ')
    .replace(/مبارک ہو/g, 'Mubarak ho ')
    .replace(/بہت پیارا کام ہے/g, 'bohat pyaara kaam hai ')
    .replace(/حق چرخہ/g, 'Haq Charkha ')
    .replace(/گاہک کا دھاگہ/g, 'Gahak ka dhaaga ')
    .replace(/کپڑا اور دھاگہ گاہک کا ہے/g, 'Kapra aur dhaaga gaahak ka hai ')
    .replace(/آپ کا خرچ صفر روپے ہے/g, 'Aap ka kharch sifar rupay hai ')
    .replace(/عام سوتی اور اونی/g, 'Aam sooti aur ooni ')
    .replace(/آپ نے بازار سے پکا سوتی دھاگہ خریدا ہے/g, 'Aap nay bazaar say pakka sooti dhaaga khareeda hai ')
    .replace(/خالص ریشم اور تلا/g, 'Khaalis resham aur tilla ')
    .replace(/قیمتی مال ہے، نو سو پچاس روپے لاگت اور محنت زیادہ ہے/g, 'Qeemti maal hai, nau sau pachaas rupay laagat aur mehnat zyaada hai ')
    .replace(/سادہ زنجیری/g, 'Saada zanjeeri ')
    .replace(/سادہ ٹانکہ، کھلا اور رواں کام، آنکھوں پر زور کم/g, 'Saada taanka, khula aur rawaan kaam, aankhon par zor kam ')
    .replace(/مینگوری پھلکاری/g, 'Mingori phulkaari ')
    .replace(/روایتی گھنی پھلکاری، گھنے پھول اور آنکھوں کو تھکا دینے والا کام/g, 'Riwayati ghani phulkaari, ghanay phool aur aankhon ko thaka denay waala kaam ')
    .replace(/شاہی شیشہ اور باریک کام/g, 'Shaahi sheesha aur bareek kaam ')
    .replace(/شاہکار نفیس کام، خالص فن پارہ اور پورا معاوضہ لیں/g, 'Shahkaar nafees kaam, khaalis fan-paara aur poora muaawza lein ')
    .replace(/ایک دن کا کام/g, 'Ek din ka kaam ')
    .replace(/تین دن کا کام/g, 'Teen din ka kaam ')
    .replace(/سات دن کا کام/g, 'Saat din ka kaam ')
    .replace(/چودہ دن کا کام/g, 'Chaudah din ka kaam ')
    .replace(/پورا ہفتہ/g, 'Poora hafta ')
    .replace(/کف یا باریک پٹی/g, 'Kaf ya bareek patti ')
    .replace(/گلے اور بازو کا کام/g, 'Galay aur baazu ka kaam ')
    .replace(/پوری قمیص کا دامن اور گلا/g, 'Poori qamees ka daaman aur gala ')
    .replace(/دلہن کا جوڑا یا بھاری گرم شال/g, 'Dulhan ka jora ya bhaari garm shawl ')
    .replace(/دلہن کا جوڑا/g, 'Dulhan ka jora ')
    .replace(/بھاری شال/g, 'Bhaari shawl ')
    .replace(/کل آٹھ گھنٹے محنت/g, 'Kul aath ghantay mehnat ')
    .replace(/کل چوبیس گھنٹے محنت/g, 'Kul chaubees ghantay mehnat ')
    .replace(/چھپن گھنٹے محنت/g, 'Chhappan ghantay mehnat ')
    .replace(/ایک سو بارہ گھنٹے محنت/g, 'Ek sau baarah ghantay mehnat ')
    .replace(/کم از کم حق/g, 'kam az kam haq ')
    .replace(/سے کم لینا آپ کی کمر اور آنکھوں کے ساتھ ناانصافی ہے/g, 'say kam lena aap ki kamar aur aankhon kay saath na-insaafi hai ')
    .replace(/یہ آپ کی محنت کا حق ہے!/g, 'Yeh aap ki mehnat ka haq hai! ')
    .replace(/بیوپاری کو بولیں پورا محلہ اس سے کم پر نہیں مانے گا!/g, 'Beopari ko bolein poora mohallah is say kam par nahi maanay ga! ')
    .replace(/اس سے ایک روپیہ بھی کم لینا زیادتی ہے/g, 'Is say aik rupia bhi kam lena zyaadti hai ')
    .replace(/روپے/g, 'rupay ')
    .replace(/روپوں/g, 'rupon ');

  // Clean trailing punctuation and multiple spaces
  return s.replace(/\s+/g, ' ').trim();
}

/**
 * Intelligent voice selection and text formatting.
 * Prioritizes native Urdu voice -> Hindi voice (Devanagari) -> Indian English -> Roman Urdu.
 */
function getBestVoiceAndText(
  rawText: string
): { voice: SpeechSynthesisVoice | null; lang: string; textToSpeak: string } {
  const voices =
    typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis.getVoices()
      : cachedVoices;

  const urduText = convertNumbersToUrduWords(rawText);

  // 1. First priority: Browser or OS has a native Urdu voice (ur-PK, ur-IN, ur)
  const nativeUrduVoice = voices.find(
    (v) =>
      v.lang.toLowerCase().startsWith('ur') ||
      v.name.toLowerCase().includes('urdu') ||
      v.name.toLowerCase().includes('asad') ||
      v.name.toLowerCase().includes('uzma')
  );

  if (nativeUrduVoice) {
    return {
      voice: nativeUrduVoice,
      lang: nativeUrduVoice.lang || 'ur-PK',
      textToSpeak: urduText
    };
  }

  // 2. Second priority: Browser has Hindi voice (hi-IN, hi).
  // Because Hindi and Urdu have identical spoken syntax and vocabulary,
  // converting to Devanagari provides 100% natural, fluent, human pronunciation!
  const hindiVoice = voices.find(
    (v) =>
      v.lang.toLowerCase().startsWith('hi') ||
      v.name.toLowerCase().includes('hindi') ||
      v.name.toLowerCase().includes('kalpana') ||
      v.name.toLowerCase().includes('hemant')
  );

  if (hindiVoice) {
    const devanagariText = convertUrduToDevanagari(rawText);
    return {
      voice: hindiVoice,
      lang: 'hi-IN',
      textToSpeak: devanagariText
    };
  }

  // 3. Third priority: Indian English voice (en-IN) which handles South Asian names & words well
  const indianVoice = voices.find(
    (v) =>
      v.lang.toLowerCase().includes('in') ||
      v.name.toLowerCase().includes('india')
  );

  if (indianVoice) {
    return {
      voice: indianVoice,
      lang: indianVoice.lang,
      textToSpeak: toPhoneticRomanUrdu(rawText)
    };
  }

  // 4. Fallback: Default voice with clean Roman Urdu phonetics
  const defaultVoice = voices.find((v) => v.default) || voices[0] || null;
  return {
    voice: defaultVoice,
    lang: defaultVoice?.lang || 'en-US',
    textToSpeak: toPhoneticRomanUrdu(rawText)
  };
}

/**
 * Universal speech synthesis with reliable lifecycle callbacks
 */
export function speakMessage(
  text: string,
  _voiceType: AudioVoice = 'ur',
  onEnd?: () => void
) {
  if (typeof window === 'undefined') return;

  stopSpeaking();

  if ('speechSynthesis' in window) {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const { voice, lang, textToSpeak } = getBestVoiceAndText(text);

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.88; // deliberate, gentle, clear pace for artisan understanding
      utterance.pitch = 1.0;
      utterance.lang = lang;
      if (voice) {
        utterance.voice = voice;
      }

      let isFinished = false;
      let safetyTimeout: ReturnType<typeof setTimeout> | null = null;

      const finish = () => {
        if (!isFinished) {
          isFinished = true;
          if (safetyTimeout) clearTimeout(safetyTimeout);
          currentUtterance = null;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).__activeUtterance = null;
          if (onEnd) onEnd();
        }
      };

      utterance.onend = finish;
      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis event:', e);
        finish();
      };

      // Safeguard against Chrome silent finish bugs
      const maxDuration = Math.max(3000, textToSpeak.length * 100);
      safetyTimeout = setTimeout(finish, maxDuration + 1500);

      currentUtterance = utterance;
      // Prevent Chromium garbage collection bug
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__activeUtterance = utterance;

      setTimeout(() => {
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          console.warn('speak invocation failed:', e);
          finish();
        }
      }, 40);

      return;
    } catch (err) {
      console.error('speakMessage error:', err);
    }
  }

  if (onEnd) {
    setTimeout(onEnd, 2000);
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      currentUtterance = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__activeUtterance = null;
    } catch {
      // ignore
    }
  }
}

/**
 * Spoken descriptions for every Charkha option in pure, dignified Urdu.
 * When an artisan clicks the audio speaker icon on any option, this text is read aloud.
 */
export const SPOKEN_DESCRIPTIONS: Record<string, { ur: string; ps: string }> = {
  // Materials / Spools
  'spool-1': {
    ur: 'گاہک کا دھاگہ۔ کپڑا اور دھاگہ گاہک کا ہے، آپ کا سامان پر خرچ صفر روپے ہے۔ صرف اپنی محنت کا معاوضہ لیں۔',
    ps: 'گاہک کا دھاگہ۔ کپڑا اور دھاگہ گاہک کا ہے، آپ کا سامان پر خرچ صفر روپے ہے۔ صرف اپنی محنت کا معاوضہ لیں۔'
  },
  'spool-2': {
    ur: 'عام سوتی اور اونی دھاگہ۔ آپ نے بازار سے پکا دھاگہ چار سو روپے میں خود خریدا ہے۔ سامان کے چار سو روپے محنت کے علاوہ شامل کریں۔',
    ps: 'عام سوتی اور اونی دھاگہ۔ آپ نے بازار سے پکا دھاگہ چار سو روپے میں خود خریدا ہے۔ سامان کے چار سو روپے محنت کے علاوہ شامل کریں۔'
  },
  'spool-3': {
    ur: 'خالص ریشم اور تلا۔ قیمتی مال ہے، نو سو پچاس روپے دھاگے کی لاگت ہے اور باریک کام میں وقت زیادہ لگتا ہے۔',
    ps: 'خالص ریشم اور تلا۔ قیمتی مال ہے، نو سو پچاس روپے دھاگے کی لاگت ہے اور باریک کام میں وقت زیادہ لگتا ہے۔'
  },
  'spool-custom': {
    ur: 'اپنا خاص دھاگہ۔ یہاں آپ اپنے خریدے گئے دھاگے یا ستارے کا اصل خرچ خود درج کر سکتے ہیں۔',
    ps: 'اپنا خاص دھاگہ۔ یہاں آپ اپنے خریدے گئے دھاگے یا ستارے کا اصل خرچ خود درج کر سکتے ہیں۔'
  },

  // Labor Days
  'day-1': {
    ur: 'ایک دن کا کام۔ کف یا باریک پٹی۔ کل آٹھ گھنٹے کی محنت۔',
    ps: 'ایک دن کا کام۔ کف یا باریک پٹی۔ کل آٹھ گھنٹے کی محنت۔'
  },
  'day-3': {
    ur: 'تین دن کا کام۔ گلے اور بازو کا کام۔ کل چوبیس گھنٹے کی محنت۔',
    ps: 'تین دن کا کام۔ گلے اور بازو کا کام۔ کل چوبیس گھنٹے کی محنت۔'
  },
  'day-7': {
    ur: 'سات دن کا کام، پورا ایک ہفتہ۔ پوری قمیص کا دامن اور گلا۔ کل چھپن گھنٹے کی کڑی محنت۔',
    ps: 'سات دن کا کام، پورا ایک ہفتہ۔ پوری قمیص کا دامن اور گلا۔ کل چھپن گھنٹے کی کڑی محنت۔'
  },
  'day-14': {
    ur: 'چودہ دن کا کام۔ دلہن کا بھاری جوڑا یا روایتی گرم شال۔ کل ایک سو بارہ گھنٹے کی محنت۔ اس کا معاوضہ دس ہزار سے اوپر ہونا چاہیے۔',
    ps: 'چودہ دن کا کام۔ دلہن کا بھاری جوڑا یا روایتی گرم شال۔ کل ایک سو بارہ گھنٹے کی محنت۔ اس کا معاوضہ دس ہزار سے اوپر ہونا چاہیے۔'
  },
  'day-custom': {
    ur: 'اپنی محنت کے دن۔ جتنا وقت آپ نے لگایا، وہی دن یہاں درج کریں۔',
    ps: 'اپنی محنت کے دن۔ جتنا وقت آپ نے لگایا، وہی دن یہاں درج کریں۔'
  },

  // Stitches / Complexity
  simple: {
    ur: 'سادہ زنجیری ٹانکہ۔ کھلا اور رواں کام۔ آنکھوں اور کمر پر زور کم پڑتا ہے۔',
    ps: 'سادہ زنجیری ٹانکہ۔ کھلا اور رواں کام۔ آنکھوں اور کمر پر زور کم پڑتا ہے۔'
  },
  phulkari: {
    ur: 'مینگوری پھلکاری۔ روایتی گھنی پھلکاری، گھنے پھول اور آنکھوں کو تھکا دینے والی کڑھائی۔ اس پر ڈیڑھ گنا حق بنتا ہے۔',
    ps: 'مینګوري پھلکاری۔ روایتی گھنی پھلکاری، گھنے پھول اور آنکھوں کو تھکا دینے والی کڑھائی۔ اس پر ڈیڑھ گنا حق بنتا ہے۔'
  },
  shahi: {
    ur: 'شاہی شیشہ اور باریک کام۔ شاہکار نفیس کام، خالص فن پارہ۔ کمر اور آنکھوں کا امتحان۔ اس پر دو گنا معاوضہ لیں۔',
    ps: 'شاہی شیشہ اور باریک کام۔ شاہکار نفیس کام، خالص فن پارہ۔ کمر اور آنکھوں کا امتحان۔ اس پر دو گنا معاوضہ لیں۔'
  },
  'complexity-custom': {
    ur: 'خاص کاریگری۔ مکیش، کٹ ورک یا کشمیری ٹانکہ۔ اپنی پسند کی نزاکت منتخب کریں۔',
    ps: 'خاص کاریگری۔ مکیش، کٹ ورک یا کشمیری ٹانکہ۔ اپنی پسند کی نزاکت منتخب کریں۔'
  }
};
