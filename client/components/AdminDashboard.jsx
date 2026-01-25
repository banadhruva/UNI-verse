import React, { useState, useEffect } from 'react';
import { Parser } from "@json2csv/plainjs";
import API from '../api';

const AdminDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [adminEvents, setAdminEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Unified Form State
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    venue: '',
    date: '',
    dept: 'CSE',
    competitionInput: "",
    competitionList: [],
    fieldInput: "",
    requiredFields: [],
    banner: null,
    gallery: []
  });

  // --- LIFECYCLE ---
  useEffect(() => {
    fetchAdminEvents();
  }, []);

  // --- API ACTIONS ---
  const fetchAdminEvents = async () => {
    try {
      const res = await API.get('/events');
      setAdminEvents(res.data);
    } catch (err) {
      console.error("Fetch Events Error:", err);
    }
  };

  const fetchParticipants = async (id) => {
    setLoading(true);
    try {
      const res = await API.get(`/admin/applications/${id}`);
      setParticipants(res.data);
      setSelectedEventId(id);
    } catch (err) {
      alert("Error fetching participants");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id, e) => {
    e.stopPropagation(); // Prevent selecting the event while trying to delete it
    if (window.confirm("Are you sure? This will delete the event, all registrations, and AI knowledge.")) {
      try {
        await API.delete(`/admin/events/${id}`);
        setAdminEvents(adminEvents.filter(ev => ev.id !== id));
        if (selectedEventId === id) setSelectedEventId(null);
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  // --- FORM HELPERS ---
  const addItem = (type) => {
    if (type === 'comp' && formData.competitionInput.trim()) {
      setFormData({
        ...formData,
        competitionList: [...formData.competitionList, formData.competitionInput.trim()],
        competitionInput: ""
      });
    } else if (type === 'field' && formData.fieldInput.trim()) {
      setFormData({
        ...formData,
        requiredFields: [...formData.requiredFields, formData.fieldInput.trim()],
        fieldInput: ""
      });
    }
  };

  const removeItem = (type, index) => {
    if (type === 'comp') {
      setFormData({ ...formData, competitionList: formData.competitionList.filter((_, i) => i !== index) });
    } else {
      setFormData({ ...formData, requiredFields: formData.requiredFields.filter((_, i) => i !== index) });
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (formData.competitionList.length === 0) return alert("Add at least one competition category.");
    
    setIsSubmitting(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.desc);
    data.append('venue', formData.venue);
    data.append('event_date', formData.date);
    data.append('department', formData.dept);
    data.append('competition_list', JSON.stringify(formData.competitionList));
    data.append('custom_fields', JSON.stringify(formData.requiredFields));
    
    if (formData.banner) data.append('banner', formData.banner);
    formData.gallery.forEach(file => data.append('gallery', file));

    try {
      await API.post('/admin/events', data);
      setShowCreateModal(false);
      setFormData({ title: '', desc: '', venue: '', date: '', dept: 'CSE', competitionInput: "", competitionList: [], fieldInput: "", requiredFields: [], banner: null, gallery: [] });
      fetchAdminEvents();
      alert("Event Published & AI Knowledge base updated!");
    } catch (err) {
      alert("Error publishing event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadCSV = () => {
    if (participants.length === 0) return alert("No data to export.");
    try {
      const flattened = participants.map(p => ({
        Name: p.full_name, Roll: p.roll_number, Email: p.email, Category: p.competition_name, ...p.additional_info 
      }));
      const parser = new Parser();
      const csv = parser.parse(flattened);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Event_${selectedEventId}_Data.csv`;
      link.click();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-100 flex flex-col font-sans">
      
      {/* 1. TOP NAV */}
      <header className="h-20 flex-none px-8 flex justify-between items-center bg-[#0f172a] border-b border-slate-800 shadow-xl z-20">
        <div>
          <h1 className="text-xl font-black italic tracking-tighter">IKGPTU <span className="text-indigo-500 underline">ADMIN</span></h1>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          + Create Event
        </button>
      </header>

      {/* 2. MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR: EVENT LIST */}
        <aside className="w-72 bg-[#020617] border-r border-slate-800 p-6 overflow-y-auto">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Live Deployments</p>
          <div className="space-y-2">
            {adminEvents.map(ev => (
              <div 
                key={ev.id} 
                onClick={() => fetchParticipants(ev.id)}
                className={`group relative p-4 rounded-2xl border cursor-pointer transition-all ${selectedEventId === ev.id ? 'bg-indigo-600/10 border-indigo-500' : 'bg-slate-900/40 border-slate-800 hover:border-slate-600'}`}
              >
                <p className="text-[8px] font-bold text-indigo-400 uppercase">{ev.department}</p>
                <p className="text-sm font-bold truncate pr-6">{ev.title}</p>
                <button 
                  onClick={(e) => handleDeleteEvent(ev.id, e)}
                  className="absolute top-4 right-3 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 transition-opacity"
                >
                  <span className="text-xs">🗑️</span>
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN VIEW: PARTICIPANTS TABLE */}
        <main className="flex-1 bg-[#050a18] p-8 overflow-y-auto">
          {selectedEventId ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-black text-white mb-1">Participants</h2>
                  <p className="text-slate-500 text-sm font-medium">Viewing registrations for Event ID: {selectedEventId}</p>
                </div>
                <button onClick={downloadCSV} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-5 py-2.5 rounded-xl text-xs font-black hover:bg-emerald-500 hover:text-white transition-all uppercase tracking-widest">
                  Export CSV
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center py-20 gap-4">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-bold text-xs animate-pulse">SYNCING DATABASE...</p>
                </div>
              ) : (
                <div className="bg-[#0f172a] rounded-[2rem] border border-slate-800 overflow-hidden shadow-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                        <th className="px-8 py-5">Student Details</th>
                        <th className="px-8 py-5">Event Category</th>
                        <th className="px-8 py-5">Custom Fields</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {participants.map((p, i) => (
                        <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                          <td className="px-8 py-6">
                            <p className="font-bold text-slate-100 text-base">{p.full_name}</p>
                            <p className="text-xs text-slate-500">{p.roll_number} • {p.email}</p>
                          </td>
                          <td className="px-8 py-6">
                            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-lg text-[10px] font-black">
                              {p.competition_name}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            {p.additional_info && Object.entries(p.additional_info).map(([k,v]) => (
                              <div key={k} className="text-[11px] mb-1"><span className="text-slate-600 font-bold uppercase">{k}:</span> <span className="text-slate-300">{v}</span></div>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
              <p className="text-4xl mb-4">📥</p>
              <p className="text-sm font-black uppercase tracking-widest">Select an event to view data</p>
            </div>
          )}
        </main>
      </div>

      {/* 3. CREATE EVENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-[#0f172a] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[3rem] border border-slate-800 p-10 shadow-2xl custom-scrollbar">
            <h2 className="text-2xl font-black text-white mb-8">NEW EVENT DEPLOYMENT</h2>
            
            <form onSubmit={handleCreateEvent} className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Event Title</label>
                <input required className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Venue</label>
                <input required className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Date & Time</label>
                <input type="datetime-local" required className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-400 outline-none focus:border-indigo-500" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Rules & Description (AI Context)</label>
                <textarea required className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white h-32 outline-none focus:border-indigo-500" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} />
              </div>

              {/* DYNAMIC LISTS */}
              <div className="col-span-2 grid grid-cols-2 gap-6 bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800/50">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Categories</p>
                  <div className="flex gap-2">
                    <input className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white" value={formData.competitionInput} onChange={e => setFormData({...formData, competitionInput: e.target.value})} placeholder="e.g. Solo Dance" />
                    <button type="button" onClick={() => addItem('comp')} className="bg-indigo-600 px-4 rounded-xl text-xs font-bold">+</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.competitionList.map((c, i) => (
                      <span key={i} className="bg-slate-800 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-2">
                        {c} <button type="button" onClick={() => removeItem('comp', i)} className="text-red-500 font-black">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Custom Form Fields</p>
                  <div className="flex gap-2">
                    <input className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white" value={formData.fieldInput} onChange={e => setFormData({...formData, fieldInput: e.target.value})} placeholder="e.g. GitHub URL" />
                    <button type="button" onClick={() => addItem('field')} className="bg-indigo-600 px-4 rounded-xl text-xs font-bold">+</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.requiredFields.map((f, i) => (
                      <span key={i} className="bg-slate-800 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-2">
                        {f} <button type="button" onClick={() => removeItem('field', i)} className="text-red-500 font-black">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ASSETS */}
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase ml-2">Banner</p>
                <input type="file" className="w-full text-xs text-slate-500 file:bg-slate-800 file:border-none file:text-white file:px-4 file:py-2 file:rounded-xl cursor-pointer" onChange={e => setFormData({...formData, banner: e.target.files[0]})} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase ml-2">Gallery (Multiple)</p>
                <input type="file" multiple className="w-full text-xs text-slate-500 file:bg-slate-800 file:border-none file:text-white file:px-4 file:py-2 file:rounded-xl cursor-pointer" onChange={e => setFormData({...formData, gallery: Array.from(e.target.files)})} />
              </div>

              <div className="col-span-2 flex gap-4 mt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 text-slate-500 font-bold uppercase tracking-widest text-xs">Discard</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl disabled:opacity-50"
                >
                  {isSubmitting ? "Processing AI Knowledge..." : "Confirm & Deploy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;