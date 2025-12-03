# Sound Files Setup Guide

## Download Instructions

I've expanded the sound library to 8 calming Kenyan ambient sounds. To make them work with real audio files:

### Recommended Sounds from Mixkit (Free License)

Visit https://mixkit.co/free-sound-effects/ and download these:

1. **Karura Birds** (karura.mp3)
   - Search: "forest birds singing" or "morning birds"
   - Recommendation: "Little birds singing in the trees" (0:08)
   - Alternative: "Forest with birds singing" (1:38)

2. **Nairobi Rain** (rain.mp3)
   - Search: "rain" in sound effects
   - Recommendation: "Jungle rain and birds" (1:20)
   - Alternative: "Rain in the jungle and birds" (0:30)

3. **Diani Waves** (waves.mp3)
   - Search: "waves" or "ocean"
   - Recommendation: "Sea waves with birds loop" (0:38)
   - Look for gentle coastal ambience

4. **Morning Birds** (morning.mp3)
   - Search: "morning birds"
   - Recommendation: "Morning birds singing" (2:00)
   - Alternative: "Morning sound in a garden" (1:50)

5. **River Flow** (river.mp3)
   - Search: "river"
   - Recommendation: "River in the forest with birds" (1:35)
   - Alternative: "Sounds of the river and birds" (1:00)

6. **Jungle Rain** (jungle.mp3)
   - Search: "jungle"
   - Recommendation: "Birds in the jungle" (1:00)
   - Alternative: "Birds chirping in the jungle" (0:06 - loop this)

7. **Forest Peace** (forest.mp3)
   - Search: "forest ambience"
   - Recommendation: "Forest birds ambience" (2:31)
   - Alternative: "Birds in the spring forest" (1:22)

8. **Nature Mix** (birds.mp3)
   - Search: "natural ambience"
   - Recommendation: "Natural ambience with flowing water and birds" (0:48)
   - Alternative: "European forest ambience" (2:41)

## Installation Steps

1. **Download** the sound files from Mixkit
2. **Rename** them to match the names above:
   - karura.mp3
   - rain.mp3
   - waves.mp3
   - morning.mp3
   - river.mp3
   - jungle.mp3
   - forest.mp3
   - birds.mp3

3. **Place** all files in: `/static/sounds/`

4. **Test** by visiting http://localhost:8001/anger-mode

## How It Works

The updated code now:
1. **Tries to load** actual MP3 files from `/sounds/` folder
2. **Falls back** to Web Audio API synthetic tones if files don't exist
3. **Auto-loops** all sounds for continuous ambient experience
4. **Volume** set to 40% for comfortable listening

## Alternative Free Sources

If Mixkit doesn't have what you need:

- **Freesound.org** - Massive library with Creative Commons sounds
- **BBC Sound Effects** - Professional quality, free for personal use
- **YouTube Audio Library** - Royalty-free ambient sounds
- **Zapsplat** - Free with attribution

## Kenyan-Specific Sounds

For authentic Kenyan ambience:
- Record at Karura Forest (bird sounds)
- Coastal recordings from Diani/Malindi
- Nairobi rain during long rains season
- Aberdare forest ambience
- Rift Valley sounds

## Current Status

Right now, the app works with:
- ✅ 8 sound buttons (4 → 8 expanded)
- ✅ Fallback synthetic tones (working immediately)
- ⏳ Real MP3 support (waiting for files in /static/sounds/)

No files downloaded yet = synthetic tones play
Files added = real ambient sounds play automatically!
