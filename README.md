# Studio Vault & Acoustic Key/BPM Lab

A suite designed for two high-performance tasks:
1. **Extreme GB Photo & RAW File Asset Manager**: Handling massive multi-gigabyte photography files (Phase One, Hasselblad, Sony ARW, Canon CR3, Nikon NEF, DNG, and gigapixel panoramic TIFFs) with zero-RAM memory leaks using chunked streaming hashes, duplicate finding, and smart reorganization.
2. **Audio Key & BPM Analyzer**: Automatically extracts musical key (with Camelot Wheel notation for DJ harmonic mixing) and tempo (BPM) from any song link or audio stream.

---

## 1. Interactive Web Application
Launch the dev server or open the AI Studio preview:
- **Tab 1: Extreme Photo Vault**: Inspect multi-gigabyte archives, use the Native File System Access API (`showDirectoryPicker`) to directly mount your local high-res folders without uploading to any server, detect duplicate files, zoom up to 400% on gigapixel canvas, and preview batch organization manifests.
- **Tab 2: Audio Key & BPM Analyzer**: Paste direct audio links or stream URLs, or click built-in EDM, House, Trap, and Synthwave presets. Analyzes the audio using Web Audio API FFT chromagrams and autocorrelation to determine Key, Scale, Camelot notation, and BPM, with waveform scrub and tap-tempo verification.
- **Tab 3: Native Python & CLI**: View and copy command-line instructions.

---

## 2. Standalone Native Python CLI Tools

If you prefer running standalone Python scripts on your machine for multi-terabyte photo drives or command-line audio analysis:

### Dependencies
```bash
pip install -r requirements.txt
```

### Tool 1: Extreme Photo Manager (`extreme_photo_manager.py`)
```bash
# Scan a folder of massive RAW photos and find duplicates:
python extreme_photo_manager.py /path/to/photos --find-duplicates

# Plan smart reorganization by date (YYYY/YYYY-MM):
python extreme_photo_manager.py /path/to/photos --organize-to /path/to/organized --organize-mode date

# Execute actual moves (not dry-run):
python extreme_photo_manager.py /path/to/photos --organize-to /path/to/organized --execute

# Export complete metadata manifest as JSON:
python extreme_photo_manager.py /path/to/photos --output-json manifest.json
```

### Tool 2: Song Key & BPM Analyzer (`audio_key_bpm_analyzer.py`)
```bash
# Analyze direct audio link:
python audio_key_bpm_analyzer.py "https://example.com/audio/song.mp3"

# Analyze YouTube or SoundCloud link:
python audio_key_bpm_analyzer.py "https://www.youtube.com/watch?v=..."

# Analyze local audio file:
python audio_key_bpm_analyzer.py ./my_track.wav

# Output machine-readable JSON:
python audio_key_bpm_analyzer.py "https://example.com/song.mp3" --json
```
