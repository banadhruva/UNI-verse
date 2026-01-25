const EventGrid = () => {
  // In a real app, fetch these from your Supabase/Postgres backend
  const dummyEvents = [
    { id: 1, title: 'Code-A-Thon 2026', venue: 'Block C Hall', date: 'Jan 30', type: 'Technical' },
    { id: 2, title: 'Cultural Night', venue: 'Open Theater', date: 'Feb 05', type: 'Cultural' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {dummyEvents.map(event => (
        <div key={event.id} className="bg-white rounded-3xl p-2 border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300 group">
          <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 relative overflow-hidden">
             <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold uppercase">
               {event.type}
             </div>
          </div>
          <div className="p-4">
            <h3 className="text-2xl font-bold mb-1 group-hover:text-indigo-600 transition">{event.title}</h3>
            <p className="text-slate-400 font-medium flex items-center gap-2">
              📍 {event.venue} | 📅 {event.date}
            </p>
            <button className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-colors">
              Apply for Roles
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};