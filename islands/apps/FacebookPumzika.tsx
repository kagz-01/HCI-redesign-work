import { useState } from "preact/hooks";

export default function FacebookPumzika() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pumzikaActive, setPumzikaActive] = useState(false);
  const [dimLevel, setDimLevel] = useState(0);
  const [hideNewsfeed, setHideNewsfeed] = useState(false);
  const [batchNotifications, setBatchNotifications] = useState(false);
  
  const standardImages = ["/images/Facebook.jpg", "/images/Facebook2.jpg"];
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div class="min-h-screen bg-gray-900">
      <nav class="bg-black/50 backdrop-blur-md text-white p-4 fixed top-0 w-full z-50">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/anxiety-mode" class="text-sm font-bold">← Back to Apps</a>
          <span class="font-semibold">Facebook - Pumzika Mode</span>
          <div class="w-20"></div>
        </div>
      </nav>

      <section id="standard" class="min-h-screen flex flex-col items-center justify-center pt-20 pb-10 px-6">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-red-400 mb-2">Standard Facebook Interface</h2>
          <p class="text-gray-300 text-sm">Algorithmic Overload & Notification Anxiety</p>
        </div>

        <div class="relative w-full max-w-sm">
          <div class="relative h-[70vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-red-500/50">
            <img src={standardImages[currentImageIndex]} alt="Facebook Standard" class="w-full h-full object-cover" />
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
            <p class="text-green-100">Cut the noise. Focus on connections that matter.</p>
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
                  style={{ filter: pumzikaActive ? `brightness(${1 - dimLevel/150})` : 'none' }}>
                  <div class="h-full bg-white flex flex-col">
                    <div class="p-3 bg-blue-600 text-white flex justify-between items-center">
                      <span class="font-bold">facebook</span>
                      <div class="flex gap-3 text-sm">
                        {!batchNotifications && !pumzikaActive && <span class="relative">🔔<span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[8px] flex items-center justify-center">9</span></span>}
                        <span>👤</span>
                      </div>
                    </div>
                    <div class="flex-1 overflow-y-auto p-2">
                      {hideNewsfeed ? (
                        <div class="flex flex-col items-center justify-center h-full text-gray-500">
                          <span class="text-4xl mb-3">🌿</span>
                          <p class="font-semibold">News Feed Paused</p>
                          <p class="text-xs mt-1">Check your friends directly</p>
                        </div>
                      ) : (
                        <>
                          {["Friend posted a photo", "Group: Work Updates", "Marketplace listing"].map((item, i) => (
                            <div key={i} class="bg-gray-50 p-3 rounded mb-2 border">
                              <p class="text-xs text-gray-600">{item}</p>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                  {batchNotifications && pumzikaActive && (
                    <div class="absolute top-16 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs">
                      📬 Batched (2 pending)
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🌙</span> Visual Calming</h3>
                <div>
                  <label class="text-sm text-gray-300 block mb-2">Dim: {dimLevel}%</label>
                  <input type="range" min="0" max="70" value={dimLevel} onInput={(e) => setDimLevel(parseInt(e.currentTarget.value))} class="w-full" />
                </div>
              </div>

              <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>📰</span> News Feed Control</h3>
                <button onClick={() => setHideNewsfeed(!hideNewsfeed)}
                  class={`w-full py-3 rounded-lg font-medium ${hideNewsfeed ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                  {hideNewsfeed ? '✓ News Feed Hidden' : 'Hide Algorithmic Feed'}
                </button>
                <p class="text-xs text-gray-400 mt-2">Focus on direct messages and groups</p>
              </div>

              <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🔔</span> Notification Batching</h3>
                <button onClick={() => setBatchNotifications(!batchNotifications)}
                  class={`w-full py-3 rounded-lg font-medium ${batchNotifications ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                  {batchNotifications ? '✓ Batching Active' : 'Enable Notification Batching'}
                </button>
                <p class="text-xs text-gray-400 mt-2">Get updates every 30 mins instead of instantly</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
