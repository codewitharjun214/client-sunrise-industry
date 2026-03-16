import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight, 
  X, 
  Check, 
  LayoutDashboard, 
  LogOut, 
  Trash2, 
  Rocket, 
  Star, 
  Handshake, 
  Sprout,
  Menu,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  division: string;
  message: string;
  date: string;
}

interface ServiceDetail {
  id: string;
  title: string;
  sub: string;
  icon: string;
  img: string;
  sections: { h: string; items: string[] }[];
}

// --- Custom Logo Component ---
const LogoIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`${className} relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-green-main to-green-dark shadow-lg shadow-green-main/20`}>
    {/* Stylized Sun */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full blur-[1px]" />
    {/* Horizon Line */}
    <div className="absolute bottom-2 w-full h-4 bg-green-dark/40 backdrop-blur-[2px]" />
    {/* Stylized 'S' */}
    <span className="relative z-10 text-white font-black text-xl italic tracking-tighter">S</span>
  </div>
);

// --- Data ---
const SERVICES: Record<string, ServiceDetail> = {
  cgi: {
    id: 'cgi',
    title: 'CGI & Render Farm / AR-VR',
    sub: 'Visual Excellence Division',
    icon: '🎬',
    img: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=1000',
    sections: [
      { h: 'Visualization Services', items: ['Product visualization', 'Architectural rendering', 'Consumer product visualization', 'Before & After rendering'] },
      { h: 'Render Farm', items: ['Thousands+ node render farm', 'NVidia GeForce RTX compatibility', 'NVidia Quadro Series', 'Autodesk applications', 'V-Ray & Arnold plug-ins'] },
      { h: 'AR / VR Solutions', items: ['Virtual Reality experiences', 'Augmented Reality integration', 'Mixed Reality development', 'Cost optimization for clients'] }
    ]
  },
  simulator: {
    id: 'simulator',
    title: 'Driving Simulator Solutions',
    sub: 'Simulation Technology Division',
    icon: '🚗',
    img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1000',
    sections: [
      { h: 'Development', items: ['Custom simulator development', 'Unreal Engine integration', 'Unity Engine integration', '3D environment design', 'Software development'] },
      { h: 'Benefits', items: ['Reduced training cost & time', 'Safe training environment', 'Customizable scenarios', 'Realistic physics', 'Multi-user networked training'] }
    ]
  },
  '3d': {
    id: '3d',
    title: '3D Scanning & Printing',
    sub: 'Advanced Manufacturing Division',
    icon: '🔬',
    img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000',
    sections: [
      { h: '3D Scanning', items: ['White light scanners', 'Scan range: 15mm to 10m', 'High precision data capture', 'Point cloud to CAD conversion'] },
      { h: 'Reverse Engineering', items: ['Part remanufacturing', 'Repair & redesign', 'Benchmarking', 'GD&T inspection', '3D tolerance color plots'] },
      { h: '3D Printing', items: ['FDM · SLS · SLA technologies', 'Materials: ABS, PLA, Nylon, Resin', 'Rapid prototyping', 'Engineering & industrial use'] }
    ]
  },
  laser: {
    id: 'laser',
    title: 'Laser Cutting & Fabrication',
    sub: 'Precision Manufacturing Division',
    icon: '⚙️',
    img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1000',
    sections: [
      { h: 'Services', items: ['High-precision laser cutting', 'MIG Welding', 'TIG Welding', 'CNC Machining', 'Assembly', 'Finishing & coating'] },
      { h: 'Advanced', items: ['Robotics collaboration', 'High precision & automation', 'Custom fabrication solutions', 'Industrial-grade outputs'] }
    ]
  },
  solar: {
    id: 'solar',
    title: 'Solar Services',
    sub: 'Renewable Energy Division',
    icon: '☀️',
    img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1000',
    sections: [
      { h: 'Services', items: ['Solar licensing assistance', 'Regulatory compliance', 'Rooftop solar (RTS) installation', 'Safety protocols', 'Carbon footprint reduction'] },
      { h: 'Financial Benefits', items: ['Subsidy identification & processing', 'ROI enhancement', 'Cost-benefit analysis', 'Government scheme navigation', 'Long-term energy savings'] }
    ]
  },
  networking: {
    id: 'networking',
    title: 'Internet, Hardware & Networking',
    sub: 'Technology Infrastructure Division',
    icon: '🌐',
    img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1000',
    sections: [
      { h: 'Infrastructure', items: ['Network setup (802.11 standards)', 'Gigabit optic fiber installation', 'Infrastructure evaluation', 'Hardware procurement & setup'] },
      { h: 'Security', items: ['Data security solutions', 'Intrusion & DoS protection', 'Disaster recovery planning', 'Business continuity', 'Network monitoring'] }
    ]
  }
};

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle');
  const [mobileMenu, setMobileMenu] = useState(false);

  // Admin Credentials
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    
    // Load inquiries from localStorage
    const saved = localStorage.getItem('si_inquiries');
    if (saved) setInquiries(JSON.parse(saved));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newInquiry: Inquiry = {
      id: Date.now(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || '—',
      division: formData.get('division') as string || 'General',
      message: formData.get('message') as string,
      date: new Date().toLocaleDateString('en-IN'),
    };

    const updated = [newInquiry, ...inquiries];
    setInquiries(updated);
    localStorage.setItem('si_inquiries', JSON.stringify(updated));
    setFormStatus('success');
    e.currentTarget.reset();
    setTimeout(() => setFormStatus('idle'), 5000);
  };

  const deleteInquiry = (id: number) => {
    if (!confirm('Delete this inquiry?')) return;
    const updated = inquiries.filter(i => i.id !== id);
    setInquiries(updated);
    localStorage.setItem('si_inquiries', JSON.stringify(updated));
  };

  const loginAdmin = () => {
    if (adminUser === 'admin' && adminPass === 'sunrise2016') {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
    } else {
      alert('Invalid credentials. (admin / sunrise2016)');
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-green-light selection:text-white">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-100' : 'bg-transparent'}`}>
        <a href="#hero" className="flex items-center gap-3 group">
          <LogoIcon className="w-10 h-10 group-hover:rotate-12 transition-transform duration-500" />
          <div className="hidden sm:block">
            <h1 className={`font-serif font-bold text-lg leading-none ${scrolled ? 'text-green-dark' : 'text-white'}`}>Sunrise Industry</h1>
            <p className={`text-[10px] uppercase tracking-[0.2em] mt-1 ${scrolled ? 'text-green-main' : 'text-white/70'}`}>Pvt Ltd · Est. 2016</p>
          </div>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {['About', 'Divisions', 'Why Us', 'Contact'].map(link => (
            <a 
              key={link} 
              href={`#${link.toLowerCase().replace(' ', '')}`} 
              className={`text-xs uppercase tracking-widest font-semibold transition-colors hover:text-green-light ${scrolled ? 'text-slate-700' : 'text-white'}`}
            >
              {link}
            </a>
          ))}
          <a href="#contact" className="bg-green-main hover:bg-green-dark text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-green-main/30 hover:-translate-y-0.5">
            Get In Touch
          </a>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenu(!mobileMenu)}>
          <Menu className={scrolled ? 'text-green-dark' : 'text-white'} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[60] bg-green-dark flex flex-col items-center justify-center gap-8"
          >
            <button className="absolute top-6 right-6 text-white" onClick={() => setMobileMenu(false)}>
              <X size={32} />
            </button>
            {['About', 'Divisions', 'Why Us', 'Contact'].map(link => (
              <a 
                key={link} 
                href={`#${link.toLowerCase().replace(' ', '')}`} 
                onClick={() => setMobileMenu(false)}
                className="text-2xl font-serif text-white hover:text-green-light transition-colors"
              >
                {link}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center px-6 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-dark/80 via-blue-dark/60 to-slate-900 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Industrial Background"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-20 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] uppercase tracking-[0.2em] mb-6 backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 bg-green-light rounded-full animate-pulse" />
            Est. 2016 · Pune, India
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-serif font-black text-white leading-[0.9] tracking-tighter mb-6"
          >
            Harnessing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-light to-blue-light">Sustainable</span> <br />
            Power.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg md:text-xl max-w-xl font-light italic leading-relaxed mb-10"
          >
            Delivering innovative, integrated service solutions across CGI, Simulation, Manufacturing, and Energy sectors.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <a href="#divisions" className="bg-green-main hover:bg-green-dark text-white px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 group">
              Explore Divisions <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact" className="bg-transparent hover:bg-white/10 text-white border-2 border-white/30 px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-xs transition-all">
              Book Consultation
            </a>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 animate-bounce"
        >
          <ArrowDown size={24} />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-full object-cover"
                alt="About Sunrise Industry"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-gradient-to-br from-green-dark to-blue-dark text-white p-8 rounded-2xl shadow-xl">
              <p className="text-4xl font-serif font-bold">2016</p>
              <p className="text-[10px] uppercase tracking-widest opacity-70">Year Founded</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-green-main" />
              <p className="text-xs uppercase tracking-[0.3em] text-green-main font-bold">Our Story</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight">
              Built on Vision, <br />
              <span className="italic text-green-main font-normal">Driven by Purpose</span>
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p>Founded in 2016, Sunrise Industry Pvt Ltd has emerged as a pioneering force in multi-sector service delivery — at the forefront of innovative solutions combining technology, craftsmanship, and strategic vision.</p>
              <p>Our integrated approach creates synergy across all six divisions, ensuring efficiency and measurable impact for every client — from startups to large enterprises.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10">
              {[
                { icon: <Rocket size={18} />, label: 'Innovation' },
                { icon: <Star size={18} />, label: 'Quality' },
                { icon: <Handshake size={18} />, label: 'Partnership' },
                { icon: <Sprout size={18} />, label: 'Sustainability' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="text-green-main">{item.icon}</div>
                  <span className="text-xs uppercase font-bold tracking-widest text-slate-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divisions Section */}
      <section id="divisions" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-green-main" />
              <p className="text-xs uppercase tracking-[0.3em] text-green-main font-bold">Our Divisions</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">Six Pillars of <span className="text-blue-main">Excellence</span></h2>
            <p className="text-slate-500">Click any division to explore full capabilities and send a direct enquiry.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-xl">
            {Object.values(SERVICES).map((svc, idx) => (
              <motion.div 
                key={svc.id}
                whileHover={{ y: -5 }}
                className="bg-white group cursor-pointer"
                onClick={() => setActiveModal(svc.id)}
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={svc.img} alt={svc.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <span className="absolute top-4 left-4 font-serif text-4xl font-black text-white/20">{String(idx + 1).padStart(2, '0')}</span>
                </div>
                <div className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl mb-6 group-hover:bg-green-main group-hover:text-white transition-colors">
                    {svc.icon}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-3 group-hover:text-green-main transition-colors">{svc.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-2">
                    Professional solutions tailored for B2C, B2B, and OEM segments with guaranteed quality.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-green-main group-hover:gap-4 transition-all">
                    Explore & Enquire <ChevronRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="whyus" className="py-24 px-6 bg-green-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-green-light font-bold mb-4">Our Advantage</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Why Choose <span className="italic font-normal text-green-light">Sunrise Industry</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { t: 'Industry Leadership', d: 'Nine+ years of transformative solutions across six specialized domains with a strong market reputation.', i: '🏆' },
              { t: 'Skilled Expert Team', d: 'Multidisciplinary experts in engineering, design, technology, and project management on every project.', i: '👥' },
              { t: 'Client-Centric', d: 'Every project tailored to unique client needs, ensuring satisfaction and long-term partnerships.', i: '🤝' },
              { t: 'Proven Track Record', d: 'Successful delivery across B2C, B2B, OEM, and enterprise segments with measurable outcomes.', i: '📊' },
              { t: 'Innovation & R&D', d: 'Continuous R&D investment ensures our clients access the most advanced technology solutions.', i: '💡' },
              { t: 'Cutting-Edge Tech', d: 'From NVIDIA RTX render farms to gigabit fiber — only the best tools in every field.', i: '🔧' },
            ].map(item => (
              <div key={item.t} className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all hover:-translate-y-1">
                <div className="text-4xl mb-6">{item.i}</div>
                <h3 className="text-xl font-serif font-bold text-white mb-3">{item.t}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-green-main font-bold mb-4">Client Voices</p>
            <h2 className="text-4xl font-serif font-bold text-slate-900">What Our Clients <span className="italic font-normal text-green-main">Say</span></h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { q: 'Sunrise Industry delivered our product visualization with exceptional quality. Their render farm turnaround times were completely unmatched.', a: 'Client — CGI Division', r: 'Product Manufacturer, Pune' },
              { q: 'The driving simulator completely transformed our driver training program. Training costs dropped by over 40% and simulation quality is outstanding.', a: 'Client — Simulator Division', r: 'Driving Institute, Maharashtra' },
              { q: 'The rooftop solar installation was handled with complete professionalism. Their subsidy processing expertise saved us a significant part of our investment.', a: 'Client — Solar Division', r: 'Commercial Building Owner' },
            ].map((t, idx) => (
              <div key={idx} className="bg-white p-10 rounded-2xl shadow-sm border-t-4 border-green-main">
                <div className="text-6xl font-serif text-green-light leading-none mb-4">“</div>
                <p className="text-slate-600 italic mb-8 leading-relaxed">"{t.q}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-pale" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.a}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">{t.r}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-green-main" />
              <p className="text-xs uppercase tracking-[0.3em] text-green-main font-bold">Reach Us</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8">Let's Build <br /><span className="italic font-normal text-green-main">Something Great</span></h2>
            <p className="text-slate-500 mb-12 leading-relaxed">We'd love to discuss your project. Reach out via the form or contact us directly — we typically respond within one business day.</p>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-green-pale flex items-center justify-center text-green-main shrink-0"><Phone size={20} /></div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Phone</p>
                  <p className="text-slate-900 font-semibold">83800 93900</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-green-pale flex items-center justify-center text-green-main shrink-0"><Mail size={20} /></div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Email</p>
                  <p className="text-slate-900 font-semibold">sunriseindustry10@gmail.com</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-green-pale flex items-center justify-center text-green-main shrink-0"><MapPin size={20} /></div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Location</p>
                  <p className="text-slate-900 font-semibold">Pune, Maharashtra, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100">
            {formStatus === 'success' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-green-pale border-l-4 border-green-main text-green-dark text-sm rounded-r-lg flex items-center gap-3"
              >
                <Check size={18} /> Thank you! We'll be in touch within one business day.
              </motion.div>
            )}
            <form className="space-y-6" onSubmit={handleContactSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Full Name *</label>
                  <input type="text" name="name" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-main focus:ring-0 transition-colors outline-none bg-slate-50" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Email *</label>
                  <input type="email" name="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-main focus:ring-0 transition-colors outline-none bg-slate-50" placeholder="john@example.com" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Phone</label>
                  <input type="tel" name="phone" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-main focus:ring-0 transition-colors outline-none bg-slate-50" placeholder="+91 00000 00000" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Division</label>
                  <select name="division" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-main focus:ring-0 transition-colors outline-none bg-slate-50">
                    <option value="">Select a Division</option>
                    {Object.values(SERVICES).map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                    <option value="General">General Inquiry</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Message *</label>
                <textarea name="message" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-main focus:ring-0 transition-colors outline-none bg-slate-50 min-h-[120px]" placeholder="Tell us about your project..."></textarea>
              </div>
              <button type="submit" className="w-full bg-green-dark hover:bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-xl shadow-green-dark/20">
                Send Message →
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 pt-24 pb-12 px-6 text-white/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <LogoIcon className="w-10 h-10" />
              <div>
                <h3 className="font-serif font-bold text-white text-lg leading-none">Sunrise Industry</h3>
                <p className="text-[10px] uppercase tracking-widest text-green-main mt-1">Pvt Ltd · Est. 2016</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-8">Harnessing Sustainable Power for a Brighter Future. Delivering innovative, integrated service solutions since 2016.</p>
            <div className="flex gap-4">
              {[Linkedin, Twitter, Facebook, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-green-main hover:text-green-main transition-all">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-green-main font-bold mb-8">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              {['About', 'Divisions', 'Why Us', 'Contact'].map(link => (
                <li key={link}><a href={`#${link.toLowerCase().replace(' ', '')}`} className="hover:text-white transition-colors">{link}</a></li>
              ))}
              <li><button onClick={() => setShowAdminLogin(true)} className="hover:text-white transition-colors">Admin Panel</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-green-main font-bold mb-8">Our Services</h4>
            <ul className="space-y-4 text-sm">
              {Object.values(SERVICES).map(s => (
                <li key={s.id}><button onClick={() => setActiveModal(s.id)} className="hover:text-white transition-colors text-left">{s.title}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-green-main font-bold mb-8">Contact</h4>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <Phone size={16} className="text-green-main shrink-0" />
                <p>83800 93900</p>
              </div>
              <div className="flex gap-3">
                <Mail size={16} className="text-green-main shrink-0" />
                <p>sunriseindustry10@gmail.com</p>
              </div>
              <div className="flex gap-3">
                <MapPin size={16} className="text-green-main shrink-0" />
                <p>Pune, Maharashtra, India</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest">
          <p>© 2026 Sunrise Industry Pvt Ltd. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Service Modal */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setActiveModal(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="relative h-64 shrink-0">
                <img src={SERVICES[activeModal].img} className="w-full h-full object-cover" alt={SERVICES[activeModal].title} referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <button 
                  className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
                  onClick={() => setActiveModal(null)}
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-8 left-8">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-green-light font-bold mb-2">{SERVICES[activeModal].sub}</p>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">{SERVICES[activeModal].title}</h2>
                </div>
              </div>

              <div className="p-8 md:p-12 overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-10">
                    {SERVICES[activeModal].sections.map((s, i) => (
                      <div key={i}>
                        <h3 className="font-serif text-lg font-bold text-slate-900 mb-4 pb-2 border-b-2 border-green-pale inline-block">{s.h}</h3>
                        <ul className="space-y-3">
                          {s.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-slate-600">
                              <Check size={14} className="text-green-main mt-1 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <h3 className="font-serif text-xl font-bold text-green-dark mb-2">Quick Enquiry</h3>
                    <p className="text-xs text-slate-500 mb-6">Interested in this service? Leave your details and we'll get back to you.</p>
                    <form className="space-y-4" onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      const inq: Inquiry = {
                        id: Date.now(),
                        name: fd.get('name') as string,
                        email: fd.get('email') as string,
                        phone: fd.get('phone') as string || '—',
                        division: SERVICES[activeModal!].title,
                        message: fd.get('req') as string,
                        date: new Date().toLocaleDateString('en-IN'),
                      };
                      const updated = [inq, ...inquiries];
                      setInquiries(updated);
                      localStorage.setItem('si_inquiries', JSON.stringify(updated));
                      alert('Enquiry submitted successfully!');
                      e.currentTarget.reset();
                    }}>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Your Name</label>
                        <input type="text" name="name" required className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-green-main outline-none text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Email Address</label>
                        <input type="email" name="email" required className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-green-main outline-none text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Requirement</label>
                        <textarea name="req" required className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-green-main outline-none text-sm min-h-[80px]"></textarea>
                      </div>
                      <button type="submit" className="w-full bg-green-main text-white py-3 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-main/20">
                        Submit Enquiry
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-green-dark/90 backdrop-blur-md" onClick={() => setShowAdminLogin(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl"
            >
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Admin Login</h2>
              <p className="text-sm text-slate-500 mb-8">Sunrise Industry Management Portal</p>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Username" 
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-green-main outline-none"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-green-main outline-none"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loginAdmin()}
                />
                <button onClick={loginAdmin} className="w-full bg-green-main text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-green-main/20">
                  Login →
                </button>
                <button onClick={() => setShowAdminLogin(false)} className="w-full text-slate-400 text-xs font-bold uppercase tracking-widest mt-4">
                  Back to Website
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Dashboard */}
      <AnimatePresence>
        {isAdminLoggedIn && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-slate-50 overflow-y-auto"
          >
            <div className="sticky top-0 z-10 bg-green-dark px-8 py-4 flex items-center justify-between text-white shadow-xl">
              <div className="flex items-center gap-4">
                <LayoutDashboard size={24} />
                <h1 className="font-serif text-xl font-bold">Admin Dashboard</h1>
                <span className="text-[10px] uppercase tracking-widest opacity-50">Sunrise Industry Pvt Ltd</span>
              </div>
              <button 
                onClick={() => setIsAdminLoggedIn(false)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-xs font-bold transition-all"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>

            <div className="max-w-7xl mx-auto p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-green-main">
                  <p className="text-4xl font-serif font-bold text-green-dark">{inquiries.length}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Total Inquiries</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-blue-main">
                  <p className="text-4xl font-serif font-bold text-blue-dark">{inquiries.filter(i => i.date === new Date().toLocaleDateString('en-IN')).length}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Inquiries Today</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-slate-900">
                  <p className="text-4xl font-serif font-bold text-slate-900">6</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Active Divisions</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-xl font-serif font-bold text-slate-900">Contact Inquiries</h2>
                  <button className="text-xs text-green-main font-bold uppercase tracking-widest hover:underline">Export to CSV</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                        <th className="px-8 py-4">Name</th>
                        <th className="px-8 py-4">Contact</th>
                        <th className="px-8 py-4">Division</th>
                        <th className="px-8 py-4">Message</th>
                        <th className="px-8 py-4">Date</th>
                        <th className="px-8 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {inquiries.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-8 py-20 text-center text-slate-400 italic">No inquiries yet.</td>
                        </tr>
                      ) : (
                        inquiries.map(inq => (
                          <tr key={inq.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5 font-bold text-slate-900">{inq.name}</td>
                            <td className="px-8 py-5">
                              <p className="text-sm text-slate-600">{inq.email}</p>
                              <p className="text-xs text-slate-400">{inq.phone}</p>
                            </td>
                            <td className="px-8 py-5">
                              <span className="px-3 py-1 bg-green-pale text-green-dark text-[10px] font-bold rounded-full uppercase tracking-widest">
                                {inq.division}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-sm text-slate-600 max-w-xs truncate">{inq.message}</td>
                            <td className="px-8 py-5 text-xs text-slate-400">{inq.date}</td>
                            <td className="px-8 py-5">
                              <button 
                                onClick={() => deleteInquiry(inq.id)}
                                className="text-red-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
