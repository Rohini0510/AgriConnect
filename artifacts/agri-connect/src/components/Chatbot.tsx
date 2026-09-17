import { useState, useRef, useEffect } from 'react';
import { Bot, MessageCircle, Send, Sparkles, X, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import { useLang } from '../i18n';

type ChatMessage = {
  id: number;
  role: 'agent' | 'user';
  text: string;
  topic?: string;
};

export function Chatbot() {
  const { t, locale } = useLang();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        role: 'agent',
        text: t('chat.greeting'),
      },
    ]);
  }, [locale, t]);

  useEffect(() => {
    if (open) {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, open]);

  useEffect(() => () => window.clearTimeout(replyTimer.current), []);

  const topics = [
    { label: t('chat.topicEscrow'), reply: t('chat.replyPayment') },
    { label: t('chat.topicMandi'), reply: t('chat.replyRate') },
    { label: t('chat.topicLogistics'), reply: t('chat.replyPickup') },
    { label: t('chat.topicFpo'), reply: t('chat.replyJoin') },
    { label: t('chat.topicQuality'), reply: t('chat.replyQuality') },
    { label: t('chat.topicBuyer'), reply: t('chat.replyBuyer') },
    { label: t('chat.topicSupport'), reply: t('chat.replySupport') },
  ];

  const answerFor = (question: string): string => {
    const q = question.toLowerCase();
    if (/(pay|paisa|rupee|bank|escrow|dbt|utr|settle|advance|पैस|रुपय|बैंक|देयक|बँक|रक्कम|एस्क्रो|खात)/.test(q)) {
      return t('chat.replyPayment');
    }
    if (/(pick|collect|truck|route|transport|logistic|reefer|पिकअप|संग्रह|वाहतूक|ट्रक|वाहन|रसद|गाड़ी)/.test(q)) {
      return t('chat.replyPickup');
    }
    if (/(rate|price|mandi|market|bhav|cost|apmc|दर|भाव|मंडी|किंमत|बाजार|भाव|दाम)/.test(q)) {
      return t('chat.replyRate');
    }
    if (/(join|member|register|onboard|apply|fpo|सदस्य|जॉइन|सभासद|समूह|गट|पंजीकरण|नोंदणी)/.test(q)) {
      return t('chat.replyJoin');
    }
    if (/(quality|grade|assay|brix|test|sort|गुणवत्ता|ग्रेड|दर्जा|जांच|तपासणी)/.test(q)) {
      return t('chat.replyQuality');
    }
    if (/(buyer|auction|procure|supermarket|खरेदीदार|खरीदार|नीलामी|मार्केट)/.test(q)) {
      return t('chat.replyBuyer');
    }
    if (/(help|contact|support|phone|number|toll|मदद|सहायता|फोन|हेल्पलाइन|संपर्क)/.test(q)) {
      return t('chat.replySupport');
    }
    return t('chat.replyFallback');
  };

  const send = (text: string, canned?: string) => {
    const value = text.trim();
    if (!value) return;
    setInput('');
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: value }]);
    window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'agent', text: canned ?? answerFor(value) },
      ]);
    }, 450);
  };

  const handleClear = () => {
    setMessages([{ id: Date.now(), role: 'agent', text: t('chat.greeting') }]);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3 pointer-events-none" data-testid="chatbot">
      {open && (
        <div className="pointer-events-auto flex w-[calc(100vw-2rem)] sm:w-[390px] h-[520px] max-h-[82vh] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-primary/10 px-4 py-3 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Bot className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-sm font-bold leading-tight">{t('chat.title')}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    <Sparkles className="h-3 w-3" /> AI
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">{t('chat.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title={t('chat.clear')}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label={t('chat.clear')}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label={t('chat.close')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3.5" data-testid="chatbot-messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'agent' && (
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary mt-0.5 text-xs font-bold">
                    AC
                  </span>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'rounded-br-sm bg-primary text-primary-foreground shadow-sm'
                      : 'rounded-bl-sm border border-border/80 bg-muted/60 text-foreground'
                  }`}
                >
                  <div className="whitespace-pre-line break-words">{m.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick topic pills */}
          <div className="border-t border-border/70 bg-background/50 px-3 py-2.5">
            <p className="text-[10px] font-mono-app uppercase tracking-wider text-muted-foreground mb-1.5 px-1">
              {t('common.filter')}:
            </p>
            <div className="flex flex-nowrap overflow-x-auto gap-1.5 pb-1 no-scrollbar">
              {topics.map((item) => (
                <button
                  key={item.label}
                  onClick={() => send(item.label, item.reply)}
                  className="shrink-0 whitespace-nowrap rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-card p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="field min-h-[2.5rem] w-full text-xs"
              data-testid="input-chatbot"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-40 transition-opacity shadow-sm"
              aria-label={t('chat.send')}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="pointer-events-auto group relative grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-105 active:scale-95 transition-transform"
        aria-label={open ? t('chat.close') : t('chat.open')}
        data-testid="button-chatbot-toggle"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-card bg-accent text-[10px] font-bold text-accent-foreground animate-pulse">
            1
          </span>
        )}
        {!open && (
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background shadow-lg sm:group-hover:block">
            {t('chat.open')}
          </span>
        )}
      </button>
    </div>
  );
}
