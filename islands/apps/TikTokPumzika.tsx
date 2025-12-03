import { useState } from "preact/hooks";

export default function TikTokPumzika() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pumzikaActive, setPumzikaActive] = useState(false);
  const [dimLevel, setDimLevel] = useState(0);
  const [blurLevel, setBlurLevel] = useState(0);
  const [hideMetrics, setHideMetrics] = useState(false);
  const [scrollFriction, setScrollFriction] = useState(0); // 0-100
  const [sessionTime, setSessionTime] = useState(10);
  
  const standardImages = ["/images/tiktok.jpg", "/images/tiktok2.png"];
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div class="min-h-screen bg-gray-900">
      <nav class="bg-black/50 backdrop-blur-md text-white p-4 fixed top-0 w-full z-50">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/anxiety-mode" class="text-sm font-bold">← Back to Apps</a>
          <span class="font-semibold">TikTok - Pumzika Mode</span>
          <div class="w-20"></div>
        </div>
      </nav>

      <section id="standard" class="min-h-screen flex flex-col items-center justify-center pt-20 pb-10 px-6">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-red-400 mb-2">Standard TikTok Interface</h2>
          <p class="text-gray-300 text-sm">Infinite Scroll & Social Comparison Trap</p>
        </div>

        <div class="relative w-full max-w-sm">
          <div class="relative h-[70vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-red-500/50">
            <img src={standardImages[currentImageIndex]} alt="TikTok Standard" class="w-full h-full object-cover" />
            {currentImageIndex === 0 && (
              <>
                <div class="absolute top-[70%] right-[15%] w-8 h-8 bg-red-500/70 rounded-full animate-ping"></div>
                <div class="absolute top-[70%] right-[25%] bg-black/90 text-white text-xs p-2 rounded w-32 -translate-x-full">
                  ❤️ Like counts trigger comparison
                </div>
              </>
            )}
          </div>
          <div class="flex justify-center gap-2 mt-4">
            {standardImages.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentImageIndex(idx)}
                class={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? "bg-white w-6" : "bg-gray-500"}`} />
            ))}
          </div>
        </div>

        <button onClick={() => scrollToSection("pumzika")}
          class="mt-8 px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition animate-bounce">
          See Pumzika Solution ↓
        </button>
      </section>

      <section id="pumzika" class="min-h-screen bg-gradient-to-b from-gray-900 to-green-900/30 py-20 px-6">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-4xl font-bold text-green-300 mb-3">Pumzika Mode Activated</h2>
            <p class="text-green-100">Break the scroll addiction. Reclaim your time.</p>
          </div>

          <div class="grid lg:grid-cols-2 gap-8">
            <div class="relative">
              <div class="sticky top-24">
                <div class="text-sm text-gray-400 mb-3 flex justify-between items-center">
                  <span>Live Preview</span>
                  <button onClick={() => setPumzikaActive(!pumzikaActive)}
                    class={`px-3 py-1 rounded-full text-xs ${pumzikaActive ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                    {pumzikaActive ? "🌿 Active" : "Activate"}
                  </button>
                </div>
                
                <div class="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-green-500"
                  style={{ filter: pumzikaActive ? `brightness(${1 - dimLevel/150}) blur(${blurLevel}px) grayscale(${scrollFriction}%)` : 'none' }}>
                  <div class="h-full bg-black flex flex-col">
                    <div class="p-4 flex justify-between items-center text-white">
                      <span>Following</span>
                      <span class="text-2xl font-bold">TikTok</span>
                      <span>Search</span>
                    </div>
                    <div class="flex-1 flex items-center justify-center bg-gradient-to-b from-purple-900 to-pink-900 relative">
                      <div class="text-center text-white">
                        <p class="text-sm mb-2">@kenyan_creator</p>
                        <p class="text-xs">"Checking what's trending today..."</p>
                      </div>
                      {!hideMetrics && !pumzikaActive && (
                        <div class="absolute right-4 bottom-20 flex flex-col gap-4 text-white text-xs text-center">
                          <div><div class="w-10 h-10 bg-white/20 rounded-full mb-1"></div>245K</div>
                          <div>💬<br/>2.1K</div>
                          <div>🔗<br/>890</div>
                        </div>
                      )}
                      {scrollFriction > 50 && pumzikaActive && (
                        <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 px-4 py-2 rounded-full text-xs text-white backdrop-blur">
                          🐢 Scroll Friction Active
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🌙</span> Visual Calming</h3>
                <div class="space-y-4">
                  <div>
                    <label class="text-sm text-gray-300 block mb-2">Dim: {dimLevel}%</label>
                    <input type="range" min="0" max="70" value={dimLevel} onInput={(e) => setDimLevel(parseInt(e.currentTarget.value))} class="w-full" />
                  </div>
                  <div>
                    <label class="text-sm text-gray-300 block mb-2">Blur: {blurLevel}px</label>
                    <input type="range" min="0" max="5" value={blurLevel} onInput={(e) => setBlurLevel(parseInt(e.currentTarget.value))} class="w-full" />
                  </div>
                </div>
              </div>

              <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🚫</span> Demetrication</h3>
                <button onClick={() => setHideMetrics(!hideMetrics)}
                  class={`w-full py-3 rounded-lg font-medium ${hideMetrics ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                  {hideMetrics ? '✓ Likes/Views Hidden' : 'Hide Engagement Metrics'}
                </button>
              </div>

              <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>⚡</span> Scroll Friction</h3>
                <div>
                  <label class="text-sm text-gray-300 block mb-2">Friction Level: {scrollFriction}%</label>
                  <input type="range" min="0" max="100" value={scrollFriction} onInput={(e) => setScrollFriction(parseInt(e.currentTarget.value))} class="w-full" />
                  <p class="text-xs text-gray-400 mt-2">Adds resistance to infinite scrolling</p>
                </div>
              </div>

              <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>⏱️</span> Session Timer</h3>
                <div class="grid grid-cols-3 gap-2">
                  {[10, 20, 30].map(time => (
                    <button key={time} onClick={() => setSessionTime(time)}
                      class={`py-2 rounded-lg text-sm font-medium ${sessionTime === time ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                      {time}m
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
