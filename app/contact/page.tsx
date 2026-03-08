"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedSection from "@/components/AnimatedSection";

const contactTranslations: Record<string, {
  title: string; subtitle: string; name: string; email: string;
  subject: string; message: string; send: string; success: string;
  social: string; emailLabel: string; telegram: string;
}> = {
  ru: { title: "Контакты", subtitle: "Свяжитесь со мной", name: "Ваше имя", email: "Email", subject: "Тема", message: "Сообщение", send: "Отправить", success: "Спасибо! Ваше сообщение отправлено.", social: "Социальные сети", emailLabel: "Электронная почта", telegram: "Telegram" },
  en: { title: "Contact", subtitle: "Get in Touch", name: "Your Name", email: "Email", subject: "Subject", message: "Message", send: "Send", success: "Thank you! Your message has been sent.", social: "Social Media", emailLabel: "Email", telegram: "Telegram" },
  de: { title: "Kontakt", subtitle: "Kontaktieren Sie mich", name: "Ihr Name", email: "E-Mail", subject: "Betreff", message: "Nachricht", send: "Senden", success: "Vielen Dank! Ihre Nachricht wurde gesendet.", social: "Soziale Medien", emailLabel: "E-Mail", telegram: "Telegram" },
  fr: { title: "Contact", subtitle: "Contactez-moi", name: "Votre nom", email: "Email", subject: "Sujet", message: "Message", send: "Envoyer", success: "Merci ! Votre message a été envoyé.", social: "Réseaux sociaux", emailLabel: "Email", telegram: "Telegram" },
  zh: { title: "联系", subtitle: "与我联系", name: "您的姓名", email: "电子邮件", subject: "主题", message: "留言", send: "发送", success: "谢谢！您的消息已发送。", social: "社交媒体", emailLabel: "电子邮件", telegram: "Telegram" },
  ko: { title: "연락처", subtitle: "연락하기", name: "이름", email: "이메일", subject: "제목", message: "메시지", send: "보내기", success: "감사합니다! 메시지가 전송되었습니다.", social: "소셜 미디어", emailLabel: "이메일", telegram: "Telegram" },
};

export default function ContactPage() {
  const { language, t } = useLanguage();
  const ct = contactTranslations[language] || contactTranslations.ru;
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <section className="relative pt-20 pb-16 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <AnimatedSection>
            <h1 className="text-center font-display text-5xl sm:text-6xl md:text-7xl font-bold gradient-text mb-4">{ct.title}</h1>
            <p className="text-center text-lg text-gray-400 mb-16">{ct.subtitle}</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <AnimatedSection delay={200}>
              <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-6">
                <div className="h-1 bg-gradient-to-r from-purple-500 via-amber-500 to-purple-500 rounded-full -mt-8 -mx-8 mb-8 rounded-b-none" />
                {sent && (
                  <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 text-center">
                    ✨ {ct.success}
                  </div>
                )}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{ct.name}</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{ct.email}</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{ct.subject}</label>
                  <input type="text" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{ct.message}</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none" />
                </div>
                <button type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-amber-600 text-white font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-purple-500/20">
                  {ct.send}
                </button>
              </form>
            </AnimatedSection>

            {/* Contact Info */}
            <AnimatedSection delay={400}>
              <div className="space-y-6">
                {/* Email Card */}
                <div className="glass rounded-3xl p-8 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-2xl">📧</div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-gray-100">{ct.emailLabel}</h3>
                      <a href="mailto:natalia@melkher.com" className="text-purple-400 hover:text-purple-300 transition-colors">natalia@melkher.com</a>
                    </div>
                  </div>
                </div>

                {/* Telegram Card */}
                <div className="glass rounded-3xl p-8 hover:border-amber-500/30 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-2xl">✈️</div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-gray-100">{ct.telegram}</h3>
                      <a href="https://t.me/nataliamelkher" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 transition-colors">@nataliamelkher</a>
                    </div>
                  </div>
                </div>

                {/* Social Card */}
                <div className="glass rounded-3xl p-8">
                  <h3 className="font-display text-lg font-bold text-gray-100 mb-6">{ct.social}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "Instagram", icon: "📸", color: "from-pink-500 to-purple-500", url: "#" },
                      { name: "Facebook", icon: "📘", color: "from-blue-500 to-blue-600", url: "#" },
                      { name: "YouTube", icon: "🎬", color: "from-red-500 to-red-600", url: "#" },
                      { name: "TikTok", icon: "🎵", color: "from-gray-700 to-gray-900", url: "#" },
                    ].map((s) => (
                      <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group">
                        <span className="text-xl">{s.icon}</span>
                        <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{s.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Inspirational quote */}
                <div className="glass rounded-3xl p-8 text-center">
                  <p className="font-serif text-gray-400 italic text-lg leading-relaxed">
                    &ldquo;Каждое письмо — это мост между двумя сердцами&rdquo;
                  </p>
                  <p className="text-purple-400/60 text-sm mt-3">— Н.М.</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
