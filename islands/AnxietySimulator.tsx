
import { useState, useEffect, useRef } from "preact/hooks";

type AppName = "home" | "whatsapp" | "tiktok" | "twitter" | "facebook" | "snapchat";

const APP_DATA = {
  whatsapp: {
    name: "WhatsApp",
    icon: "/icons/whatsapp.png",
    images: ["/images/whatsapp.jpeg", "/images/whatsapp2.jpg"],
    triggers: [
      { x: 85, y: 15, text: "Unread Badges: Creates urgency" },
      { x: 20, y: 10, text: "'Last Seen': Social pressure" }
    ],
    solution: "Hides status & counts. Focuses on one chat at a time."
  },
  tiktok: {
    name: "TikTok",
    icon: "/icons/tiktok.png",
    images: ["/images/tiktok.jpg", "/images/tiktok2.png"],
    triggers: [
      { x: 90, y: 50, text: "Like Counts: Social validation loop" },
      { x: 50, y: 80, text: "Infinite Scroll: Dopamine trap" }
    ],
    solution: "Removes metrics. Adds scroll friction. Grayscale mode."
  },
  twitter: {
    name: "X / Twitter",
    icon: "/icons/x.png",
    images: ["/images/twitter-x.jpg", "/images/twitter-x2.jpg"],
    triggers: [
      { x: 80, y: 10, text: "Trending Topics: Political polarization" },
      { x: 50, y: 40, text: "Argumentative Threads: Anger trigger" }
    ],
    solution: "Filters trends. Hides retweets. Focuses on friends."
  },
  facebook: {
    name: "Facebook",
    icon: "/icons/facebook.jpeg",
    images: ["/images/Facebook.jpg", "/images/Facebook2.jpg"],
    triggers: [
      { x: 70, y: 20, text: "Notification Bell: Constant interruption" },
      { x: 50, y: 60, text: "News Feed: Algorithmic clutter" }
    ],
    solution: "News feed blocker. Notification batching."
  },
  snapchat: {
    name: "Snapchat",
    icon: "/icons/snapchat.png",
    images: ["/images/snapchat.jpeg", "/images/snapchat2.jpeg"],
    triggers: [
      { x: 10, y: 90, text: "Snap Streaks: Artificial obligation" },
      { x: 90, y: 10, text: "Map Location: FOMO trigger" }
    ],
    solution: "Pauses streaks. Hides location. Focuses on memories."
  }
};

export default function AnxietySimulator() {
  const [currentApp, setCurrentApp] = useState<AppName>("home");
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleAppSelect = (app: AppName) => {
    setCurrentApp(app);
    setActiveFeature(null);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      const height = scrollRef.current.clientHeight;
      const page = Math.round(scrollTop / height);
      
      if (page === 0) setActiveFeature(null);
      if (page === 1) setActiveFeature("visual");
      if (page === 2) setActiveFeature("demetrication");
      if (page === 3) setActiveFeature("cultural");
    }
  };

  const renderHome = () => (
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 font-sans">
      <h2 class="text-3xl font-bold mb-2 text-gray-900">Anxiety Simulator</h2>
      <p class="text-gray-500 mb-10 text-center max-w-md">
        Select an app to see how Pumzika Mode tackles anxiety.
      </p>
      
      <div class="grid grid-cols-3 gap-8 w-full max-w-md">
        <a href="/apps/whatsapp" class="flex flex-col items-center gap-3 group">
          <div class="w-20 h-20 rounded-2xl shadow-lg overflow-hidden transition-transform transform group-hover:scale-110 group-hover:shadow-xl border border-gray-100 bg-white p-2">
            <img src="/icons/whatsapp.png" alt="WhatsApp" class="w-full h-full object-contain" />
          </div>
          <span class="text-sm font-medium text-gray-700 group-hover:text-green-600">WhatsApp</span>
        </a>

        <a href="/apps/tiktok" class="flex flex-col items-center gap-3 group">
          <div class="w-20 h-20 rounded-2xl shadow-lg overflow-hidden transition-transform transform group-hover:scale-110 group-hover:shadow-xl border border-gray-100 bg-white p-2">
            <img src="/icons/tiktok.png" alt="TikTok" class="w-full h-full object-contain" />
          </div>
          <span class="text-sm font-medium text-gray-700 group-hover:text-green-600">TikTok</span>
        </a>

        <a href="/apps/twitter" class="flex flex-col items-center gap-3 group">
          <div class="w-20 h-20 rounded-2xl shadow-lg overflow-hidden transition-transform transform group-hover:scale-110 group-hover:shadow-xl border border-gray-100 bg-white p-2">
            <img src="/icons/x.png" alt="X/Twitter" class="w-full h-full object-contain" />
          </div>
          <span class="text-sm font-medium text-gray-700 group-hover:text-green-600">X/Twitter</span>
        </a>

        <a href="/apps/facebook" class="flex flex-col items-center gap-3 group">
          <div class="w-20 h-20 rounded-2xl shadow-lg overflow-hidden transition-transform transform group-hover:scale-110 group-hover:shadow-xl border border-gray-100 bg-white p-2">
            <img src="/icons/facebook.jpeg" alt="Facebook" class="w-full h-full object-contain" />
          </div>
          <span class="text-sm font-medium text-gray-700 group-hover:text-green-600">Facebook</span>
        </a>

        <a href="/apps/snapchat" class="flex flex-col items-center gap-3 group">
          <div class="w-20 h-20 rounded-2xl shadow-lg overflow-hidden transition-transform transform group-hover:scale-110 group-hover:shadow-xl border border-gray-100 bg-white p-2">
            <img src="/icons/snapchat.png" alt="Snapchat" class="w-full h-full object-contain" />
          </div>
          <span class="text-sm font-medium text-gray-700 group-hover:text-green-600">Snapchat</span>
        </a>
      </div>
      
      <div class="mt-16 p-4 bg-blue-50 rounded-xl border border-blue-100 max-w-xs text-center">
        <p class="text-blue-800 text-sm">
          ℹ️ <strong>Tip:</strong> Each app has a dedicated presentation with interactive controls.
        </p>
      </div>
    </div>
  );

  const renderAppDetail = () => {
    const app = APP_DATA[currentApp as keyof typeof APP_DATA];
    
    return (
      <div class="relative w-full h-screen bg-gray-900 overflow-hidden flex flex-col">
        {/* Header */}
        <div class="bg-white/10 backdrop-blur-md text-white p-4 flex justify-between items-center z-50 absolute top-0 w-full">
          <button onClick={() => setCurrentApp("home")} class="text-sm font-bold flex items-center gap-1">
            ← Back
          </button>
          <span class="font-semibold">{app.name} Analysis</span>
          <div class="w-8"></div>
        </div>

        {/* Scroll Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          class="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth"
        >
          {/* Section 1: The Problem (Standard Images) */}
          <section class="w-full h-screen snap-start relative flex flex-col items-center justify-center bg-gray-800 pt-16">
            <div class="text-center mb-4 px-6">
              <h3 class="text-2xl font-bold text-red-400 mb-1">The Anxiety Trap</h3>
              <p class="text-gray-300 text-xs">Standard Interface Triggers</p>
            </div>

            <div class="flex gap-4 overflow-x-auto w-full px-8 pb-8 snap-x">
              {app.images.map((img, i) => (
                <div key={i} class="relative flex-shrink-0 w-[80vw] max-w-xs h-[60vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-700 snap-center">
                  <img src={img} class="w-full h-full object-cover" alt={`Standard View ${i+1}`} />
                  {/* Hotspots only on first image for demo */}
                  {i === 0 && app.triggers.map((trigger, idx) => (
                    <div 
                      key={idx}
                      class="absolute w-8 h-8 rounded-full bg-red-500/50 animate-ping cursor-pointer"
                      style={{ top: `${trigger.y}%`, left: `${trigger.x}%` }}
                    >
                      <div class="absolute inset-0 flex items-center justify-center">
                        <div class="w-3 h-3 bg-red-600 rounded-full shadow-lg"></div>
                      </div>
                      <div class="absolute left-8 top-0 bg-black/90 text-white text-[10px] p-2 rounded w-24 pointer-events-none z-10">
                        {trigger.text}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div class="absolute bottom-8 animate-bounce text-white/50 text-sm flex flex-col items-center">
              <span>Scroll to Activate Pumzika</span>
              <span>↓</span>
            </div>
          </section>

          {/* Section 2: Visual Calming */}
          <section class="w-full h-screen snap-start relative flex flex-col items-center justify-center bg-green-900/30">
            <div class="absolute top-20 text-center z-10 px-6">
              <h3 class="text-2xl font-bold text-green-300 mb-2">Step 1: Visual Calming</h3>
              <p class="text-green-100 text-sm">Dimming & Desaturation to reduce stimulation.</p>
            </div>
            <div class="relative w-full max-w-md h-[70vh] mt-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-green-500/50">
              <img src={app.images[0]} class="w-full h-full object-cover filter grayscale sepia brightness-75 transition-all duration-1000" />
              <div class="absolute inset-0 bg-green-900/20 mix-blend-overlay"></div>
            </div>
          </section>

          {/* Section 3: Demetrication */}
          <section class="w-full h-screen snap-start relative flex flex-col items-center justify-center bg-green-900/50">
            <div class="absolute top-20 text-center z-10 px-6">
              <h3 class="text-2xl font-bold text-green-300 mb-2">Step 2: Demetrication</h3>
              <p class="text-green-100 text-sm">Hiding the numbers that drive comparison.</p>
            </div>
            <div class="relative w-full max-w-md h-[70vh] mt-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-green-500/50">
              <img src={app.images[0]} class="w-full h-full object-cover filter grayscale brightness-90 blur-[1px]" />
              
              {/* Metric Blockers */}
              <div class="absolute top-[15%] right-[10%] w-12 h-6 bg-gray-200/50 backdrop-blur-md rounded"></div>
              <div class="absolute bottom-[10%] left-[20%] w-32 h-4 bg-gray-200/50 backdrop-blur-md rounded"></div>
              <div class="absolute bottom-[10%] right-[20%] w-16 h-4 bg-gray-200/50 backdrop-blur-md rounded"></div>
              
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur">
                  🚫 Metrics Hidden
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Cultural Grounding */}
          <section class="w-full h-screen snap-start relative flex flex-col items-center justify-center bg-green-900/80">
            <div class="absolute top-20 text-center z-10 px-6">
              <h3 class="text-2xl font-bold text-green-300 mb-2">Step 3: Cultural Grounding</h3>
              <p class="text-green-100 text-sm">Reconnecting with Kenyan values.</p>
            </div>
            <div class="relative w-full max-w-md h-[70vh] mt-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-green-400">
              <img src={app.images[0]} class="w-full h-full object-cover filter grayscale brightness-50 blur-sm" />
              
              {/* Cultural Overlay */}
              <div class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div class="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-2xl transform transition-all hover:scale-105">
                  <span class="text-4xl mb-4 block">🌿</span>
                  <h4 class="text-xl font-bold text-white mb-2">Pumzika Kidogo</h4>
                  <p class="text-green-100 italic mb-4">"Tazama vitu vitatu ukumbani..."</p>
                  <p class="text-white/70 text-xs">(Look at three things in the room)</p>
                  
                  <div class="mt-6 w-full bg-white/20 h-1 rounded-full overflow-hidden">
                    <div class="bg-green-400 h-full w-2/3 animate-pulse"></div>
                  </div>
                  <p class="text-white/50 text-[10px] mt-2">Breathing in sync...</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    );
  };

  if (currentApp === "home") return renderHome();
  return renderAppDetail();
}
