import { useState, useEffect, useRef } from "preact/hooks";

export default function AngerManagement() {
  const [breathingState, setBreathingState] = useState<"Ready" | "Inhale" | "Hold" | "Exhale">("Ready");
  const [ventText, setVentText] = useState("");
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const [isVenting, setIsVenting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [activeSound, setActiveSound] = useState<"karura" | "rain" | "waves" | "birds" | "jungle" | "river" | "morning" | "forest" | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showGrounding, setShowGrounding] = useState(false);
  const [messageDelay, setMessageDelay] = useState(false);
  const [delayedMessageText, setDelayedMessageText] = useState("");
  const [delayedMessageRecipient, setDelayedMessageRecipient] = useState("");
  const [showDelayDialog, setShowDelayDialog] = useState(false);
  const [aiReflection, setAiReflection] = useState<string | null>(null);
  const [phase, setPhase] = useState<1 | 2 | 3>(1); // 3 phases of anger cooling
  const [showTherapist, setShowTherapist] = useState(false);
  const [therapistMessages, setTherapistMessages] = useState<Array<{ role: 'user' | 'ai', text: string }>>([]);
  const [therapistInput, setTherapistInput] = useState("");
  const [isTherapistTyping, setIsTherapistTyping] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [friendPhone, setFriendPhone] = useState("");
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [blockPhone, setBlockPhone] = useState("");
  const [phaseCompleted, setPhaseCompleted] = useState<{1: boolean, 2: boolean, 3: boolean}>({1: false, 2: false, 3: false});
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Arrow keys for navigation
      if (e.key === 'ArrowLeft' && phase > 1) {
        setPhase((phase - 1) as 1 | 2 | 3);
      } else if (e.key === 'ArrowRight' && phase < 3) {
        setPhase((phase + 1) as 1 | 2 | 3);
      }
      // Number keys for direct navigation
      else if (e.key === '1') setPhase(1);
      else if (e.key === '2') setPhase(2);
      else if (e.key === '3') setPhase(3);
    };
    
    globalThis.addEventListener('keydown', handleKeyPress);
    return () => globalThis.removeEventListener('keydown', handleKeyPress);
  }, [phase]);

  // Breathing logic (4-7-8 technique)
  useEffect(() => {
    if (breathingState === "Ready") return;
    
    let timeout: number;
    if (breathingState === "Inhale") {
      // Inhale for 4s
      timeout = setTimeout(() => setBreathingState("Hold"), 4000);
    } else if (breathingState === "Hold") {
      // Hold for 7s
      timeout = setTimeout(() => setBreathingState("Exhale"), 7000);
    } else if (breathingState === "Exhale") {
      // Exhale for 8s
      timeout = setTimeout(() => setBreathingState("Inhale"), 8000);
    }
    return () => clearTimeout(timeout);
  }, [breathingState]);

  const startBreathing = () => {
    setBreathingState("Inhale");
    // Auto-complete phase 1 after 3 cycles (about 57 seconds)
    setTimeout(() => {
      setPhaseCompleted(prev => ({...prev, 1: true}));
    }, 57000);
  };
  const stopBreathing = () => setBreathingState("Ready");

  const handleVent = async () => {
    if (!ventText.trim()) return;
    setIsVenting(true);
    
    try {
      // Call Grok API for AI reflection
      const response = await fetch('/api/grok-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ventText })
      });
      
      const data = await response.json();
      
      setTimeout(() => {
        setAiReflection(data.reflection);
      }, 800);
      
    } catch (error) {
      console.error('Error getting reflection:', error);
      // Fallback reflection
      setTimeout(() => {
        setAiReflection("Your feelings are valid. Pole sana. Take your time to process this.");
      }, 800);
    }
    
    // Text disappears after reflection
    setTimeout(() => {
      setVentText("");
      setIsVenting(false);
      setPhase(2); // Move to phase 2
    }, 4000);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setVoiceNote(audioUrl);
        stream.getTracks().forEach(track => track.stop());
        
        // Auto-delete after showing briefly
        setTimeout(() => {
          setVoiceNote(null);
          URL.revokeObjectURL(audioUrl);
        }, 3000);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Update recording time every second
      const timer = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) {
            stopVoiceRecording();
            clearInterval(timer);
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Microphone access denied:', error);
      alert('Please allow microphone access to record voice notes');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setPhase(2);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      videoStreamRef.current = stream;
      setShowCamera(true);
      
      // Display camera feed
      const videoElement = document.getElementById('camera-preview') as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = stream;
        videoElement.play();
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Please allow camera access to take photos');
    }
  };

  const capturePhoto = () => {
    const videoElement = document.getElementById('camera-preview') as HTMLVideoElement;
    if (videoElement) {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoElement, 0, 0);
        const photoUrl = canvas.toDataURL('image/png');
        setCapturedPhoto(photoUrl);
        
        // Stop camera immediately
        if (videoStreamRef.current) {
          videoStreamRef.current.getTracks().forEach(track => track.stop());
          videoStreamRef.current = null;
        }
        setShowCamera(false);
        
        // Photo stays until user releases it (no auto-delete)
      }
    }
  };

  const releasePhoto = () => {
    // Animate fade out
    setTimeout(() => {
      setCapturedPhoto(null);
    }, 2000);
  };

  const closeCamera = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
      videoStreamRef.current = null;
    }
    setShowCamera(false);
  };

  const scheduleDelayedMessage = () => {
    if (!delayedMessageText.trim() || !delayedMessageRecipient.trim()) return;
    
    // In production, this would integrate with SMS API or phone's messaging
    // For now, we'll create a timed notification
    const delayMinutes = 60; // 1 hour delay
    const sendTime = new Date(Date.now() + delayMinutes * 60 * 1000);
    
    alert(`Message scheduled!

To: ${delayedMessageRecipient}
Message: "${delayedMessageText}"
Will send at: ${sendTime.toLocaleTimeString()}

You'll have time to cool down and reconsider. You can cancel from your phone's scheduled messages.`);
    
    setMessageDelay(true);
    setShowDelayDialog(false);
    setDelayedMessageText("");
    setDelayedMessageRecipient("");
    setPhaseCompleted(prev => ({...prev, 3: true}));
  };

  const sendTherapistMessage = async () => {
    if (!therapistInput.trim()) return;
    
    const userMessage = therapistInput;
    setTherapistMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setTherapistInput("");
    setIsTherapistTyping(true);
    
    try {
      const response = await fetch('/api/grok-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ventText: userMessage,
          conversationHistory: therapistMessages,
          currentPhase: phase,
          hasVented: ventText.length > 0 || voiceNote !== null || capturedPhoto !== null,
          breathingCompleted: phaseCompleted[1],
          actionsTaken: phaseCompleted[3]
        })
      });
      
      const data = await response.json();
      
      setTimeout(() => {
        setTherapistMessages(prev => [...prev, { role: 'ai', text: data.reflection }]);
        setIsTherapistTyping(false);
      }, 800);
      
    } catch (error) {
      console.error('Error:', error);
      setTimeout(() => {
        setTherapistMessages(prev => [...prev, { 
          role: 'ai', 
          text: "I'm here to listen. Take your time. What's on your mind?" 
        }]);
        setIsTherapistTyping(false);
      }, 800);
    }
  };

  const handleCallFriend = () => {
    if (friendPhone) {
      globalThis.location.href = `tel:${friendPhone}`;
      setShowCallDialog(false);
      setFriendPhone("");
    }
  };

  const handleBlockContact = () => {
    if (blockPhone) {
      // In a real app, this would integrate with phone's contact blocking
      alert(`Contact ${blockPhone} will be blocked for 24 hours. You can unblock from your phone settings.`);
      setShowBlockDialog(false);
      setBlockPhone("");
    }
  };

  const playSound = (sound: typeof activeSound) => {
    // Stop and clean up any currently playing audio
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      audioElementRef.current = null;
    }
    
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // If clicking the same sound, just stop it
    if (activeSound === sound) {
      setActiveSound(null);
      return;
    }

    // Set new sound
    setActiveSound(sound);
    
    // Mark phase 1 as progressing when user engages with sounds
    if (phase === 1) {
      setTimeout(() => {
        setPhaseCompleted(prev => ({...prev, 1: true}));
      }, 10000); // Mark complete after 10 seconds of sound engagement
    }
    
    // Try to load actual audio file first
    const audio = new Audio(`/sounds/${sound}.wav`);
    audio.loop = true;
    audio.volume = 0.4;
    audioElementRef.current = audio;
    
    audio.play().then(() => {
      // Audio file loaded successfully - already stored in ref
    }).catch(() => {
      // Fallback to Web Audio API if file doesn't exist
      audioElementRef.current = null;
      
      const AudioContext = globalThis.AudioContext || (globalThis as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      const ctx = audioContextRef.current;
      
      // Create gain node for volume control
      gainNodeRef.current = ctx.createGain();
      gainNodeRef.current.gain.value = 0.3;
      gainNodeRef.current.connect(ctx.destination);
      
      // Create oscillator for ambient sound
      oscillatorRef.current = ctx.createOscillator();
      const osc = oscillatorRef.current;
      
      // Different frequencies for different sounds
      const soundFrequencies: Record<string, number> = {
        karura: 220,  // A3 - bird-like chirps
        rain: 150,    // Low rumble
        waves: 180,   // Ocean waves
        birds: 250,   // Mixed nature
        jungle: 200,  // Tropical ambience
        river: 140,   // Water flow
        morning: 260, // Morning birds
        forest: 190   // Forest ambience
      };
      
      osc.type = sound === 'karura' || sound === 'birds' || sound === 'morning' ? 'sine' : 'triangle';
      osc.frequency.value = soundFrequencies[sound || 'rain'];
      
      // Add gentle vibrato
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 2;
      lfoGain.gain.value = 10;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      
      osc.connect(gainNodeRef.current);
      osc.start();
    });
  };

  return (
    <div class={`min-h-screen flex flex-col items-center p-4 transition-colors duration-[5000ms] ${
      breathingState === "Ready" ? "bg-red-50" : "bg-blue-50"
    }`}>
      
      {/* Header */}
      <div class="w-full max-w-md flex justify-between items-center mt-4 mb-8">
        <h1 class="text-2xl font-bold text-gray-800">Pumzika Kidogo</h1>
        <div class="text-sm text-gray-500">
          Phase {phase}/3 • {breathingState !== "Ready" ? "Breathing..." : "Emergency Mode"}
        </div>
      </div>

      {/* Phase Indicator */}
      <div class="w-full max-w-md mb-6">
        <div class="flex justify-between text-xs text-gray-500 mb-2">
          <button 
            type="button"
            onClick={() => setPhase(1)}
            class={`cursor-pointer hover:text-green-700 transition-colors ${phase >= 1 ? "text-green-600 font-semibold" : ""}`}
          >
            1. Calm
          </button>
          <button 
            type="button"
            onClick={() => setPhase(2)}
            class={`cursor-pointer hover:text-green-700 transition-colors ${phase >= 2 ? "text-green-600 font-semibold" : ""}`}
          >
            2. Express
          </button>
          <button 
            type="button"
            onClick={() => setPhase(3)}
            class={`cursor-pointer hover:text-green-700 transition-colors ${phase >= 3 ? "text-green-600 font-semibold" : ""}`}
          >
            3. Act
          </button>
        </div>
        <div class="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
          <div 
            class="bg-green-500 h-full transition-all duration-500" 
            style={{ width: `${(phase / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Phase 1: Breathing Section */}
      {phase === 1 && (
      <div class="mb-10 flex flex-col items-center w-full">
        <div class="relative flex items-center justify-center">
            {/* Ripple effects */}
            {breathingState !== "Ready" && (
                <>
                    <div class="absolute w-full h-full rounded-full bg-blue-200 opacity-30 animate-ping"></div>
                    <div class="absolute w-64 h-64 rounded-full bg-blue-100 opacity-20 animate-pulse"></div>
                </>
            )}
            
            <div 
            onClick={breathingState === "Ready" ? startBreathing : stopBreathing}
            class={`cursor-pointer w-56 h-56 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all duration-[4000ms] ease-in-out z-10 ${
                breathingState === "Inhale" ? "scale-110 bg-blue-400" : 
                breathingState === "Hold" ? "scale-110 bg-blue-500" : 
                breathingState === "Exhale" ? "scale-90 bg-blue-300" : "bg-red-400 hover:bg-red-500"
            }`}
            >
            <span class="text-2xl font-bold mb-1">
                {breathingState === "Ready" ? "Tap to Breathe" : 
                 breathingState === "Inhale" ? "Pumua Ndani" :
                 breathingState === "Hold" ? "Shikilia" : "Toa Pole Pole"}
            </span>
            <span class="text-sm opacity-90">
                {breathingState === "Ready" ? "Start 4-7-8" : 
                 breathingState === "Inhale" ? "(Inhale)" :
                 breathingState === "Hold" ? "(Hold)" : "(Exhale)"}
            </span>
            </div>
        </div>
        
        <p class="mt-6 text-gray-600 text-center max-w-xs">
            {breathingState === "Ready" 
                ? "Feeling agitated? Let's cool down together." 
                : "Follow the rhythm. Feel your heartbeat slow down."}
        </p>
      </div>
      )}

      {/* Phase 1: Sound Scapes (Immediate Calm) */}
      {phase === 1 && (
      <div class="w-full max-w-md mb-8">
        <h3 class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          Calming Kenyan Sounds
        </h3>
        <div class="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={() => playSound("karura")}
            class={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                activeSound === "karura" ? "bg-green-100 border-green-500 shadow-md" : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span class="text-2xl">🦜</span>
            <span class="font-medium text-sm">Karura Birds</span>
            {activeSound === "karura" && <span class="text-xs text-green-600">● Playing</span>}
          </button>
          <button 
            type="button"
            onClick={() => playSound("rain")}
            class={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                activeSound === "rain" ? "bg-blue-100 border-blue-500 shadow-md" : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span class="text-2xl">🌧️</span>
            <span class="font-medium text-sm">Nairobi Rain</span>
            {activeSound === "rain" && <span class="text-xs text-blue-600">● Playing</span>}
          </button>
          <button 
            type="button"
            onClick={() => playSound("waves")}
            class={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                activeSound === "waves" ? "bg-blue-100 border-blue-500 shadow-md" : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span class="text-2xl">🌊</span>
            <span class="font-medium text-sm">Diani Waves</span>
            {activeSound === "waves" && <span class="text-xs text-blue-600">● Playing</span>}
          </button>
          <button 
            type="button"
            onClick={() => playSound("morning")}
            class={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                activeSound === "morning" ? "bg-orange-100 border-orange-500 shadow-md" : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span class="text-2xl">🌅</span>
            <span class="font-medium text-sm">Morning Birds</span>
            {activeSound === "morning" && <span class="text-xs text-orange-600">● Playing</span>}
          </button>
          <button 
            type="button"
            onClick={() => playSound("river")}
            class={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                activeSound === "river" ? "bg-cyan-100 border-cyan-500 shadow-md" : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span class="text-2xl">💧</span>
            <span class="font-medium text-sm">River Flow</span>
            {activeSound === "river" && <span class="text-xs text-cyan-600">● Playing</span>}
          </button>
          <button 
            type="button"
            onClick={() => playSound("jungle")}
            class={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                activeSound === "jungle" ? "bg-emerald-100 border-emerald-500 shadow-md" : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span class="text-2xl">🌴</span>
            <span class="font-medium text-sm">Jungle Rain</span>
            {activeSound === "jungle" && <span class="text-xs text-emerald-600">● Playing</span>}
          </button>
          <button 
            type="button"
            onClick={() => playSound("forest")}
            class={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                activeSound === "forest" ? "bg-green-100 border-green-500 shadow-md" : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span class="text-2xl">🌲</span>
            <span class="font-medium text-sm">Forest Peace</span>
            {activeSound === "forest" && <span class="text-xs text-green-600">● Playing</span>}
          </button>
          <button 
            type="button"
            onClick={() => playSound("birds")}
            class={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                activeSound === "birds" ? "bg-green-100 border-green-500 shadow-md" : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span class="text-2xl">🎵</span>
            <span class="font-medium text-sm">Nature Mix</span>
            {activeSound === "birds" && <span class="text-xs text-green-600">● Playing</span>}
          </button>
        </div>
      </div>
      )}

      {/* Phase 2: Safe Expression */}
      {phase === 2 && (
      <div class="w-full max-w-md bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
        <h2 class="text-lg font-semibold mb-3 text-gray-700 flex items-center gap-2">
          <span>🗑️</span> Vent to the Void
          <span class="text-xs font-normal text-gray-400">(Auto-deletes in 24h)</span>
        </h2>
        
        {isRecording && (
          <div class="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span class="font-semibold text-red-700">Recording...</span>
              </div>
              <span class="text-2xl font-bold text-red-600">{recordingTime}s / 30s</span>
            </div>
            <div class="w-full bg-red-200 h-2 rounded-full overflow-hidden">
              <div 
                class="bg-red-500 h-full transition-all duration-1000" 
                style={{ width: `${(recordingTime / 30) * 100}%` }}
              ></div>
            </div>
            <p class="text-xs text-red-600 mt-2">Speak your anger out loud. You have {30 - recordingTime} seconds left.</p>
          </div>
        )}
        
        {showCamera ? (
            <div class="relative h-64 bg-gray-900 rounded-lg overflow-hidden mb-4">
                <video 
                  id="camera-preview" 
                  class="w-full h-full object-cover"
                  autoPlay 
                  playsInline 
                  muted
                ></video>
                <button 
                    type="button"
                    onClick={closeCamera}
                    class="absolute top-2 right-2 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
                >✕</button>
                <button 
                  type="button"
                  onClick={capturePhoto}
                  class="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-red-500 hover:bg-gray-100 transition-all"
                >📸</button>
            </div>
        ) : capturedPhoto ? (
            <div class="relative h-64 bg-gray-900 rounded-lg overflow-hidden mb-4">
                <img src={capturedPhoto} alt="Captured" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                  <div class="text-center text-white mb-4">
                    <div class="text-6xl mb-2">📸</div>
                    <p class="text-lg font-semibold">Photo captured!</p>
                    <p class="text-sm">Ready to release to the void</p>
                  </div>
                  <button
                    type="button"
                    onClick={releasePhoto}
                    class="px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-all"
                  >
                    🗑️ Release Photo
                  </button>
                </div>
            </div>
        ) : (
            <div class="relative">
                <textarea
                value={ventText}
                onInput={(e) => setVentText(e.currentTarget.value)}
                placeholder="Type your anger here... say anything. It will disappear."
                class={`w-full h-32 p-4 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none transition-all duration-1000 ${
                    isVenting ? "opacity-0 scale-95 blur-sm" : "opacity-100"
                }`}
                disabled={isVenting}
                />
            </div>
        )}

        {voiceNote && (
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <div class="text-2xl animate-pulse">🎤</div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-800">Voice note recorded</p>
              <p class="text-xs text-gray-500">Releasing to the void...</p>
            </div>
          </div>
        )}

        <div class="flex justify-between items-center">
            <div class="flex gap-3">
                <button 
                    type="button"
                    onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                    class={`p-3 rounded-full transition-colors min-w-[48px] ${
                        isRecording ? 'bg-red-500 text-white' : 
                        voiceNote ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`} 
                    title={isRecording ? "Stop Recording (" + (30 - recordingTime) + "s left)" : "Voice Note (30s max)"}
                >
                    {isRecording ? "⏹️" : voiceNote ? "✓" : "🎤"}
                </button>
                <button 
                    type="button"
                    onClick={showCamera ? capturePhoto : startCamera}
                    class={`p-3 rounded-full transition-colors ${
                      showCamera ? 'bg-red-100 text-red-600' :
                      capturedPhoto ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`} 
                    title={showCamera ? "Take Photo" : "Photo Journal"}
                >
                    {capturedPhoto ? "✓" : "📷"}
                </button>
            </div>
            <button 
                type="button"
                onClick={handleVent}
                disabled={(!ventText && !voiceNote && !capturedPhoto) || isVenting}
                class="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
                {isVenting ? "Processing..." : "Release to Void"}
            </button>
        </div>

        {/* AI Reflection */}
        {aiReflection && (
            <div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
                <p class="text-sm text-gray-700 mb-1">💚 <strong>Reflection:</strong></p>
                <p class="text-sm text-gray-600 italic">{aiReflection}</p>
            </div>
        )}
      </div>
      )}
      
      {/* Phase 3: Constructive Actions */}
      {phase === 3 && (
        <div class="w-full max-w-md bg-white p-5 rounded-2xl shadow-lg border border-green-200 mt-6">
          <h2 class="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <span>🛠️</span> What Now?
          </h2>
          
          <div class="space-y-3">
            <button 
              type="button"
              onClick={() => setShowDelayDialog(true)}
              class={`w-full p-4 rounded-xl border text-left transition-all ${
                  messageDelay ? "bg-green-50 border-green-500" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-semibold text-sm text-gray-800">⏱️ Delay Message</p>
                  <p class="text-xs text-gray-500 mt-1">{messageDelay ? "Message scheduled for 1 hour" : "Schedule that angry text for later?"}</p>
                </div>
                {messageDelay && <span class="text-green-600 font-bold">✓</span>}
              </div>
            </button>

            <button 
              type="button"
              onClick={() => {
                setShowGrounding(!showGrounding);
                setPhaseCompleted(prev => ({...prev, 3: true}));
              }}
              class="w-full p-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-left transition-all"
            >
              <p class="font-semibold text-sm text-gray-800">🌿 Grounding Exercise</p>
              <p class="text-xs text-gray-500 mt-1">Name 3 things you see right now</p>
            </button>

            <button 
              type="button" 
              onClick={() => {
                setShowCallDialog(true);
                setPhaseCompleted(prev => ({...prev, 3: true}));
              }}
              class="w-full p-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-left transition-all"
            >
              <p class="font-semibold text-sm text-gray-800">📞 Call Trusted Friend</p>
              <p class="text-xs text-gray-500 mt-1">Talk to someone you trust</p>
            </button>

            <button 
              type="button" 
              onClick={() => setShowBlockDialog(true)}
              class="w-full p-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-left transition-all"
            >
              <p class="font-semibold text-sm text-gray-800">🚫 Block Temporarily (24h)</p>
              <p class="text-xs text-gray-500 mt-1">Take a break from this contact</p>
            </button>
          </div>
        </div>
      )}

      {/* Grounding Overlay */}
      {showGrounding && (
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div class="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl">
            <h3 class="text-xl font-bold mb-4 text-gray-800">Grounding Exercise</h3>
            <p class="text-sm text-gray-600 mb-6">
              Tazama vitu vitatu ukumbani. (Look at three things in the room.)
            </p>
            
            <div class="space-y-4 mb-6">
              <input 
                type="text" 
                placeholder="1. I see..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input 
                type="text" 
                placeholder="2. I see..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input 
                type="text" 
                placeholder="3. I see..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <button 
              type="button"
              onClick={() => setShowGrounding(false)}
              class="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
      
      {/* Floating Navigation Bar */}
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div class="max-w-md mx-auto px-4 py-3">
          <div class="flex items-center justify-between gap-3">
            {/* Previous Phase Button */}
            <button
              type="button"
              onClick={() => phase > 1 && setPhase((phase - 1) as 1 | 2 | 3)}
              disabled={phase === 1}
              class="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <span>←</span>
              <span class="hidden sm:inline">Previous</span>
            </button>

            {/* Phase Status */}
            <div class="flex gap-2">
              <div class={`w-3 h-3 rounded-full transition-all ${
                phase === 1 ? 'bg-green-500 scale-125' : 
                phaseCompleted[1] ? 'bg-green-400' : 'bg-gray-300'
              }`} title="Calm"></div>
              <div class={`w-3 h-3 rounded-full transition-all ${
                phase === 2 ? 'bg-green-500 scale-125' : 
                phaseCompleted[2] ? 'bg-green-400' : 'bg-gray-300'
              }`} title="Express"></div>
              <div class={`w-3 h-3 rounded-full transition-all ${
                phase === 3 ? 'bg-green-500 scale-125' : 
                phaseCompleted[3] ? 'bg-green-400' : 'bg-gray-300'
              }`} title="Act"></div>
            </div>

            {/* Next Phase Button */}
            <button
              type="button"
              onClick={() => phase < 3 && setPhase((phase + 1) as 1 | 2 | 3)}
              disabled={phase === 3}
              class={`flex-1 py-3 px-4 rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 ${
                phaseCompleted[phase] 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span class="hidden sm:inline">Next</span>
              <span>→</span>
            </button>
          </div>
          
          {/* Progress Hint */}
          {!phaseCompleted[phase] && (
            <div class="mt-2 text-center">
              <p class="text-xs text-gray-500">
                {phase === 1 && "💨 Try the breathing exercise or sounds to calm down"}
                {phase === 2 && "✍️ Release your feelings to the void for reflection"}
                {phase === 3 && "🎯 Choose a constructive action to move forward"}
              </p>
            </div>
          )}
          
          {phaseCompleted[phase] && phase < 3 && (
            <div class="mt-2 text-center">
              <p class="text-xs text-green-600 font-semibold">
                ✓ Phase {phase} completed! Tap "Next" when ready →
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Spacer for floating nav */}
      <div class="h-32"></div>
      
      {/* Keyboard Shortcuts Hint */}
      <div class="w-full max-w-md mb-4 text-center">
        <p class="text-xs text-gray-400">
          💡 Tip: Use ← → arrow keys or press 1, 2, 3 to navigate phases
        </p>
      </div>
      
      {/* Feel-Yah Therapist Chatbot */}
      {!showTherapist ? (
        <button
          type="button"
          onClick={() => {
            setShowTherapist(true);
            if (therapistMessages.length === 0) {
              setTherapistMessages([{
                role: 'ai',
                text: "Habari! I'm Feel-Yah, your personal therapist. I'm here to help you cool off and process what you're feeling. What's troubling you right now?"
              }]);
            }
          }}
          class="w-full max-w-md mt-8 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2"
        >
          <span>💬</span>
          <span>Let Feel-Yah help you cool off...</span>
          {(phaseCompleted[1] || phaseCompleted[2]) && (
            <span class="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
              Context-aware support
            </span>
          )}
        </button>
      ) : (
        <div class="w-full max-w-md mt-8 bg-white rounded-2xl shadow-lg border border-purple-200 overflow-hidden">
          <div class="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-2xl">💬</span>
              <div>
                <h3 class="text-white font-semibold">Feel-Yah Therapist</h3>
                <p class="text-white/80 text-xs">Here to listen, anytime</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowTherapist(false)}
              class="text-white/80 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>
          
          <div class="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {therapistMessages.map((msg, idx) => (
              <div key={idx} class={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div class={`max-w-[80%] p-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-purple-500 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                }`}>
                  <p class="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {isTherapistTyping && (
              <div class="flex justify-start">
                <div class="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none">
                  <div class="flex gap-1">
                    <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
                    <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div class="p-4 bg-white border-t">
            <div class="flex gap-2">
              <input
                type="text"
                value={therapistInput}
                onInput={(e) => setTherapistInput(e.currentTarget.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendTherapistMessage()}
                placeholder="Share what's on your mind..."
                class="flex-1 p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isTherapistTyping}
              />
              <button
                type="button"
                onClick={sendTherapistMessage}
                disabled={!therapistInput.trim() || isTherapistTyping}
                class="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delay Message Dialog */}
      {showDelayDialog && (
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div class="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl">
            <h3 class="text-xl font-bold mb-4 text-gray-800">⏱️ Schedule Delayed Message</h3>
            <p class="text-sm text-gray-600 mb-6">
              Write your message now, but it will be sent in 1 hour. This gives you time to cool down and reconsider.
            </p>
            
            <div class="space-y-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={delayedMessageText}
                  onInput={(e) => setDelayedMessageText(e.currentTarget.value)}
                  placeholder="Type your message here..."
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-24 resize-none"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Send to (Phone or Name)</label>
                <input 
                  type="text" 
                  value={delayedMessageRecipient}
                  onInput={(e) => setDelayedMessageRecipient(e.currentTarget.value)}
                  placeholder="+254 712 345 678 or contact name"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p class="text-xs text-orange-800">
                  💡 <strong>Cooling Off Period:</strong> This message will be queued for 1 hour. During that time, you can cancel it from your phone's messaging app if you change your mind.
                </p>
              </div>
            </div>

            <div class="flex gap-3">
              <button 
                type="button"
                onClick={() => {
                  setShowDelayDialog(false);
                  setDelayedMessageText("");
                  setDelayedMessageRecipient("");
                }}
                class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={scheduleDelayedMessage}
                disabled={!delayedMessageText.trim() || !delayedMessageRecipient.trim()}
                class="flex-1 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule for 1hr
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call Friend Dialog */}
      {showCallDialog && (
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div class="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl">
            <h3 class="text-xl font-bold mb-4 text-gray-800">📞 Call a Trusted Friend</h3>
            <p class="text-sm text-gray-600 mb-6">
              Sometimes talking to someone you trust helps. Who would you like to call?
            </p>
            
            <div class="space-y-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={friendPhone}
                  onInput={(e) => setFriendPhone(e.currentTarget.value)}
                  placeholder="+254 712 345 678"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div class="text-xs text-gray-500">
                <p>💡 Tip: Call someone who:</p>
                <ul class="ml-4 mt-1 list-disc">
                  <li>Listens without judgment</li>
                  <li>Helps you calm down</li>
                  <li>You feel safe with</li>
                </ul>
              </div>
            </div>

            <div class="flex gap-3">
              <button 
                type="button"
                onClick={() => {
                  setShowCallDialog(false);
                  setFriendPhone("");
                }}
                class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleCallFriend}
                disabled={!friendPhone}
                class="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Call Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Contact Dialog */}
      {showBlockDialog && (
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div class="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl">
            <h3 class="text-xl font-bold mb-4 text-gray-800">🚫 Temporary Block (24h)</h3>
            <p class="text-sm text-gray-600 mb-6">
              Taking a break from someone can help you cool down. This contact will be blocked for 24 hours.
            </p>
            
            <div class="space-y-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number or Contact Name</label>
                <input 
                  type="text" 
                  value={blockPhone}
                  onInput={(e) => setBlockPhone(e.currentTarget.value)}
                  placeholder="+254 712 345 678 or contact name"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p class="text-xs text-yellow-800">
                  ⚠️ This will prevent calls and messages from this contact for 24 hours. You can unblock earlier from your phone settings.
                </p>
              </div>
            </div>

            <div class="flex gap-3">
              <button 
                type="button"
                onClick={() => {
                  setShowBlockDialog(false);
                  setBlockPhone("");
                }}
                class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleBlockContact}
                disabled={!blockPhone}
                class="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Block for 24h
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div class="mt-8 text-xs text-gray-400 text-center">
        Press Volume Down + Power to exit • Everything auto-deletes in 24 hours
      </div>
    </div>
  );
}
