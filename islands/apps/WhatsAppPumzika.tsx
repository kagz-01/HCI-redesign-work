import { useState, useRef } from "preact/hooks";

export default function WhatsAppPumzika() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pumzikaActive, setPumzikaActive] = useState(false);
  
  // Pumzika Controls
  const [dimLevel, setDimLevel] = useState(0); // 0-100
  const [blurLevel, setBlurLevel] = useState(0); // 0-10
  const [contentFilter, setContentFilter] = useState<"all" | "friends" | "text">("all");
  const [showProverb, setShowProverb] = useState(false);
  const [sessionTime, setSessionTime] = useState(5); // minutes
  
  const standardImages = ["/images/whatsapp.jpeg", "/images/whatsapp2.jpg"];
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div class="min-h-screen bg-gray-900">
      {/* Navigation Header */}
      <nav class="bg-black/50 backdrop-blur-md text-white p-4 fixed top-0 w-full z-50">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/anxiety-mode" class="text-sm font-bold">← Back to Apps</a>
          <span class="font-semibold">WhatsApp - Pumzika Mode</span>
          <div class="w-20"></div>
        </div>
      </nav>

      {/* Hero Section: Standard Interface */}
      <section id="standard" class="min-h-screen flex flex-col items-center justify-center pt-20 pb-10 px-6">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-red-400 mb-2">Standard WhatsApp Interface</h2>
          <p class="text-gray-300 text-sm">The Anxiety Triggers</p>
        </div>

        {/* Image Carousel */}
        <div class="relative w-full max-w-sm">
          <div class="relative h-[70vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-red-500/50">
            <img 
              src={standardImages[currentImageIndex]} 
              alt={`WhatsApp Standard ${currentImageIndex + 1}`}
              class="w-full h-full object-cover"
            />
            
            {/* Hotspot Annotations */}
            {currentImageIndex === 0 && (
              <>
                <div class="absolute top-[15%] right-[10%] w-8 h-8 bg-red-500/70 rounded-full animate-ping"></div>
                <div class="absolute top-[15%] right-[10%] bg-black/80 text-white text-xs p-2 rounded w-32 -translate-x-36">
                  ⚠️ Unread badges create urgency
                </div>
                
                <div class="absolute top-[30%] left-[5%] w-8 h-8 bg-red-500/70 rounded-full animate-ping"></div>
                <div class="absolute top-[30%] left-[15%] bg-black/80 text-white text-xs p-2 rounded w-32">
                  👁️ "Last Seen" causes social pressure
                </div>
              </>
            )}
          </div>

          {/* Navigation Dots */}
          <div class="flex justify-center gap-2 mt-4">
            {standardImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                class={`w-2 h-2 rounded-full transition-all ${
                  idx === currentImageIndex ? "bg-white w-6" : "bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>

        <button 
          onClick={() => scrollToSection("pumzika")}
          class="mt-8 px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition animate-bounce"
        >
          See Pumzika Solution ↓
        </button>
      </section>

      {/* Pumzika Mode Section */}
      <section id="pumzika" class="min-h-screen bg-gradient-to-b from-gray-900 to-green-900/30 py-20 px-6">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-4xl font-bold text-green-300 mb-3">Pumzika Mode Activated</h2>
            <p class="text-green-100">You're now in control. Customize your calm.</p>
          </div>

          <div class="grid lg:grid-cols-2 gap-8">
            {/* Left: Live Preview */}
            <div class="relative">
              <div class="sticky top-24">
                <div class="text-sm text-gray-400 mb-3 flex justify-between items-center">
                  <span>Live Preview</span>
                  <button 
                    onClick={() => setPumzikaActive(!pumzikaActive)}
                    class={`px-3 py-1 rounded-full text-xs ${pumzikaActive ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  >
                    {pumzikaActive ? "🌿 Active" : "Activate"}
                  </button>
                </div>
                
                <div 
                  class="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-green-500"
                  style={{ filter: pumzikaActive ? `brightness(${1 - dimLevel/150}) blur(${blurLevel}px)` : 'none' }}
                >
                  {/* Cloned WhatsApp Interface */}
                  <div class={`h-full bg-[#e5ddd5] flex flex-col transition-all duration-500 ${pumzikaActive && contentFilter === 'text' ? 'grayscale' : ''}`}>
                    {/* Header */}
                    <div class="bg-[#075e54] p-4 text-white flex justify-between items-center">
                      <span class="font-bold">WhatsApp</span>
                      <div class="flex gap-4 text-sm">
                        {!pumzikaActive && <span>🔍</span>}
                        <span>⋮</span>
                      </div>
                    </div>

                    {/* Chat List */}
                    <div class="flex-1 overflow-y-auto p-2 space-y-2">
                      {[
                        { name: "Mama", msg: "Habari yako? Umekula?", time: "2:30 PM", unread: 2 },
                        { name: "Work Group", msg: "Meeting at 3pm today", time: "1:45 PM", unread: 5 },
                        { name: "Bestie ❤️", msg: "Did you see the news?!", time: "12:20 PM", unread: 0 },
                        { name: "Landlord", msg: "Rent reminder", time: "11:05 AM", unread: 1 },
                      ].map((chat, i) => (
                        <div key={i} class="bg-white p-3 rounded-lg shadow-sm flex gap-3">
                          <div class="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                          <div class="flex-1">
                            <div class="flex justify-between items-start">
                              <span class="font-semibold text-gray-800 text-sm">{chat.name}</span>
                              {!pumzikaActive && <span class="text-xs text-green-600">{chat.time}</span>}
                            </div>
                            <p class={`text-xs text-gray-600 truncate ${contentFilter === 'text' ? '' : ''}`}>
                              {contentFilter === 'friends' && i === 1 ? '• Filtered •' : 
                               pumzikaActive ? 'Message preview hidden...' : chat.msg}
                            </p>
                          </div>
                          {!pumzikaActive && chat.unread > 0 && (
                            <div class="w-5 h-5 bg-green-500 rounded-full text-white text-xs flex items-center justify-center">
                              {chat.unread}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cultural Overlay */}
                  {showProverb && pumzikaActive && (
                    <div class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <div class="bg-white/95 p-6 rounded-2xl max-w-xs text-center shadow-2xl">
                        <span class="text-4xl mb-3 block">🌿</span>
                        <p class="font-bold text-green-800 mb-2">Haraka haraka haina baraka</p>
                        <p class="text-xs text-gray-600 italic">(Hurry hurry has no blessing)</p>
                        <p class="text-[10px] text-gray-500 mt-4">Take your time. Breathe.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Control Panel */}
            <div class="space-y-6">
              <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>🌙</span> Visual Calming
                </h3>
                
                <div class="space-y-4">
                  <div>
                    <label class="text-sm text-gray-300 block mb-2">Screen Dim: {dimLevel}%</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="70" 
                      value={dimLevel}
                      onInput={(e) => setDimLevel(parseInt(e.currentTarget.value))}
                      class="w-full"
                    />
                  </div>

                  <div>
                    <label class="text-sm text-gray-300 block mb-2">Blur Level: {blurLevel}px</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="5" 
                      value={blurLevel}
                      onInput={(e) => setBlurLevel(parseInt(e.currentTarget.value))}
                      class="w-full"
                    />
                  </div>
                </div>
              </div>

              <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>🔍</span> Content Filtering
                </h3>
                
                <div class="grid grid-cols-3 gap-2">
                  {[
                    { id: "all", label: "All", icon: "🌐" },
                    { id: "friends", label: "Friends", icon: "👥" },
                    { id: "text", label: "Text Only", icon: "📝" }
                  ].map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setContentFilter(filter.id as any)}
                      class={`p-3 rounded-lg text-sm font-medium transition ${
                        contentFilter === filter.id 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <div class="text-xl mb-1">{filter.icon}</div>
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>⏱️</span> Mindful Engagement
                </h3>
                
                <div class="space-y-4">
                  <div>
                    <label class="text-sm text-gray-300 block mb-2">Session Duration</label>
                    <div class="grid grid-cols-3 gap-2">
                      {[5, 15, 30].map(time => (
                        <button
                          key={time}
                          onClick={() => setSessionTime(time)}
                          class={`py-2 rounded-lg text-sm font-medium ${
                            sessionTime === time 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {time}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <div class="bg-gray-700/50 p-3 rounded-lg">
                    <div class="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Time remaining</span>
                      <span>{sessionTime}:00</span>
                    </div>
                    <div class="w-full bg-gray-600 h-1 rounded-full overflow-hidden">
                      <div class="bg-green-500 h-full w-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>🇰🇪</span> Cultural Grounding
                </h3>
                
                <button
                  onClick={() => setShowProverb(!showProverb)}
                  class={`w-full py-3 rounded-lg font-medium transition ${
                    showProverb 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {showProverb ? '🌿 Proverb Active' : 'Show Kenyan Proverb'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
