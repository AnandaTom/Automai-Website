/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ArrowRight, Star, CheckCircle2, Zap, Database, Mail, Calendar, UserPlus, Workflow, Linkedin, ChevronRight, TrendingUp, ChevronDown, Plus, Sparkles, MessageCircle, PenTool, Receipt } from 'lucide-react';
import { Language, Content } from './types';
import SocialProof from './components/SocialProof';

// Content Dictionary
const CONTENT: Record<Language, Content> = {
  fr: {
    nav: {
      services: "Services",
      results: "Résultats",
      about: "À propos",
      cta: "Réserver un appel"
    },
    hero: {
      title: "Automatisez votre business. Récupérez votre temps.",
      subtitle: "Je construis des systèmes d'automatisation IA sur-mesure qui éliminent vos tâches répétitives, réduisent vos erreurs et font grandir votre chiffre d'affaires pendant que vous vous concentrez sur ce qui compte vraiment.",
      cta: "Réserver mon appel découverte gratuit"
    },
    socialProof: {
      stats: {
        revenue: "120K€",
        revenueLabel: "générés via e-com IA",
        time: "80%",
        timeLabel: "de temps admin économisé",
        appointments: "5x",
        appointmentsLabel: "plus de rendez-vous",
        growth: "+300%",
        growthLabel: "croissance en 3 mois"
      },
      testimonials: [
        {
          stars: 5,
          project: "AI & Automation Specialist – Long-term Exclusive Partner for Bali Projects",
          quote: "Tom n’est pas seulement un excellent freelance : c’est un game-changer. Dès le premier jour, il a apporté une clarté, une vision et une maîtrise technique que je n’avais encore jamais vues sur Upwork. Chaque échange avec lui fait avancer le projet dix fois plus vite, et chaque livrable dépasse ce que j’attendais. Tom combine intelligence stratégique, précision d’exécution et une capacité rare à transformer des idées en résultats concrets. C’est simple : si vous cherchez quelqu’un de fiable, brillant, proactif et réellement investi dans votre succès, Tom est le meilleur choix.",
          date: "Dec 2025"
        },
        {
          stars: 5,
          project: "Make Automation Expert Needed for Existing Projects",
          quote: "Rien à dire comme à chaque projet ! Je recommande vivement :)",
          date: "Sep - Nov 2025"
        },
        {
          stars: 5,
          project: "Junior Automation Developer (n8n + GoHighLevel)",
          quote: "Tom makes the extra effort to make things work. He will go the extra mile to solve your problems. As a business owner, it is extremely valuable.",
          date: "Sep 2025"
        }
      ],
      badge: "Membre actif de Maker School — communauté mondiale d'excellence en automatisation IA.",
      certification: "Certifié Expert n8n",
      toolsTitle: "Stack Technique & Intégrations",
      moreIntegrations: "Je peux en intégrer des centaines d'autres, selon les logiciels de votre business."
    },
    caseStudies: {
      title: "Études de Cas",
      subtitle: "Des résultats concrets obtenus grâce à l'automatisation intelligente.",
      items: [
        {
          title: "De 10K à 40K€/mois en 3 mois",
          result: "+300% de croissance",
          description: [
            "Écosystème complet pour agence marketing (Salles de sport)",
            "Facturation bilingue automatique & Synchro GoHighLevel",
            "Dashboard financier & Relances impayés (Email/WhatsApp)",
            "Centralisation CRM et gestion automatisée du calendrier"
          ],
          tags: ["Agence", "GHL", "Finance"]
        },
        {
          title: "x5 Réservations & 5K€/mois",
          result: "-80% de temps admin",
          description: [
            "Automatisation complète : RDV, suivi client & emails",
            "Passage de 3 à 15 réservations/semaine (+400%)",
            "5000€/mois atteints en 6 mois",
            "Temps de gestion administrative réduit de 80%"
          ],
          tags: ["Santé", "Réservations", "Croissance"]
        },
        {
          title: "Rapports d'enquête & Scoring IA",
          result: "Génération 100% autonome",
          description: [
            "Flux intelligent Typeform vers générateur de documents",
            "Analyse automatique des réponses & calcul de scoring",
            "Génération de rapports PDF ultra-détaillés et personnalisés",
            "Envoi automatique par email sans intervention humaine"
          ],
          tags: ["Typeform", "Reporting", "Scoring"]
        },
        {
          title: "15h économisées par semaine",
          result: "Une seule automatisation",
          description: [
            "Synchronisation stock temps réel (Site E-com ↔ Entrepôt)",
            "Élimination totale des erreurs de stock",
            "Suppression des saisies manuelles fastidieuses",
            "Gain de 15h/semaine sur la logistique"
          ],
          tags: ["E-com", "Logistique", "Gain de temps"]
        },
        {
          title: "+120K€ en un an",
          result: "IA intégrée au e-commerce",
          description: [
            "Boutique 100% optimisée par l'IA",
            "Rédaction automatique des fiches produits",
            "Service client géré par Chatbot IA autonome",
            "Structure ultra-légère pour profitabilité maximale"
          ],
          tags: ["E-com", "IA Générative", "Profitabilité"]
        }
      ]
    },
    services: {
      title: "Des systèmes qui travaillent pour vous, 24/7",
      cta: "Discutons de votre projet",
      morePossibilities: "Et beaucoup d'autres possibilités dans tous les aspects de votre entreprise...",
      items: [
        { title: "Cold e-mail & Lead Gen", desc: "Captez et qualifiez vos prospects automatiquement grâce à l'IA.", icon: "zap" },
        { title: "Systèmes de ventes", desc: "Pipelines CRM automatisés et suivi des deals sans friction.", icon: "db" },
        { title: "Facturation automatique", desc: "Devis, factures et relances gérés sans aucune intervention humaine.", icon: "receipt" },
        { title: "Systèmes de contenus", desc: "Création, programmation et repurposing de contenu assisté par IA.", icon: "sparkles" },
        { title: "Prise de RDV", desc: "Fini les no-shows. Calendrier connecté et rappels automatiques.", icon: "calendar" },
        { title: "Onboarding client", desc: "Accueillez vos nouveaux clients avec des parcours fluides.", icon: "user" },
        { title: "Intégrations sur-mesure", desc: "APIs, webhooks, n8n, Make... Je connecte tous vos outils.", icon: "workflow" }
      ]
    },
    about: {
      title: "Un partenaire, pas juste un prestataire",
      text: [
        "Je m'appelle Tom. J'ai lancé une boutique e-commerce qui a fait 120K€ en un an. J'aide une marque de maillots de bain balinaise à économiser 15h/semaine sur sa gestion de stock.",
        "Actuellement, j'accompagne une agence de marketing digital pour scaler de 10K à 300K€/mois. En seulement 3 mois d'automatisation, nous avons déjà atteint les 40K€."
      ],
      philosophy: [
        "Transparence totale — vous savez exactement ce que je fais",
        "Systèmes simples — pas d'usine à gaz, des solutions durables",
        "Résultats mesurables — on parle en heures et en euros"
      ]
    },
    finalCta: {
      title: "Prêt à automatiser votre business ?",
      subtitle: "Réservez un appel découverte gratuit de 30 minutes. On analyse ensemble vos processus et je vous montre ce qui peut être automatisé.",
      cta: "Réserver mon appel gratuit"
    },
    footer: {
      rights: "Tous droits réservés.",
      legal: "Mentions légales"
    }
  },
  en: {
    nav: {
      services: "Services",
      results: "Results",
      about: "About",
      cta: "Book a call"
    },
    hero: {
      title: "Automate your business. Reclaim your time.",
      subtitle: "I build custom AI automation systems that eliminate repetitive tasks, reduce errors, and grow your revenue while you focus on what truly matters.",
      cta: "Book my free discovery call"
    },
    socialProof: {
      stats: {
        revenue: "€120K",
        revenueLabel: "generated via AI e-com",
        time: "80%",
        timeLabel: "admin time saved",
        appointments: "5x",
        appointmentsLabel: "more appointments",
        growth: "+300%",
        growthLabel: "growth in 3 months"
      },
      testimonials: [
        {
          stars: 5,
          project: "AI & Automation Specialist – Long-term Exclusive Partner for Bali Projects",
          quote: "Tom is not just an excellent freelancer: he is a game-changer. From day one, he brought clarity, vision, and technical mastery that I had never seen on Upwork before. Every interaction with him moves the project forward ten times faster. Tom combines strategic intelligence, execution precision, and a rare ability to transform ideas into concrete results. It's simple: if you're looking for someone reliable, brilliant, proactive, and truly invested in your success, Tom is the best choice you can make.",
          date: "Dec 2025"
        },
        {
          stars: 5,
          project: "Make Automation Expert Needed for Existing Projects",
          quote: "Nothing to add, just like every project! Highly recommended :)",
          date: "Sep - Nov 2025"
        },
        {
          stars: 5,
          project: "Junior Automation Developer (n8n + GoHighLevel)",
          quote: "Tom makes the extra effort to make things work. He will go the extra mile to solve your problems. As a business owner, it is extremely valuable.",
          date: "Sep 2025"
        }
      ],
      badge: "Active member of Maker School — world-class community for AI automation excellence.",
      certification: "n8n Certified Expert",
      toolsTitle: "Tech Stack & Integrations",
      moreIntegrations: "I can integrate hundreds more, depending on your business software."
    },
    caseStudies: {
      title: "Case Studies",
      subtitle: "Concrete results achieved through intelligent automation.",
      items: [
        {
          title: "From 10K to 40K€/mo in 3 months",
          result: "+300% growth",
          description: [
            "Complete ecosystem for Digital Marketing Agency (Gyms)",
            "Bilingual auto-invoicing (FR/EN) & GoHighLevel Sync",
            "Real-time Financial Dashboard & Auto-collections",
            "Centralized CRM & Automated Calendar Management"
          ],
          tags: ["Agency", "GHL", "Finance"]
        },
        {
          title: "5x Bookings & €5K/mo",
          result: "-80% Admin Time",
          description: [
            "Full automation: Scheduling, Client Follow-up & Emails",
            "Scaled from 3 to 15 bookings/week (+400%)",
            "Reached €5K/month revenue in 6 months",
            "Administrative workload reduced by 80%"
          ],
          tags: ["Health", "Booking", "Growth"]
        },
        {
          title: "Survey Reports & AI Scoring",
          result: "100% autonomous",
          description: [
            "Smart flow connecting Typeform to Document Generator",
            "Automated response analysis & complex scoring",
            "Generation of personalized, detailed PDF reports",
            "Automatic email delivery with zero manual input"
          ],
          tags: ["Typeform", "Reporting", "Scoring"]
        },
        {
          title: "15h saved per week",
          result: "A single automation",
          description: [
            "Real-time stock sync (E-com Site ↔ Warehouse)",
            "Total elimination of stock discrepancies",
            "Removal of tedious manual data entry",
            "15 hours saved weekly on logistics"
          ],
          tags: ["E-com", "Logistics", "Time Saving"]
        },
        {
          title: "+120K€ in one year",
          result: "AI integrated into e-com",
          description: [
            "100% AI-optimized E-commerce store",
            "Automated product description writing via AI",
            "Autonomous AI Chatbot for customer service",
            "Ultra-lean structure for maximum profitability"
          ],
          tags: ["E-com", "Generative AI", "Profitability"]
        }
      ]
    },
    services: {
      title: "Systems that work for you, 24/7",
      cta: "Let's discuss your project",
      morePossibilities: "And many other possibilities in all aspects of your business...",
      items: [
        { title: "Cold Email & Lead Gen", desc: "Capture and qualify leads automatically with AI.", icon: "zap" },
        { title: "Sales Systems", desc: "Automated CRM pipelines and frictionless deal tracking.", icon: "db" },
        { title: "Automatic Invoicing", desc: "Quotes, invoices, and follow-ups managed with zero human intervention.", icon: "receipt" },
        { title: "Content Systems", desc: "AI-assisted content creation, scheduling, and repurposing.", icon: "sparkles" },
        { title: "Scheduling & Reminders", desc: "No more no-shows. Connected calendar and auto-reminders.", icon: "calendar" },
        { title: "Client Onboarding", desc: "Welcome new clients with smooth, professional journeys.", icon: "user" },
        { title: "Custom Integrations", desc: "APIs, webhooks, n8n, Make... connecting all your tools.", icon: "workflow" }
      ]
    },
    about: {
      title: "A partner, not just a contractor",
      text: [
        "My name is Tom. J'ai lancé une boutique e-commerce qui a fait 120K€ en un an. J'aide une marque de maillots de bain balinaise à économiser 15h/week on stock management.",
        "Currently, I am helping a digital marketing agency scale from €10K to €300K/month. In just 3 months of automation, we have already reached €40K."
      ],
      philosophy: [
        "Total transparency — you know exactly what I'm doing",
        "Simple systems — no over-engineering, just durable solutions",
        "Measurable results — we speak in hours saved and revenue gained"
      ]
    },
    finalCta: {
      title: "Ready to automate your business?",
      subtitle: "Book a free 30-minute discovery call. We'll analyze your processes together and I'll show you what can be automated.",
      cta: "Book my free call"
    },
    footer: {
      rights: "All rights reserved.",
      legal: "Legal Notice"
    }
  }
};

// --- Components ---

const Header = ({ lang, setLang, content }: { lang: Language, setLang: (l: Language) => void, content: Content['nav'] }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
          automai<span className="text-orange-500">.</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo('services')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{content.services}</button>
          <button onClick={() => scrollTo('results')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{content.results}</button>
          <button onClick={() => scrollTo('about')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{content.about}</button>
          
          {/* Language Toggle */}
          <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-full border border-slate-200">
             <button 
               onClick={() => setLang('fr')}
               className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-xs font-bold ${lang === 'fr' ? 'bg-white shadow-sm scale-105 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
             >
               FR
             </button>
             <button 
               onClick={() => setLang('en')}
               className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-xs font-bold ${lang === 'en' ? 'bg-white shadow-sm scale-105 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
             >
               EN
             </button>
          </div>

          <a href="https://cal.com/automai/30min" target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-lg shadow-slate-900/20">
            {content.cta}
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
           <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full">
             <button 
               onClick={() => setLang('fr')}
               className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-xs font-bold ${lang === 'fr' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
             >
               FR
             </button>
             <button 
               onClick={() => setLang('en')}
               className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-xs font-bold ${lang === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
             >
               EN
             </button>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-900">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 1, height: 'auto' }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              <button onClick={() => scrollTo('services')} className="text-left text-lg font-medium text-slate-700">{content.services}</button>
              <button onClick={() => scrollTo('results')} className="text-left text-lg font-medium text-slate-700">{content.results}</button>
              <button onClick={() => scrollTo('about')} className="text-left text-lg font-medium text-slate-700">{content.about}</button>
              <a href="https://cal.com/automai/30min" target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white px-6 py-3 rounded-lg text-center font-bold">
                {content.cta}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ content }: { content: Content['hero'] }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            AI Automation Expert
          </div>
          <h1 className="font-heading text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
            {content.title.split('.')[0]}.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              {content.title.split('.')[1]}.
            </span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-lg">
            {content.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://cal.com/automai/30min" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-orange-700 transition-all hover:shadow-xl hover:shadow-orange-500/20 hover:-translate-y-1"
            >
              {content.cta} <ArrowRight size={20} />
            </a>
          </div>
        </motion.div>

        {/* Profile Picture replacing TechStackVisual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center items-center"
        >
            <div className="relative z-10 w-full max-w-[400px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 group">
                 <img 
                   src="https://image.noelshack.com/fichiers/2025/50/3/1765386405-moi-2025-pro.jpg" 
                   alt="Tom - AI Automation Expert"
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                 />
                 
                 {/* Waving Hand Emoji Overlay */}
                 <motion.div 
                    initial={{ opacity: 0, scale: 0, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    whileHover={{ rotate: [0, -20, 10, -10, 0], transition: { duration: 0.5 } }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg border border-white/60 z-20 cursor-default"
                 >
                   <span className="text-3xl block">👋</span>
                 </motion.div>
            </div>
            
            {/* Decorative blobs behind */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-orange-200/40 to-blue-200/40 blur-3xl rounded-full opacity-60 animate-pulse"></div>
        </motion.div>
      </div>
    </section>
  );
};

const CaseStudies = ({ content }: { content: Content['caseStudies'] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">{content.title}</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mx-auto mb-6"></div>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            {content.subtitle}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {content.items.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group bg-white rounded-[2rem] transition-all duration-300 cursor-pointer border ${openIndex === i ? 'border-orange-200 shadow-2xl ring-4 ring-orange-500/5' : 'border-slate-100 shadow-lg hover:shadow-2xl hover:border-orange-100 hover:-translate-y-1'}`}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="p-8 md:p-10">
                 {/* Header: Tags & Toggle */}
                 <div className="flex items-start justify-between gap-4 mb-6">
                     <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, t) => (
                          <span key={t} className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                            {tag}
                          </span>
                        ))}
                     </div>
                     <button 
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === i ? 'bg-orange-500 text-white rotate-45' : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500'}`}
                        aria-label="Toggle details"
                     >
                        <Plus size={20} />
                     </button>
                 </div>

                 {/* Title */}
                 <h3 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight group-hover:text-orange-950 transition-colors">
                   {item.title}
                 </h3>
                 
                 {/* Result Indicator */}
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Résultat</div>
                      <div className="font-bold text-slate-900 text-lg">{item.result}</div>
                    </div>
                 </div>

                 {/* Expandable Content */}
                 <motion.div 
                    initial={false}
                    animate={{ height: openIndex === i ? 'auto' : 0, opacity: openIndex === i ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                 >
                    <div className="pt-6 border-t border-slate-100">
                       <ul className="space-y-3">
                        {item.description.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-slate-600 text-lg leading-relaxed">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                 </motion.div>
                 
                 {/* CTA hint when closed */}
                 <motion.div 
                    animate={{ opacity: openIndex === i ? 0 : 1, height: openIndex === i ? 0 : 'auto' }}
                    className="mt-6 flex items-center text-orange-600 font-bold text-sm gap-2 group-hover:gap-3 transition-all"
                 >
                    <span>Voir les détails</span> <ArrowRight size={16} />
                 </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Services = ({ content }: { content: Content['services'] }) => {
  const getIcon = (name: string) => {
    switch(name) {
      case 'zap': return <Zap size={24} className="text-orange-500" />;
      case 'db': return <Database size={24} className="text-blue-500" />;
      case 'mail': return <Mail size={24} className="text-purple-500" />;
      case 'calendar': return <Calendar size={24} className="text-pink-500" />;
      case 'user': return <UserPlus size={24} className="text-cyan-500" />;
      case 'workflow': return <Workflow size={24} className="text-indigo-500" />;
      case 'sparkles': return <Sparkles size={24} className="text-amber-500" />;
      case 'receipt': return <Receipt size={24} className="text-emerald-500" />;
      case 'pen': return <PenTool size={24} className="text-rose-500" />;
      default: return <Zap size={24} />;
    }
  };

  return (
    <section id="services" className="py-24 bg-white border-y border-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">{content.title}</h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5, borderColor: 'rgba(249, 115, 22, 0.3)', boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-white p-8 rounded-2xl border border-slate-100 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                {getIcon(item.icon)}
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm lg:text-base">{item.desc}</p>
            </motion.div>
          ))}
          
           {/* CTA Card as the last item to encourage action */}
           <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900 p-8 rounded-2xl flex flex-col justify-center items-center text-center shadow-xl group hover:scale-[1.02] transition-transform duration-300"
            >
              <h3 className="font-heading text-2xl font-bold text-white mb-4">Un besoin spécifique ?</h3>
              <p className="text-slate-400 mb-8 text-sm">Je m'adapte à votre stack et vos contraintes.</p>
              <a href="https://cal.com/automai/30min" target="_blank" rel="noopener noreferrer" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors w-full">
                {content.cta}
              </a>
            </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-500 italic font-medium max-w-xl mx-auto">
            {content.morePossibilities}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const About = ({ content }: { content: Content['about'] }) => {
  return (
    <section id="about" className="py-24 bg-slate-50 overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-8">{content.title}</h2>
            <div className="space-y-6 text-lg text-slate-600 mb-10">
              {content.text.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
               <ul className="space-y-4">
                 {content.philosophy.map((item, i) => (
                   <li key={i} className="flex items-start gap-3">
                     <CheckCircle2 size={24} className="text-orange-500 shrink-0 mt-0.5" />
                     <span className="font-medium text-slate-800">{item}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="lg:col-span-5 relative"
          >
             <div className="absolute inset-0 bg-orange-100 rounded-3xl transform rotate-6 scale-95 opacity-50"></div>
             <div className="absolute inset-0 bg-blue-100 rounded-3xl transform -rotate-3 scale-95 opacity-50"></div>
             <div className="relative aspect-[4/5] bg-slate-200 rounded-3xl overflow-hidden shadow-2xl group">
               <img 
                 src="https://image.noelshack.com/fichiers/2025/50/3/1765386405-moi-2025-pro.jpg" 
                 onError={(e) => {
                   // Fallback to the professional placeholder if the user link fails (likely because it's a page link)
                   e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop";
                 }}
                 alt="Tom profile" 
                 className="w-full h-full object-cover filter contrast-110 saturate-105 transition-transform duration-700 group-hover:scale-105"
               />
             </div>
             
             {/* Floating Growth Card */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.5, duration: 0.5 }}
               className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-slate-100 max-w-[260px] w-full"
             >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-green-50 rounded-xl text-green-600 shadow-sm">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Agency Scaling</div>
                    <div className="text-slate-900 font-bold text-sm">10k€ <ArrowRight className="inline w-3 h-3 mx-1 text-slate-300" /> 40k€</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Mois 0</span>
                    <span>Mois 3</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: "25%" }}
                      whileInView={{ width: "40%" }} // Visual representation of progress towards larger goal
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                      className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full relative"
                    >
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30"></div>
                    </motion.div>
                  </div>
                  <div className="text-right text-xs font-bold text-green-600">+300% Growth</div>
                </div>
             </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ content }: { content: Content['footer'] }) => {
  return (
    <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <div className="font-heading text-2xl font-bold tracking-tight mb-2">
            automai<span className="text-orange-500">.</span>
          </div>
          <p className="text-slate-400 text-sm">© 2025 Automai. {content.rights}</p>
        </div>
        
        <div className="flex gap-8 items-center">
          <a href="mailto:tom@automai.fr" className="text-slate-400 hover:text-white transition-colors">tom@automai.fr</a>
          <a href="#linkedin" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
          <a href="#mentions-legales" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{content.legal}</a>
        </div>
      </div>
    </footer>
  );
};

const FinalCTA = ({ content }: { content: Content['finalCta'] }) => {
  return (
    <section className="py-24 px-6 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-[50%] -left-[20%] w-[100vw] h-[100vw] bg-blue-600 rounded-full blur-[100px]"></div>
          <div className="absolute top-[50%] right-[0] w-[50vw] h-[50vw] bg-orange-600 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {content.title}
        </h2>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          {content.subtitle}
        </p>
        <a 
          href="https://cal.com/automai/30min" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-orange-500 text-white px-10 py-5 rounded-xl text-lg font-bold hover:bg-orange-600 transition-all hover:scale-105 shadow-2xl shadow-orange-500/30"
        >
          {content.cta} <ChevronRight size={24} />
        </a>
      </div>
    </section>
  )
}

// --- Main App ---

const App: React.FC = () => {
  // Initialize language from localStorage or browser preference, default to 'fr'
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('automai-lang');
    return (saved === 'fr' || saved === 'en') ? saved : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('automai-lang', language);
  }, [language]);

  const content = CONTENT[language];

  return (
    <div className="font-sans text-slate-900 bg-white selection:bg-orange-100 selection:text-orange-900">
      <Header lang={language} setLang={setLanguage} content={content.nav} />
      <main>
        <Hero content={content.hero} />
        <SocialProof content={content.socialProof} />
        <CaseStudies content={content.caseStudies} />
        <Services content={content.services} />
        <About content={content.about} />
        <FinalCTA content={content.finalCta} />
      </main>
      <Footer content={content.footer} />
    </div>
  );
};

export default App;