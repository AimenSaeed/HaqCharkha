import { GoogleGenAI } from '@google/genai';

/**
 * Intelligent fair wage mentor service powered by Gemini AI with offline fallback.
 */

const SYSTEM_INSTRUCTION = `
آپ "حق چرخہ" کے دانش مند صوتی مشیر اور کاریگر رہبر (باجی رہنما) ہیں۔
آپ کا مشن سوات، مینگورہ، اسلام پور اور خیبر پختونخوا کی گھریلو دستکار کاریگر بہنوں کو کڑھائی، سلائی، سواتی پھلکاری، تلا، شیشہ اور شال کے کام کا منصفانہ، عادلانہ معاوضہ بتانا ہے۔
اصول:
1. ہمیشہ احترام، محبت اور ہمدردی سے جواب دیں (جیسے: "وعلیکم السلام باجی! مبارک ہو بہت پیارا کام ہے...")۔
2. کاریگر کے کام کے دن، دھاگے کا خرچ اور کام کی نزاکت کا اندازہ لگا کر ہمیشہ ایک واضح کم از کم منصفانہ ریٹ (مثلاً: ₨ 4,800 سے ₨ 5,500) بتائیں۔
3. کاریگر کو بیوپاری (مڈل مین) سے ڈٹ کر بات کرنے کا ایک جاندار جملہ سکھائیں (مثلاً: "بیوپاری کو بولیں پورا محلہ اس سے کم پر نہیں مانے گا!")۔
4. جواب مختصر، باوقار اور 2 سے 3 جملوں میں رکھیں تاکہ آواز میں سنتے ہوئے کاریگر کو آسانی سے سمجھ آئے۔
5. زبان خالص، شستہ اور آسان اردو ہونی چاہیے۔
`;

export async function askHaqMentor(userQuery: string): Promise<{ replyText: string; priceEstimate?: string }> {
  const apiKey =
    (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_GEMINI_API_KEY) ||
    '';

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nکاریگر کا سوال: ${userQuery}` }] }
        ]
      });

      const text = response.text || '';
      if (text.trim()) {
        // Extract any rupee amount mentioned
        const priceMatch = text.match(/₨?\s*(\d+[\d,]*\s*(?:سے|تر|-|to)\s*₨?\s*\d+[\d,]*)/i);
        return {
          replyText: text.trim(),
          priceEstimate: priceMatch ? priceMatch[0] : undefined
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local reasoning:', err);
    }
  }

  // Intelligent local fallback reasoning
  return getLocalReasoningResponse(userQuery);
}

function getLocalReasoningResponse(query: string): { replyText: string; priceEstimate: string } {
  const q = query.toLowerCase();

  if (
    q.includes('14') ||
    q.includes('چودہ') ||
    q.includes('څوارلس') ||
    q.includes('شال') ||
    q.includes('دلہن') ||
    q.includes('ناوی') ||
    q.includes('دو ہفتے') ||
    q.includes('دوه اوونۍ') ||
    q.includes('بھاری') ||
    q.includes('شیشہ')
  ) {
    return {
      replyText:
        'وعلیکم السلام باجی! مبارک ہو، بہت پیارا اور دروند کام ہے۔ چودہ دن کی اتنی باریک محنت اور شال کا معاوضہ کم از کم ₨ 11,500 سے ₨ 13,000 بنتا ہے۔ بیوپاری کو بولیں شاہکار کام کی کم اجرت دینا ظلم ہے، پورا محلہ اس سے کم پر نہیں مانے گا!',
      priceEstimate: '₨ 11,500 – ₨ 13,000'
    };
  }

  if (
    q.includes('3') ||
    q.includes('تین') ||
    q.includes('درې') ||
    q.includes('گلا') ||
    q.includes('غاړه') ||
    q.includes('بازو') ||
    q.includes('آستین') ||
    q.includes('کف')
  ) {
    return {
      replyText:
        'وعلیکم السلام باجی! تین دن کی محنت، گلے اور بازو کا منصفانہ ریٹ ₨ 2,500 سے ₨ 2,800 بنتا ہے۔ اپنی کمر اور آنکھوں کا پورا حق مانگیں، اس سے کم ہرگز نہ مانیں!',
      priceEstimate: '₨ 2,500 – ₨ 2,800'
    };
  }

  if (
    q.includes('1') ||
    q.includes('ایک') ||
    q.includes('یو') ||
    q.includes('سادہ') ||
    q.includes('بارڈر') ||
    q.includes('پٹی') ||
    q.includes('زنجیری')
  ) {
    return {
      replyText:
        'وعلیکم السلام باجی! ایک دن کے کام اور بارڈر کا کم از کم معاوضہ ₨ 1,200 سے ₨ 1,400 ہے۔ اس سے کم پر ہاتھ مت ڈالیں، یہ آپ کی محنت کی سچی قدر ہے!',
      priceEstimate: '₨ 1,200 – ₨ 1,400'
    };
  }

  if (q.includes('بیوپاری') || q.includes('انکار') || q.includes('بحث') || q.includes('کم پیسے')) {
    return {
      replyText:
        'باجی! بیوپاری کو کہیں کہ پورے محلے کا ایک ہی ریٹ طے ہو چکا ہے اور شہر کی دکان میں یہی سوٹ آٹھ ہزار کا بکتا ہے۔ ہم اپنی آنکھیں اور کمر ضائع کر کے مفت کام نہیں کریں گے!',
      priceEstimate: 'متفقہ نرخ نامہ'
    };
  }

  // Default 7 days / general kurta
  return {
    replyText:
      'وعلیکم السلام باجی! مبارک ہو بہت پیارا کام ہے۔ سات دن کی محنت اور سواتی پھلکاری کے حساب سے آپ کا کم از کم حق ₨ 4,800 سے ₨ 5,500 بنتا ہے۔ بیوپاری کو کہیں پورے محلے کا یہی متفقہ ریٹ ہے!',
    priceEstimate: '₨ 4,800 – ₨ 5,500'
  };
}
