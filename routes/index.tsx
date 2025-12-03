export default function Home() {
  return (
    <div class="min-h-screen bg-white font-sans text-gray-900">
      {/* Hero Section */}
      <header class="bg-gradient-to-r from-green-50 to-blue-50 py-20 px-6 text-center">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-5xl font-extrabold mb-6 text-gray-900 tracking-tight">
            Pumzika Mode
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 mb-8 font-light">
            Culturally-Intelligent Digital Well-being for Kenya
          </p>
          <p class="text-lg text-green-700 font-medium italic mb-10">
            "When Social Media Gets Too Heavy, We Help Kenyans Breathe"
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/anxiety-mode" class="px-8 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition shadow-lg">
              Try Anxiety Mode
            </a>
            <a href="/anger-mode" class="px-8 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition shadow-lg">
              Try Anger Mode
            </a>
          </div>
        </div>
      </header>

      {/* The Problem Section */}
      <section class="py-16 px-6 max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">The Problem We Saw</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div class="text-4xl mb-4">🗣️</div>
            <h3 class="text-xl font-bold mb-2">Political Tribalism</h3>
            <p class="text-gray-600">Turning our timelines into battlefields and creating constant digital tension.</p>
          </div>
          <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div class="text-4xl mb-4">💼</div>
            <h3 class="text-xl font-bold mb-2">'Hustle Culture' Pressure</h3>
            <p class="text-gray-600">Making us feel like we're never enough in a landscape of visible success.</p>
          </div>
          <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div class="text-4xl mb-4">📉</div>
            <h3 class="text-xl font-bold mb-2">Social Comparison</h3>
            <p class="text-gray-600">Amplified by algorithms that don't understand our values or context.</p>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section class="py-16 px-6 bg-gray-900 text-white">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-16">Our Solution: Two Interventions</h2>
          
          <div class="grid md:grid-cols-2 gap-12">
            {/* Anxiety Card */}
            <div class="bg-gray-800 rounded-3xl p-8 hover:bg-gray-750 transition border border-gray-700">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">🌿</div>
                <h3 class="text-2xl font-bold">Anxiety Management</h3>
              </div>
              <p class="text-gray-300 mb-6">
                "The Control Center Approach" - A discreet toggle that transforms your social apps when they get overwhelming.
              </p>
              <ul class="space-y-3 mb-8 text-gray-400">
                <li class="flex gap-2"><span>✨</span> Visual Calming (Dim & Blur)</li>
                <li class="flex gap-2"><span>🚫</span> Content Filtering (Friends Only)</li>
                <li class="flex gap-2"><span>🇰🇪</span> Swahili Grounding Prompts</li>
              </ul>
              <a href="/anxiety-mode" class="inline-block w-full text-center py-3 border border-green-500 text-green-400 rounded-xl hover:bg-green-500/10 transition">
                Launch Simulator
              </a>
            </div>

            {/* Anger Card */}
            <div class="bg-gray-800 rounded-3xl p-8 hover:bg-gray-750 transition border border-gray-700">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-2xl">🔥</div>
                <h3 class="text-2xl font-bold">Anger Cooling</h3>
              </div>
              <p class="text-gray-300 mb-6">
                "The Emergency Exit" - Activated by volume buttons to provide immediate immersion in a calm space.
              </p>
              <ul class="space-y-3 mb-8 text-gray-400">
                <li class="flex gap-2"><span>🌬️</span> 4-7-8 Breathing Guide</li>
                <li class="flex gap-2"><span>🗑️</span> "Vent to the Void" (Auto-delete)</li>
                <li class="flex gap-2"><span>🌊</span> Diani Beach Sounds</li>
              </ul>
              <a href="/anger-mode" class="inline-block w-full text-center py-3 border border-red-500 text-red-400 rounded-xl hover:bg-red-500/10 transition">
                Open Emergency Exit
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section class="py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-12">Backed by Research</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div class="text-4xl font-bold text-blue-600 mb-2">182</div>
            <div class="text-sm text-gray-500 uppercase tracking-wide">Kenyan Users Tested</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-green-600 mb-2">78.4</div>
            <div class="text-sm text-gray-500 uppercase tracking-wide">Usability Score</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-purple-600 mb-2">68%</div>
            <div class="text-sm text-gray-500 uppercase tracking-wide">Anxiety Reduction</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-orange-600 mb-2">4.1/5</div>
            <div class="text-sm text-gray-500 uppercase tracking-wide">Cultural Fit</div>
          </div>
        </div>
        <blockquote class="mt-16 text-xl italic text-gray-600 border-l-4 border-green-500 pl-6 text-left mx-auto max-w-2xl">
          "It feels like technology finally understands us."
        </blockquote>
      </section>

      <footer class="bg-gray-50 py-8 text-center text-gray-400 text-sm">
        <p>© 2025 Pumzika Mode. Built for Kenya.</p>
      </footer>
    </div>
  );
}
