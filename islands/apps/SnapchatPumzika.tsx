import { useState } from "preact/hooks";

export default function SnapchatPumzika() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pumzikaActive, setPumzikaActive] = useState(false);
  const [dimLevel, setDimLevel] = useState(0);
  const [pauseStreaks, setPauseStreaks] = useState(false);
  const [hideMap, setHideMap] = useState(false);
  
  const standardImages = ["/images/snapchat.jpeg", "/images/snapchat2.jpeg"];
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div class="min-h-screen bg-gray-900">
      <nav class="bg-black/50 backdrop-blur-md text-white p-4 fixed top-0 w-full z-50">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/anxiety-mode" class="text-sm font-bold">← Back to Apps</a>
          <span class="font-semibold">Snapchat - Pumzika Mode</span>
          <div class="w-20"></div>
        </div>
      </nav>

      <section id="standard" class="min-h-screen flex flex-col items-center justify-center pt-20 pb-10 px-6">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-red-400 mb-2">Standard Snapchat Interface</h2>
          <p class="text-gray-300 text-sm">Streak Anxiety & FOMO from Snap Map</p>
        </div>

        <div class="relative w-full max-w-sm">
          <div class="relative h-[70vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-red-500/50">
            <img src={standardImages[currentImageIndex]} alt="Snapchat Standard" class="w-full h-full object-cover" />
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
            <p class="text-green-100">Release the pressure. Snap on your terms.</p>
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
                  <div class="h-full bg-yellow-400 flex flex-col items-center justify-center">
                    <div class="text-center">
                      <span class="text-6xl">👻</span>
                      <p class="mt-4 text-sm text-gray-800">Snapchat Interface</p>
                      {pauseStreaks && pumzikaActive && (
                        <div class="mt-4 bg-white px-4 py-2 rounded-full text-xs">
                          🔥 Streaks Paused
                        </div>
                      )}
                      {hideMap && pumzikaActive && (
                        <div class="mt-2 bg-white px-4 py-2 rounded-full text-xs">
                          🗺️ Map Hidden
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>🌙</span> Visual Calming
                </h3>
                <div>
                  <label class="text-sm text-gray-300 block mb-2">Dim: {dimLevel}%</label>
                  <input type="range" min="0" max="70" value={dimLevel} onInput={(e) => setDimLevel(parseInt(e.currentTarget.value))} class="w-full" />
                </div>
              </div>

              <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🔥</span> Streak Management</h3>
                <button onClick={() => setPauseStreaks(!pauseStreaks)}
                  class={`w-full py-3 rounded-lg font-medium ${pauseStreaks ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                  {pauseStreaks ? '✓ Streaks Paused' : 'Pause Snap Streaks'}
                </button>
                <p class="text-xs text-gray-400 mt-2">Take a break without losing your streaks</p>
              </div>

              <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>📍</span> Privacy & FOMO</h3>
                <button onClick={() => setHideMap(!hideMap)}
                  class={`w-full py-3 rounded-lg font-medium ${hideMap ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                  {hideMap ? '✓ Snap Map Hidden' : 'Hide Snap Map'}
                </button>
                <p class="text-xs text-gray-400 mt-2">Reduce location-based FOMO</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
