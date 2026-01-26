import React, { useEffect, useState, useRef } from 'react';
import API from './api';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeDept, setActiveDept] = useState('All');
  const [view, setView] = useState('student');
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [scrollAmount, setScrollAmount] = useState(0);
  const chatEndRef = useRef(null);

  const [participantData, setParticipantData] = useState({
    name: '', rollNo: '', email: '', competition: '', extra: {} 
  });

  const achievers = [
    { name: "Aditya Azad", event: "Advance Mountaineering Camp", dept: "ECE", year: "2025", rank: "Pro", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769339134/WhatsApp_Image_2023-08-18_at_13.01.34_gkeprd.jpg" },
    { name: "Aanvi Tyagi", event: "Inter-College Debate", dept: "MBA", year: "2025", rank: "Gold", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769451011/IMG_20251031_085348_q2zbkb.jpg" },
    { name: "Anni Singh", event: "Robo-Wars", dept: "ECE", year: "2024", rank: "Winner", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769451047/IMG_20251030_130005_okkv7u.jpg" },
    { name: "Dev D", event: "MUN", dept: "ECE", year: "2024", rank: "Winner", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769451277/images_8_vvr6xm.jpg" },
  ];

  const departments = ['All', 'CSE', 'NCC', 'NSS', 'MBA', 'ECE'];

  const coordinatorData = {
    CSE: {
      hod: { name: "Dr. Arvind K. Sharma", role: "HOD CSE", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769321502/download_xzvz5y.jpg" },
      staff: [
        { name: "Anubhav Jha", role: "Tech Lead", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769321503/WhatsApp_Image_2026-01-25_at_11.40.20_w5nhaf.jpg" },
        { name: "Gautam Sharma", role: "Dept Coordinator", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769322371/119092331_lk895m.jpg" },
      ]
    },
    NCC: {
      hod: { name: "Col SP Singh", role: "Commanding Officer", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769321502/images1_pydzjx.jpg" },
      staff: [
        { name: "UO Dhruv Bana", role: "Training Lead SD", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769321503/WhatsApp_Image_2026-01-25_at_11.38.26_mj8mqw.jpg" },
        { name: "UO Japuji Kaur", role: "Training Lead SW", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769321503/WhatsApp_Image_2026-01-25_at_11.38.26.1_diulej.jpg" },
      ]
    },
    ECE: {
      hod: { name: "Dr. Neil Dwivedi", role: "HOD ECE", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769321502/download_1_vwglnm.jpg" },
      staff: [
        { name: "Naman Dubey", role: "Tech Lead", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769322371/167155044_q4zxql.jpg" },
        { name: "Pawan Choudhary", role: "Dept Coordinator", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769322371/144591052_itkbsg.jpg" },
      ]},
    NSS: {
      hod: { name: "Dr. Chander Prakash", role: "HOD NSS", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769323290/WhatsApp_Image_2026-01-25_at_11.40.20.1_ayvyta.jpg" },
      staff: [
        { name: "Vansh Sharma", role: "Dept Coordinator", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769321504/WhatsApp_Image_2026-01-25_at_11.39.57_rqfyx7.jpg" },
        { name: "Ujjwal Bhardwaj", role:"Dept Coordinator", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769322371/175827510_ili5fm.jpg" },
      ]},
    MBA: {
      hod: { name: "Dr. Gina Kapoor", role: "HOD MBA", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769323857/85424089_z0ozkq.jpg" },
      staff: [
        { name: "Jasmeet Singh", role: "Dept Coordinator", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769323857/69009963_ge8uif.jpg" },
        { name: "Raunak Oberoi", role:"Dept Coordinator", img: "https://res.cloudinary.com/daookjsaa/image/upload/v1769323857/8507811_hg3psk.jpg" },
      ]}
  };

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([{ role: 'bot', text: 'Welcome to IKGPTU Support. Ask me about event rules!' }]);
  const [isTyping, setIsTyping] = useState(false);

  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });
  
  useEffect(() => {
    const target = new Date("2026-03-10T00:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      if (distance < 0) return clearInterval(interval);
      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'),
        s: Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0'),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await API.get('/events');
      setEvents(response.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchEvents();
    const handleScroll = () => setScrollAmount(Math.min(window.scrollY / 40, 15));
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const toggleView = () => {
    if (view === 'student') {
      const password = prompt("Access Key:");
      if (password === "IKGPTU_ADMIN") setView('admin');
    } else setView('student');
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await API.post('/applications', {
        full_name: participantData.name, 
        roll_number: participantData.rollNo,
        email: participantData.email, 
        event_id: selectedEvent.id,
        competition_name: participantData.competition,
        additional_info: participantData.extra
      });
      alert("Registration Successful!"); 
      setSelectedEvent(null);
      setParticipantData({ name: '', rollNo: '', email: '', competition: '', extra: {} });
    } catch (err) { alert(err.response?.data?.error || "Registration failed!"); }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;
    const q = chatQuery;
    setChatHistory(prev => [...prev, { role: 'user', text: q }]);
    setChatQuery(""); setIsTyping(true);
    try {
      const res = await API.post('/chat', { question: q });
      setChatHistory(prev => [...prev, { role: 'bot', text: res.data.answer }]);
    } catch (err) { setChatHistory(prev => [...prev, { role: 'bot', text: "Service offline." }]); } finally { setIsTyping(false); }
  };

  const filteredEvents = activeDept === 'All' ? events : events.filter(e => e.department === activeDept);

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-100 relative selection:bg-indigo-500 selection:text-white font-sans">
      
      {/* BACKGROUND LAYER */}
      {view === 'student' && (
        <div className="fixed inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-indigo-900/10 blur-[120px] rounded-full scale-150 -top-1/2 left-0"></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08759dfc3f3?q=80&w=2070&auto=format&fit=crop')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            filter: `blur(${scrollAmount}px)`,
          }} />
        </div>
      )}

      <div className="relative z-10">
        <nav className="w-full bg-[#020617]/40 backdrop-blur-2xl sticky top-0 z-[100] p-4 border-b border-white/5 flex justify-between px-6 md:px-12 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
             <div className="w-8 h-8 bg-indigo-600 rounded-lg rotate-12 flex items-center justify-center font-black">I</div>
             <h1 className="text-xl font-black italic tracking-tighter">IKGPTU<span className="text-indigo-500 font-bold">CONNECT</span></h1>
          </div>
          <button onClick={toggleView} className="text-[10px] font-black uppercase tracking-widest bg-indigo-600/10 text-indigo-400 px-6 py-2.5 rounded-xl border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all duration-300">
            {view === 'student' ? 'Coordinator Access' : 'Exit Admin View'}
          </button>
        </nav>

        {view === 'student' ? (
          <div className="w-full">
            {/* HERO SECTION */}
            <header className="w-full pt-20 pb-12 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                  <span className="text-indigo-400 font-black text-[9px] uppercase tracking-[0.2em]">Official Events Portal</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9] mb-10 uppercase">
                  Level up<br/><span className="text-indigo-600">Together.</span>
                </h1>
                
                {/* BALANCED DEPT BUTTONS */}
                <div className="flex flex-wrap gap-3 p-2 bg-white/5 backdrop-blur-md rounded-[20px] border border-white/10 w-fit">
                  {departments.map(dept => (
                    <button 
                      key={dept} 
                      onClick={() => setActiveDept(dept)} 
                      className={`px-7 py-3 rounded-[16px] text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                        activeDept === dept 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end relative">
                {activeDept === 'All' ? (
                  <div className="relative group w-full max-w-md">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[42px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-[#020617]/90 backdrop-blur-xl rounded-[40px] p-8 border border-white/10 shadow-2xl">
                       <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 text-center">Grand Finale Countdown</p>
                       <h4 className="text-2xl font-black text-white text-center mb-8 italic uppercase tracking-tight">Youth Festival '26</h4>
                       <div className="flex justify-between items-center px-4">
                          {[ {v: timeLeft.d, l: 'Days'}, {v: timeLeft.h, l: 'Hrs'}, {v: timeLeft.m, l: 'Min'}, {v: timeLeft.s, l: 'Sec', c: 'text-indigo-500'}].map((t, i) => (
                            <React.Fragment key={i}>
                              <div className="text-center">
                                <p className={`text-4xl font-black tabular-nums ${t.c || 'text-white'}`}>{t.v}</p>
                                <p className="text-[9px] font-bold text-slate-500 uppercase mt-1 tracking-widest">{t.l}</p>
                              </div>
                              {i < 3 && <div className="text-white/10 font-black text-xl mb-6">:</div>}
                            </React.Fragment>
                          ))}
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[40px] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-500 hover:border-indigo-500/30 transition-all">
                    {/* BALANCED HOD IMAGE */}
                    <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-6">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-indigo-600 rounded-[32px] blur opacity-20"></div>
                        <img 
                          src={coordinatorData[activeDept].hod.img} 
                          className="relative w-32 h-32 rounded-[28px] object-cover border border-indigo-600/50 shadow-xl" 
                          alt="HOD"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Head of Department</p>
                        <h3 className="text-2xl font-black text-white italic leading-tight uppercase tracking-tighter">
                          {coordinatorData[activeDept].hod.name}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{coordinatorData[activeDept].hod.role}</p>
                      </div>
                    </div>
                    {/* BALANCED STAFF IMAGES */}
                    <div className="grid grid-cols-2 gap-4">
                      {coordinatorData[activeDept].staff.map((s, idx) => (
                        <div key={idx} className="bg-white/5 p-4 rounded-[24px] border border-white/5 flex flex-col items-center text-center group hover:bg-white/10 transition-all">
                          <img 
                            src={s.img} 
                            className="w-20 h-20 rounded-[20px] object-cover mb-3 group-hover:scale-105 transition-transform" 
                            alt="Staff"
                          />
                          <p className="text-[11px] font-black text-white uppercase truncate w-full tracking-tight">{s.name}</p>
                          <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">{s.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </header>

            {/* MARQUEE NEWS */}
            <div className="w-full px-6 md:px-12 mb-20">
               <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-[28px] p-5 flex items-center gap-8 overflow-hidden backdrop-blur-sm">
                  <div className="shrink-0 flex items-center gap-3 px-5 py-2.5 bg-indigo-600 rounded-2xl">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Updates</span>
                  </div>
                  <div className="flex-1 whitespace-nowrap overflow-hidden">
                    <div className="inline-block animate-marquee text-xs font-bold text-slate-400 uppercase tracking-wider">
                      🚀 <span className="text-white">CSE:</span> AI Workshop results are now available at the admin office • 🏆 <span className="text-white">NSS:</span> Blood donation camp starts Monday 9:00 AM • ⚡ <span className="text-white">MBA:</span> Industrial visit registrations closing tonight • 📸 <span className="text-white">Archive:</span> 20+ new images added to gallery...
                    </div>
                  </div>
               </div>
            </div>

            {/* LIVE OPPORTUNITIES */}
            <main className="w-full px-6 md:px-12 pb-32">
              <div className="mb-12 flex items-center gap-6">
                <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">Live <span className="text-indigo-500">Events</span></h2>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="bg-white/[0.03] rounded-[40px] border border-white/5 overflow-hidden group hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-2 shadow-2xl relative">
                    <div className="h-56 relative overflow-hidden">
                      <img src={event.banner_url || "https://images.unsplash.com/photo-1540575861501-7ce011ca368e?q=80&w=2070&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" alt="Event Banner"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
                      <div className="absolute top-5 left-5">
                        <span className="bg-indigo-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                          {event.department}
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-black mb-6 text-white leading-tight uppercase italic tracking-tighter line-clamp-2">{event.title}</h3>
                      <button onClick={() => setSelectedEvent(event)} className="w-full py-4 bg-white/5 group-hover:bg-indigo-600 text-white rounded-[20px] font-black uppercase text-[10px] tracking-[0.2em] transition-all duration-300 border border-white/10 active:scale-95">Begin Enrolment</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* WALL OF FAME */}
              <div className="mb-32">
                <div className="text-center mb-16">
                  <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.6em] mb-4 block">Our Stars</span>
                  <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter">
                    Hall Of <span className="text-indigo-500 underline decoration-indigo-500/30 underline-offset-8">Fame</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {achievers.map((achiever, i) => (
                    <div key={i} className="group bg-white/[0.02] hover:bg-indigo-600/[0.03] p-8 rounded-[40px] border border-white/5 text-center transition-all duration-500 hover:border-indigo-500/40">
                      <div className="relative mx-auto mb-6 w-32 h-32">
                        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                        <img 
                          src={achiever.img} 
                          className="w-32 h-32 rounded-full mx-auto relative z-10 border-2 border-white/10 group-hover:border-indigo-500 object-cover transition-all duration-500 shadow-2xl shadow-black" 
                          alt="Winner" 
                        />
                      </div>
                      <h4 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{achiever.name}</h4>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{achiever.dept} • {achiever.year}</p>
                      <div className="bg-white/5 py-3 px-4 rounded-2xl border border-white/5 group-hover:bg-indigo-600/10 group-hover:border-indigo-500/20 transition-all">
                        <p className="text-[10px] font-bold text-slate-300 italic group-hover:text-white uppercase tracking-tight">
                          {achiever.rank && `${achiever.rank} - `}{achiever.event}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LEGACY VAULT */}
              <div className="mb-10 flex items-center gap-6">
                <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">Legacy <span className="text-indigo-500">Vault</span></h2>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
              <div className="columns-2 md:columns-4 lg:columns-5 gap-5 space-y-5">
                {events.filter(e => e.gallery_urls?.length > 0).map((event) => (
                  <div key={event.id} onClick={() => setSelectedGallery({title: event.title, images: event.gallery_urls})} className="relative break-inside-avoid rounded-[32px] overflow-hidden cursor-pointer group border border-white/10 hover:border-indigo-500 transition-all duration-500 shadow-xl">
                    <img src={event.gallery_urls[0]} className="w-full object-cover brightness-[0.6] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" alt="Gallery Cover"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end">
                      <p className="text-[9px] font-black text-indigo-400 uppercase mb-1 tracking-widest">{event.gallery_urls.length} Memories</p>
                      <h4 className="text-xs font-black text-white uppercase leading-tight tracking-tight">{event.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        ) : (
          <div className="p-6 md:p-12 animate-in fade-in duration-700">
            <AdminDashboard />
          </div>
        )}

        {/* CHATBOT */}
        <div className="fixed bottom-8 right-8 z-[200] flex flex-col items-end gap-4">
           {isChatOpen && (
             <div className="bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 rounded-[36px] w-[90vw] md:w-96 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
                <div className="p-6 bg-indigo-600 text-white flex justify-between items-center shadow-lg">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                     <span className="font-black italic text-sm tracking-widest uppercase">AI Assistant</span>
                   </div>
                   <button onClick={() => setIsChatOpen(false)} className="hover:rotate-90 transition-transform">✕</button>
                </div>
                
                <div className="p-5 border-b border-white/5 bg-white/5 space-y-2">
                   <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3 px-1">Common Queries</p>
                   <div className="flex flex-wrap gap-2">
                     {["Registration Link?", "Who is the HOD?", "Event Date"].map((faq, idx) => (
                       <button key={idx} onClick={() => setChatQuery(faq)} className="px-3 py-2 rounded-xl bg-black/40 text-[10px] font-bold text-slate-300 hover:bg-indigo-600 hover:text-white transition-all border border-white/5">
                          {faq}
                       </button>
                     ))}
                   </div>
                </div>

                <div className="h-80 overflow-y-auto p-6 space-y-4 text-xs custom-scrollbar bg-black/20">
                   {chatHistory.map((c, i) => (
                    <div key={i} className={`flex ${c.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-[24px] ${c.role === 'user' ? 'bg-indigo-600 text-white font-medium shadow-lg' : 'bg-white/5 text-slate-300 border border-white/5 shadow-inner'}`}>
                        {c.text}
                      </div>
                    </div>
                   ))}
                   {isTyping && (
                     <div className="flex gap-1.5 p-2">
                       <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                       <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                       <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                     </div>
                   )}
                   <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleChatSubmit} className="p-5 bg-white/5 border-t border-white/5">
                   <input 
                    value={chatQuery} 
                    onChange={(e) => setChatQuery(e.target.value)} 
                    placeholder="Ask me anything..." 
                    className="w-full bg-black/40 border border-white/10 p-4 rounded-[20px] outline-none text-white text-xs focus:border-indigo-500 transition-all placeholder:text-slate-600 shadow-inner" 
                   />
                </form>
             </div>
           )}
           <button 
            onClick={() => setIsChatOpen(!isChatOpen)} 
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-2xl transition-all duration-500 active:scale-95 ${isChatOpen ? 'bg-white text-indigo-600 rotate-0' : 'bg-indigo-600 text-white shadow-indigo-600/40'}`}
           >
            {isChatOpen ? '✕' : '💬'}
           </button>
        </div>

        {/* GALLERY MODAL */}
        {selectedGallery && (
          <div className="fixed inset-0 bg-[#020617]/98 backdrop-blur-3xl z-[300] flex flex-col p-6 md:p-12 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
              <div>
                <p className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.5em] mb-2">Memory Lane</p>
                <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">{selectedGallery.title}</h2>
              </div>
              <button onClick={() => setSelectedGallery(null)} className="w-16 h-16 bg-white/5 hover:bg-red-500/20 text-white rounded-full text-2xl transition-all active:scale-90 flex items-center justify-center">✕</button>
            </div>
            <div className="columns-1 sm:columns-2 md:columns-4 lg:columns-5 gap-6 overflow-y-auto custom-scrollbar pr-4">
              {selectedGallery.images.map((img, i) => (
                <div key={i} className="mb-6 rounded-[32px] overflow-hidden border border-white/5 shadow-2xl hover:scale-[1.02] transition-transform duration-500">
                  <img src={img} className="w-full h-auto object-cover" alt="Event Shot" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SPLIT-SCREEN ENROLMENT MODAL */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 z-[250] animate-in fade-in duration-300">
            <div className="bg-[#0f172a] rounded-[48px] w-full max-w-7xl h-full md:h-[85vh] border border-white/10 shadow-[0_0_100px_rgba(79,70,229,0.1)] flex flex-col md:flex-row overflow-hidden">
              
              {/* LEFT SIDE: BRIEFING */}
              <div className="w-full md:w-5/12 h-full bg-white/5 p-10 md:p-16 overflow-y-auto custom-scrollbar border-r border-white/5">
                <button onClick={() => setSelectedEvent(null)} className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-12 flex items-center gap-3 hover:-translate-x-2 transition-transform">
                  <span className="text-lg">←</span> Back to Event Universe
                </button>
                <img src={selectedEvent.banner_url} className="w-full h-56 object-cover rounded-[36px] mb-12 border border-white/10 shadow-2xl" alt="Banner" />
                <h2 className="text-6xl font-black text-white italic tracking-tighter leading-[0.9] mb-6 uppercase">{selectedEvent.title}</h2>
                <div className="flex flex-wrap gap-3 mb-12">
                  <span className="bg-indigo-600 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">{selectedEvent.department}</span>
                  <span className="bg-white/10 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 border border-white/10">{selectedEvent.venue}</span>
                </div>
                
                <div className="space-y-10">
                  <div>
                    <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Briefing</h4>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">{selectedEvent.description}</p>
                  </div>
                  <div className="p-6 bg-indigo-600/10 rounded-[30px] border border-indigo-500/20">
                    <h4 className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Schedule</h4>
                    <p className="text-white text-2xl font-black italic uppercase tracking-tighter">
                      {new Date(selectedEvent.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  {selectedEvent.competition_list?.length > 0 && (
                    <div>
                      <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-5">Categories</h4>
                      <div className="flex flex-wrap gap-2.5">
                        {selectedEvent.competition_list.map((c, i) => (
                          <span key={i} className="px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-[10px] font-bold text-slate-300 uppercase tracking-tight"># {c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE: FORM */}
              <div className="w-full md:w-7/12 h-full p-10 md:p-20 flex flex-col justify-center bg-black/40 backdrop-blur-3xl overflow-y-auto">
                <div className="max-w-md mx-auto w-full">
                  <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Registration</h3>
                  <p className="text-slate-500 text-[10px] font-black mb-12 uppercase tracking-[0.3em]">Identity Verification & Enrolment</p>
                  
                  <form onSubmit={handleApply} className="space-y-5">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-indigo-400 uppercase ml-2">Legal Name</label>
                       <input required placeholder="Enter full name" value={participantData.name} onChange={e => setParticipantData({...participantData, name: e.target.value})} className="w-full p-5 bg-white/5 border border-white/10 rounded-[22px] outline-none text-white text-sm focus:border-indigo-500 transition-all shadow-inner placeholder:text-slate-700" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-indigo-400 uppercase ml-2">Roll No</label>
                        <input required placeholder="e.g. 2100XXX" value={participantData.rollNo} onChange={e => setParticipantData({...participantData, rollNo: e.target.value})} className="w-full p-5 bg-white/5 border border-white/10 rounded-[22px] outline-none text-white text-sm focus:border-indigo-500 transition-all shadow-inner placeholder:text-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-indigo-400 uppercase ml-2">Email</label>
                        <input required type="email" placeholder="University ID" value={participantData.email} onChange={e => setParticipantData({...participantData, email: e.target.value})} className="w-full p-5 bg-white/5 border border-white/10 rounded-[22px] outline-none text-white text-sm focus:border-indigo-500 transition-all shadow-inner placeholder:text-slate-700" />
                      </div>
                    </div>

                    {selectedEvent.competition_list?.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-indigo-400 uppercase ml-2">Competition Choice</label>
                        <div className="relative">
                          <select 
                            required 
                            className="w-full p-5 bg-white/5 border border-white/10 rounded-[22px] outline-none text-indigo-400 font-black uppercase text-xs appearance-none focus:border-indigo-500 cursor-pointer shadow-inner"
                            value={participantData.competition} 
                            onChange={e => setParticipantData({...participantData, competition: e.target.value})}
                          >
                            <option value="" className="bg-slate-900">Choose Competition</option>
                            {selectedEvent.competition_list.map((c, i) => (
                              <option key={i} value={c} className="bg-slate-900">{c}</option>
                            ))}
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-500">▼</div>
                        </div>
                      </div>
                    )}

                    {selectedEvent.custom_fields?.map((field, idx) => (
                      <div key={idx} className="space-y-2">
                        <label className="text-[9px] font-black text-indigo-400 uppercase ml-2">{field}</label>
                        <input 
                          required 
                          placeholder={`Enter ${field}`}
                          className="w-full p-5 bg-white/5 border-l-4 border-indigo-600 rounded-[22px] outline-none text-white text-sm focus:border-indigo-400 transition-all shadow-inner placeholder:text-slate-700"
                          onChange={e => setParticipantData({
                            ...participantData, 
                            extra: { ...participantData.extra, [field]: e.target.value }
                          })}
                        />
                      </div>
                    ))}

                    <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-[26px] font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 transition-all mt-8">Secure Your Spot</button>
                    <p className="text-center text-[8px] font-bold text-slate-600 uppercase mt-8 tracking-[0.2em] leading-relaxed">Identity confirmation required. False data will result in disqualification.</p>
                  </form>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;400;700;800&display=swap');
        
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: inline-block; animation: marquee 40s linear infinite; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(79, 70, 229, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(79, 70, 229, 0.5); }
        
        .break-inside-avoid { break-inside: avoid; }
        
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px #0f172a inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default App;
