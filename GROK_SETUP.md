# Groq API Setup for Pumzika Mode

## ✅ API Key Already Configured!

Your Groq API key is already set up in the `.env` file. The anger management interface will now use **Groq's ultra-fast LLM inference** (Llama 3.3 70B) for culturally-aware reflections.

## How It Works

When users vent their anger in the "Vent to the Void" section:

1. Their text is sent to `/api/grok-reflection`
2. The API calls Groq's Llama 3.3 70B model with a culturally-aware prompt
3. Groq responds in ~500ms with empathetic, Kenyan-context validation
4. The response includes Swahili phrases like "Pole sana" or "Hasira hasara"

## Testing Right Now

1. Navigate to **http://localhost:8000/anger-mode**
2. Click on phase labels to navigate: **1. Calm → 2. Express → 3. Act**
3. In Phase 1: Try the breathing exercise and click sound buttons (they now generate calming tones!)
4. In Phase 2: Type something in "Vent to the Void" and click "Release to Void"
5. Watch for the AI reflection from Groq (appears after ~1 second)

## What's Fixed

✅ **Phase Navigation**: Click on "1. Calm", "2. Express", or "3. Act" to jump between phases  
✅ **Working Sounds**: Click Karura Birds, Nairobi Rain, Diani Waves, or Nature Mix to hear calming tones  
✅ **Groq AI Integration**: Real-time empathetic responses using your API key  
✅ **Auto-progression**: Venting in Phase 2 automatically moves you to Phase 3 (constructive actions)

## Sound Technology

Since we don't have audio files yet, the app uses **Web Audio API** to generate calming ambient tones:
- **Karura Birds**: 220Hz sine wave (bird-like)
- **Nairobi Rain**: 150Hz triangle wave (low rumble)
- **Diani Waves**: 180Hz triangle wave (ocean-like)
- **Nature Mix**: 250Hz sine wave (mixed nature)

Each sound has gentle vibrato for a more natural feel.

## API Costs

- Groq is extremely affordable: ~$0.00005 per reflection (practically free!)
- Much faster than OpenAI (500ms vs 3-5 seconds)
- 150 token limit per response keeps costs minimal
