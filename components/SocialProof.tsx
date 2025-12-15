import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Quote, Crown, Hexagon } from 'lucide-react';
import { Content } from '../types';

interface SocialProofProps {
  content: Content['socialProof'];
}

const Counter = ({ value, className }: { value: string, className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Parse the value to find numeric and non-numeric parts
  // Handles formats like "120K€", "+300%", "5x"
  const match = value.match(/^([^0-9]*)([0-9]+)([^0-9]*)$/);
  const prefix = match ? match[1] : "";
  const number = match ? parseInt(match[2]) : 0;
  const suffix = match ? match[3] : value; // Fallback to full string if no number found

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 50, damping: 20, duration: 2000 });

  useEffect(() => {
    if (isInView && match) {
      motionValue.set(number);
    }
  }, [isInView, number, motionValue, match]);

  useEffect(() => {
    if(!match) return;
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.floor(latest)}${suffix}`;
      }
    });
    return () => unsubscribe();
  }, [springValue, prefix, suffix, match]);

  if (!match) {
     return <span className={className}>{value}</span>;
  }

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
};

const SocialProof: React.FC<SocialProofProps> = ({ content }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play effect
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % content.testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [content.testimonials.length, isPaused]);

  const next = () => setActiveIndex((prev) => (prev + 1) % content.testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + content.testimonials.length) % content.testimonials.length);

  const tools = [
    { name: 'n8n', logo: 'https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png' },
    { name: 'Make', logo: 'https://image.noelshack.com/fichiers/2025/50/4/1765466164-make-logo.png' },
    { name: 'GoHighLevel', logo: 'https://image.noelshack.com/fichiers/2025/50/4/1765464837-ghl-logo.png' },
    { name: 'OpenAI', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg' },
    { name: 'Claude', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg' },
    { name: 'Airtable', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg' },
    { name: 'Stripe', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg' },
    { name: 'Shopify', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg' },
    { name: 'Typeform', logo: 'https://cdn.worldvectorlogo.com/logos/typeform.svg' },
    { name: 'Notion', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg' },
    { name: 'Supabase', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/supabase/supabase-original.svg' },
  ];

  return (
    <section id="results" className="py-20 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { val: content.stats.revenue, label: content.stats.revenueLabel },
            { val: content.stats.time, label: content.stats.timeLabel },
            { val: content.stats.appointments, label: content.stats.appointmentsLabel },
            { val: content.stats.growth, label: content.stats.growthLabel },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center md:text-left"
            >
              <div className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                <Counter value={stat.val} />
              </div>
              <div className="text-sm md:text-base text-slate-500 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Carousel */}
        <div 
          className="relative max-w-5xl mx-auto mb-20"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
           <AnimatePresence mode="wait">
            <motion.div 
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="p-8 md:p-12 bg-slate-50 rounded-3xl border border-slate-100 relative shadow-sm min-h-[300px] flex flex-col justify-center"
            >
              <Quote className="absolute top-6 right-8 text-slate-200 w-16 h-16 md:w-24 md:h-24 rotate-12 -z-0" />
              
              <div className="relative z-10">
                <div className="flex gap-1 text-orange-500 mb-6">
                  {[...Array(content.testimonials[activeIndex].stars)].map((_, starIndex) => (
                    <Star key={starIndex} size={20} fill="currentColor" />
                  ))}
                </div>
                
                <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wide opacity-80 border-b border-slate-200 pb-2 inline-block">
                  {content.testimonials[activeIndex].project}
                </h4>
                
                <p className="text-xl md:text-2xl text-slate-700 italic leading-relaxed mb-8">
                  "{content.testimonials[activeIndex].quote}"
                </p>
                
                <div className="flex items-center gap-2">
                  <div className="h-1 w-12 bg-slate-300 rounded-full"></div>
                  <div className="text-sm text-slate-400 font-mono font-medium">
                    {content.testimonials[activeIndex].date}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <button 
              onClick={prev}
              className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-200 transition-all shadow-sm hover:shadow-md"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex gap-2">
              {content.testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-orange-500' : 'w-2.5 bg-slate-200 hover:bg-slate-300'}`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={next}
              className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-200 transition-all shadow-sm hover:shadow-md"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        
        {/* Badges & Logos */}
        <div className="mt-16 pt-10 border-t border-slate-100">
          <div className="flex flex-col items-center gap-6 mb-12">
              
              {/* Upwork Badges Row */}
              <div className="flex flex-wrap justify-center gap-8 mb-2">
                  {/* 100% Job Success */}
                  <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border-2 border-blue-600 flex items-center justify-center text-blue-600">
                        <Crown size={16} fill="currentColor" />
                      </div>
                      <span className="font-heading font-bold text-slate-800 text-base">100% Job Success</span>
                  </div>
                  
                  {/* Top Rated */}
                  <div className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center w-8 h-8 text-blue-600">
                         <Hexagon size={32} fill="currentColor" className="text-blue-600 rotate-90" />
                         <Star size={12} className="absolute text-white mb-[1px]" fill="currentColor" strokeWidth={0} />
                      </div>
                      <span className="font-heading font-bold text-slate-800 text-base">Top Rated</span>
                  </div>
              </div>

              {/* N8N Certification - Primary / Large */}
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-white rounded-2xl text-slate-900 text-xl font-bold border-2 border-orange-100 shadow-xl shadow-orange-500/10 transform hover:scale-105 transition-transform duration-300">
                   <img src="https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png" alt="n8n" className="w-8 h-8 object-contain" />
                   {content.certification}
              </div>

              {/* Maker School - Secondary */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-slate-500 text-sm font-medium border border-slate-100">
                   <CheckCircle2 size={16} className="text-green-600" />
                   {content.badge}
              </div>
          </div>
          
          <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-10">{content.toolsTitle}</p>
          
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-8 md:gap-x-12 md:gap-y-12 w-full opacity-70 hover:opacity-100 transition-opacity duration-300 px-4">
            {tools.map((t, i) => {
              const isMake = t.name === 'Make';
              return (
                <div 
                  key={i} 
                  className="h-9 w-28 md:h-12 md:w-40 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
                >
                    <img 
                      src={t.logo} 
                      alt={t.name} 
                      className={`max-w-full max-h-full object-contain opacity-80 hover:opacity-100 ${
                        isMake ? 'mix-blend-multiply p-1' : ''
                      }`} 
                      onError={(e) => {
                        // Fallback in case links fail
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('hidden');
                      }}
                    />
                </div>
              );
            })}
          </div>

           <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center text-slate-500 text-sm font-medium max-w-lg mx-auto italic"
           >
              {content.moreIntegrations}
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;