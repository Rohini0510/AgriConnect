import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

const PRESET_QUESTIONS = [
  {
    label: "🌾 How does AgriConnect help farmers?",
    answer: "AgriConnect connects Farmer Producer Organizations (FPOs) directly with bulk buyers and retail pools. It cuts out intermediaries, raising farmer net income by 15-25% and reducing logistics costs by 25%."
  },
  {
    label: "🚚 How does Shared Logistics Pooling work?",
    answer: "Instead of each farmer/FPO hiring their own truck, AgriConnect pools loads across multiple FPOs onto shared trucks. An AI engine optimizes the route and splits freight costs transparently."
  },
  {
    label: "📊 What is Demand Aggregation?",
    answer: "AgriConnect aggregates weekly produce orders from small retailers, restaurants, and buyer groups into bulk city-wide orders. This gives buyers bulk pricing scale and FPOs guaranteed demand."
  },
  {
    label: "🏆 Tell me about Team Nexora & SIH 2026",
    answer: "AgriConnect is developed by Team Nexora from Cummins College of Engineering for Women, Nagpur for Smart India Hackathon 2026 (Problem Statement ID: SIH26033 - Agriculture & Rural Development)."
  },
  {
    label: "💰 What is the payment timeline?",
    answer: "Traditional mandi settlements take ~14 days. AgriConnect provides transparent 3-day digital settlements directly into the farmer or FPO bank account."
  }
];

export default function Chatbot({ currentLang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: currentLang === 'hi' 
        ? 'नमस्ते! मैं किसान मित्र एआई हूँ। मैं एग्रीकनेक्ट और एसआईएच 2026 के बारे में आपके प्रश्नों का उत्तर दे सकता हूँ।'
        : currentLang === 'mr'
        ? 'नमस्कार! मी बळीराजा AI आहे. मी अ‍ॅग्रीकनेक्ट बद्दलच्या प्रश्नांची उत्तरे देऊ शकतो.'
        : 'Hello! I am Kisaan Mitra AI, your AgriConnect Assistant. Ask me anything about SIH 2026, FPO onboarding, or pooled logistics!'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Generate intelligent bot response
    setTimeout(() => {
      let replyText = "AgriConnect connects smallholder farmers directly with buyers using AI demand aggregation and shared truck pooling, raising net farmer income by 15-25%.";
      
      const lower = textToSend.toLowerCase();
      const matched = PRESET_QUESTIONS.find(q => lower.includes(q.label.toLowerCase().slice(3, 15)));

      if (matched) {
        replyText = matched.answer;
      } else if (lower.includes('logistics') || lower.includes('truck')) {
        replyText = "Our shared logistics pooling algorithm consolidates crop loads across neighboring FPOs onto shared trucks, reducing freight cost per ton by 25%.";
      } else if (lower.includes('income') || lower.includes('money') || lower.includes('profit') || lower.includes('rate')) {
        replyText = "Farmers gain 15-25% higher net realization compared to traditional mandis through time-bound auctions, grade-based pricing, and zero middleman commissions.";
      } else if (lower.includes('team') || lower.includes('sih') || lower.includes('college')) {
        replyText = "Team Nexora represents Cummins College of Engineering for Women, Nagpur at SIH 2026 under Problem Statement SIH26033.";
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: replyText }
      ]);
    }, 600);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-600 text-white shadow-2xl hover:bg-emerald-700 transition-all flex items-center justify-center group border-2 border-emerald-400/50"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <Bot className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping"></span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">Kisaan Mitra AI</p>
                <p className="text-[10px] text-emerald-200 font-semibold">AgriConnect Assistant • SIH 2026</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-emerald-200 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Presets Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.answer)}
                className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100 shrink-0 transition"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleSend()}
              className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
