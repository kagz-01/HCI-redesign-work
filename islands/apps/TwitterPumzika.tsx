import { useState } from "preact/hooks";

export default function TwitterPumzika() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pumzikaActive, setPumzikaActive] = useState(false);
  
  // Pumzika Controls
  const [dimLevel, setDimLevel] = useState(0);
  const [blurLevel, setBlurLevel] = useState(0);
  const [hideTrends, setHideTrends] = useState(false);
  const [hideMetrics, setHideMetrics] = useState(false);
  const [contentFilter, setContentFilter] = useState<"all" | "following" | "peaceful">("all");
  const [scrollReminder, setScrollReminder] = useState(false);
  
  const standardImages = ["/images/twitter-x.jpg", "/images/twitter-x2.jpg"];
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div class="min-h-screen bg-gray-900">
      <nav class="bg-black/50 backdrop-blur-md text-white p-4 fixed top-0 w-full z-50">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/anxiety-mode" class="text-sm font-bold">← Back to Apps</a>
          <span class="font-semibold">X/Twitter - Pumzika Mode</span>
          <div class="w-20"></div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="standard" class="min-h-screen flex flex-col items-center justify-center pt-20 pb-10 px-6">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-red-400 mb-2">Standard X Interface</h2>
          <p class="text-gray-300 text-sm">Political Polarization & Rage Farming</p>
        </div>

        <div class="relative w-full max-w-sm">
          <div class="relative h-[70vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-red-500/50">
            <img 
              src={standardImages[currentImageIndex]} 
              alt={`Twitter Standard ${currentImageIndex + 1}`}
              class="w-full h-full object-cover"
            />
            
            {currentImageIndex === 0 && (
              <>
                <div class="absolute top-[10%] right-[20%] w-8 h-8 bg-red-500/70 rounded-full animate-ping"></div>
                <div class="absolute top-[10%] right-[30%] bg-black/90 text-white text-xs p-2 rounded w-36 -translate-x-full">
                  🔥 Trending topics create outrage
                </div>
                
                <div class="absolute top-[40%] left-[10%] w-8 h-8 bg-red-500/70 rounded-full animate-ping"></div>
                <div class="absolute top-[40%] left-[20%] bg-black/90 text-white text-xs p-2 rounded w-32">
                  💬 Endless arguments
                </div>
              </>
            )}
          </div>

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
            <p class="text-green-100">Escape the rage. Find your timeline peace.</p>
          </div>

          <div class="grid lg:grid-cols-2 gap-8">
            {/* Live Preview */}
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
                  {/* Cloned Twitter/X Interface */}
                  <div class="h-full bg-black text-white flex flex-col">
                    {/* Header */}
                    <div class="p-4 border-b border-gray-800 flex justify-between items-center">
                      <div class="w-8 h-8 rounded-full bg-gray-600"></div>
                      <span class="font-bold text-xl">𝕏</span>
                      <span>✨</span>
                    </div>

                    {/* Trends (conditionally hidden) */}
                    {!hideTrends && !pumzikaActive && (
                      <div class="border-b border-gray-800 p-3">
                        <p class="text-xs text-gray-400 mb-2">Trending in Kenya</p>
                        <p class="text-sm font-bold">#ElectionDrama</p>
                        <p class="text-xs text-gray-500">54.2K posts</p>
                      </div>
                    )}

                    {/* Feed */}
                    <div class="flex-1 overflow-y-auto">
                      {[
                        { user: "Political Voice", handle: "@politico", tweet: "This government is absolutely failing us! When will change come?! 😡", type: "political" },
                        { user: "Friend", handle: "@bestie", tweet: "Just finished my project! Feeling proud 💪", type: "personal" },
                        { user: "News Alert", handle: "@newske", tweet: "BREAKING: Another scandal exposed...", type: "news" },
                        { user: "Motivator", handle: "@inspire", tweet: "Haraka haraka haina baraka. Take your time.", type: "peaceful" },
                      ].map((post, i) => {
                        const isFiltered = contentFilter === "following" && post.type === "news";
                        const isPeaceful = contentFilter === "peaceful" && post.type !== "peaceful";
                        
                        if (isFiltered || isPeaceful) return null;
                        
                        return (
                          <div key={i} class="p-4 border-b border-gray-800">
                            <div class="flex gap-3">
                              <div class="w-10 h-10 rounded-full bg-gray-600 flex-shrink-0"></div>
                              <div class="flex-1">
                                <div class="flex gap-2 items-center mb-1">
                                  <span class="font-bold text-sm">{post.user}</span>
                                  <span class="text-gray-500 text-xs">{post.handle} · 2h</span>
                                </div>
                                <p class="text-sm">{post.tweet}</p>
                                {!hideMetrics && !pumzikaActive && (
                                  <div class="flex gap-8 mt-3 text-gray-500 text-xs">
                                    <span>💬 {Math.floor(Math.random() * 500)}</span>
                                    <span>🔁 {Math.floor(Math.random() * 2000)}</span>
                                    <span>❤️ {Math.floor(Math.random() * 5000)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scroll Reminder Overlay */}
                  {scrollReminder && pumzikaActive && (
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-xs backdrop-blur">
                      🐢 Slow down... You've scrolled 20 posts
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Control Panel */}
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
                  <span>🔇</span> Content Filtering
                </h3>
                <div class="space-y-3">
                  <button
                    onClick={() => setHideTrends(!hideTrends)}
                    class={`w-full py-2 rounded-lg text-sm font-medium ${hideTrends ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  >
                    {hideTrends ? '✓ Trends Hidden' : 'Hide Trending Topics'}
                  </button>
                  <button
                    onClick={() => setHideMetrics(!hideMetrics)}
                    class={`w-full py-2 rounded-lg text-sm font-medium ${hideMetrics ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  >
                    {hideMetrics ? '✓ Metrics Hidden' : 'Hide Likes/Retweets'}
                  </button>
                </div>
                <div class="mt-4">
                  <label class="text-sm text-gray-300 block mb-2">Feed Type</label>
                  <div class="grid grid-cols-3 gap-2">
                    {[
                      { id: "all", label: "All" },
                      { id: "following", label: "Following" },
                      { id: "peaceful", label: "Peaceful" }
                    ].map(filter => (
                      <button
                        key={filter.id}
                        onClick={() => setContentFilter(filter.id as any)}
                        class={`py-2 rounded-lg text-xs font-medium ${
                          contentFilter === filter.id ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>⏱️</span> Mindful Scrolling
                </h3>
                <button
                  onClick={() => setScrollReminder(!scrollReminder)}
                  class={`w-full py-3 rounded-lg font-medium ${scrollReminder ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  {scrollReminder ? '✓ Scroll Reminders On' : 'Enable Scroll Reminders'}
                </button>
                <p class="text-xs text-gray-400 mt-2">Get gentle nudges when scrolling too fast</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
