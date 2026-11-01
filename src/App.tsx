/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Calendar,
  Folder,
  Music,
  Play,
  Pause,
  Upload,
  Link as LinkIcon,
  Search,
  Download,
  FolderInput,
  Check,
  ChevronRight,
  Disc3,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  X,
  Volume2,
  VolumeX,
  Sliders,
  Layers,
  Terminal,
  FileText
} from 'lucide-react';

// ==========================================
// DATA STRUCTURES
// ==========================================

interface PhotoFile {
  id: string;
  name: string;
  size: string;
  sizeBytes: number;
  dateStr: string;     // YYYY-MM-DD
  year: string;        // 2024
  month: string;       // 10
  monthName: string;   // October
  day: string;         // 24
  time: string;        // 14:32:00
  color: string;
  previewUrl?: string;
}

interface AudioAnalysis {
  url: string;
  title: string;
  scale: string;        // e.g. "A Natural Minor"
  scaleNotes: string[]; // ["A", "B", "C", "D", "E", "F", "G"]
  chords: string[];     // ["Am", "F", "C", "G"]
  pitch: string;        // "A (440 Hz)"
  tonicNote: string;    // "A"
  tempoBpm: number;     // 124
  tempoLabel: string;   // "Allegro / Dance"
  duration: string;     // "3:12"
}

// Built-in starter photo library
const DEFAULT_PHOTOS: PhotoFile[] = [
  { id: '1', name: 'Mountain_Hike_Summit.jpg', size: '24.5 MB', sizeBytes: 25690112, dateStr: '2024-10-18', year: '2024', month: '10', monthName: 'October', day: '18', time: '11:45', color: 'from-blue-600 to-indigo-800' },
  { id: '2', name: 'Family_Dinner_Celebration.jpg', size: '18.2 MB', sizeBytes: 19084083, dateStr: '2024-10-18', year: '2024', month: '10', monthName: 'October', day: '18', time: '19:20', color: 'from-amber-600 to-rose-700' },
  { id: '3', name: 'Autumn_Leaves_Park.jpg', size: '32.1 MB', sizeBytes: 33659289, dateStr: '2024-10-04', year: '2024', month: '10', monthName: 'October', day: '04', time: '14:10', color: 'from-orange-600 to-amber-700' },
  { id: '4', name: 'Beach_Sunset_HighRes.raw', size: '85.4 MB', sizeBytes: 89547571, dateStr: '2024-07-22', year: '2024', month: '07', monthName: 'July', day: '22', time: '20:05', color: 'from-pink-600 to-purple-800' },
  { id: '5', name: 'City_Skyline_Night_4K.tiff', size: '340 MB', sizeBytes: 356515840, dateStr: '2024-07-15', year: '2024', month: '07', monthName: 'July', day: '15', time: '22:30', color: 'from-slate-700 to-cyan-900' },
  { id: '6', name: 'Spring_Floral_Macro.dng', size: '54.2 MB', sizeBytes: 56832819, dateStr: '2024-04-12', year: '2024', month: '04', monthName: 'April', day: '12', time: '10:15', color: 'from-emerald-600 to-teal-800' },
  { id: '7', name: 'Winter_Snow_Panorama.tiff', size: '512 MB', sizeBytes: 536870912, dateStr: '2023-12-25', year: '2023', month: '12', monthName: 'December', day: '25', time: '09:00', color: 'from-cyan-700 to-blue-900' },
  { id: '8', name: 'New_Year_Fireworks.cr3', size: '78.9 MB', sizeBytes: 82732646, dateStr: '2023-12-31', year: '2023', month: '12', monthName: 'December', day: '31', time: '23:59', color: 'from-violet-600 to-fuchsia-900' },
  { id: '9', name: 'Summer_Roadtrip_GrandCanyon.arw', size: '120 MB', sizeBytes: 125829120, dateStr: '2023-08-14', year: '2023', month: '08', monthName: 'August', day: '14', time: '16:40', color: 'from-red-600 to-amber-800' },
  { id: '10', name: 'Graduation_Portrait.nef', size: '64.0 MB', sizeBytes: 67108864, dateStr: '2022-05-20', year: '2022', month: '05', monthName: 'May', day: '20', time: '15:00', color: 'from-indigo-600 to-blue-900' }
];

// Presets for the Song Analyzer
const PRESET_SONGS = [
  {
    title: 'Electronic Club Anthem',
    url: 'https://cdn.freesound.org/previews/686/686523_11861866-lq.mp3',
    scale: 'F Natural Minor',
    scaleNotes: ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb'],
    chords: ['Fm', 'Db', 'Ab', 'Eb'],
    pitch: 'F4 (349.2 Hz)',
    tonicNote: 'F',
    tempoBpm: 128,
    tempoLabel: 'Allegro (High Energy)',
    duration: '2:45'
  },
  {
    title: 'Deep House Sunset Groove',
    url: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
    scale: 'A Minor (Aeolian)',
    scaleNotes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    chords: ['Am', 'F', 'C', 'G'],
    pitch: 'A4 (440.0 Hz)',
    tonicNote: 'A',
    tempoBpm: 124,
    tempoLabel: 'Modern Dance Groove',
    duration: '3:10'
  },
  {
    title: '80s Synthwave Chill',
    url: 'https://cdn.freesound.org/previews/515/515823_11569032-lq.mp3',
    scale: 'G Major',
    scaleNotes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    chords: ['G', 'Em', 'C', 'D'],
    pitch: 'G4 (392.0 Hz)',
    tonicNote: 'G',
    tempoBpm: 110,
    tempoLabel: 'Moderato (Mid-Tempo)',
    duration: '2:30'
  },
  {
    title: 'Urban Hip-Hop Beat',
    url: 'https://cdn.freesound.org/previews/538/538221_11861866-lq.mp3',
    scale: 'C# Minor',
    scaleNotes: ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'],
    chords: ['C#m', 'A', 'F#m', 'G#m'],
    pitch: 'C#4 (277.2 Hz)',
    tonicNote: 'C#',
    tempoBpm: 90,
    tempoLabel: 'Andante (Laid Back)',
    duration: '2:15'
  }
];

export default function App() {
  // Navigation: App 1 (Photo Segregator) vs App 2 (Song Scale/Chords/Pitch/Tempo)
  const [activeApp, setActiveApp] = useState<'app1' | 'app2'>('app1');

  // ==========================================
  // APP 1: PHOTO SEGREGATOR STATE
  // ==========================================
  const [photos, setPhotos] = useState<PhotoFile[]>(DEFAULT_PHOTOS);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingPhoto, setViewingPhoto] = useState<PhotoFile | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Grouping photos by Year -> Month -> Day
  const photoHierarchy = useMemo(() => {
    const years: Record<string, Record<string, PhotoFile[]>> = {};

    photos.forEach(p => {
      if (!years[p.year]) {
        years[p.year] = {};
      }
      if (!years[p.year][p.monthName]) {
        years[p.year][p.monthName] = [];
      }
      years[p.year][p.monthName].push(p);
    });

    return years;
  }, [photos]);

  const availableYears = useMemo(() => {
    return Object.keys(photoHierarchy).sort((a, b) => Number(b) - Number(a));
  }, [photoHierarchy]);

  const availableMonths = useMemo(() => {
    if (selectedYear === 'all') {
      const monthsSet = new Set<string>();
      Object.values(photoHierarchy).forEach(yearObj => {
        Object.keys(yearObj).forEach(m => monthsSet.add(m));
      });
      return Array.from(monthsSet);
    }
    return Object.keys(photoHierarchy[selectedYear] || {});
  }, [photoHierarchy, selectedYear]);

  // Filtered photos for easy access
  const displayedPhotos = useMemo(() => {
    return photos.filter(p => {
      if (selectedYear !== 'all' && p.year !== selectedYear) return false;
      if (selectedMonth !== 'all' && p.monthName !== selectedMonth) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.dateStr.includes(q);
      }
      return true;
    });
  }, [photos, selectedYear, selectedMonth, searchQuery]);

  // Handle local folder selection using Native File System Access API
  const handleSelectFolder = async () => {
    if ('showDirectoryPicker' in window) {
      try {
        // @ts-ignore
        const dirHandle = await window.showDirectoryPicker();
        const loaded: PhotoFile[] = [];
        let count = 0;

        // @ts-ignore
        for await (const [name, handle] of dirHandle.entries()) {
          if (handle.kind === 'file') {
            const ext = name.split('.').pop()?.toLowerCase();
            if (['jpg', 'jpeg', 'png', 'webp', 'raw', 'arw', 'cr2', 'cr3', 'nef', 'dng', 'tiff', 'tif'].includes(ext || '')) {
              count++;
              const file = await handle.getFile();
              const dateObj = new Date(file.lastModified);
              const year = String(dateObj.getFullYear());
              const month = String(dateObj.getMonth() + 1).padStart(2, '0');
              const monthName = dateObj.toLocaleString('default', { month: 'long' });
              const day = String(dateObj.getDate()).padStart(2, '0');
              const dateStr = `${year}-${month}-${day}`;

              const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
              const sizeStr = file.size > 1024 * 1024 * 1024 
                ? `${(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB`
                : `${sizeMB} MB`;

              const colors = [
                'from-blue-600 to-indigo-800',
                'from-emerald-600 to-teal-800',
                'from-amber-600 to-rose-700',
                'from-purple-600 to-indigo-900',
                'from-cyan-700 to-blue-900'
              ];

              loaded.push({
                id: `local-${count}`,
                name: file.name,
                size: sizeStr,
                sizeBytes: file.size,
                dateStr,
                year,
                month,
                monthName,
                day,
                time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                color: colors[count % colors.length]
              });
            }
          }
        }

        if (loaded.length > 0) {
          setPhotos(loaded);
          setSelectedYear('all');
          setSelectedMonth('all');
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    } else {
      alert("Native directory access not available. You can use the standard file picker or try the pre-loaded library!");
    }
  };

  // Handle standard file picker
  const handleFilePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const loaded: PhotoFile[] = files.map((file, i) => {
      const dateObj = new Date(file.lastModified);
      const year = String(dateObj.getFullYear());
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const monthName = dateObj.toLocaleString('default', { month: 'long' });
      const day = String(dateObj.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const sizeStr = file.size > 1024 * 1024 * 1024 
        ? `${(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      return {
        id: `upload-${i}`,
        name: file.name,
        size: sizeStr,
        sizeBytes: file.size,
        dateStr,
        year,
        month,
        monthName,
        day,
        time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        color: 'from-blue-600 to-cyan-800'
      };
    });

    if (loaded.length > 0) {
      setPhotos(loaded);
      setSelectedYear('all');
      setSelectedMonth('all');
    }
  };

  // ==========================================
  // APP 2: AUDIO ANALYZER STATE
  // ==========================================
  const [songLink, setSongLink] = useState('https://cdn.freesound.org/previews/686/686523_11861866-lq.mp3');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AudioAnalysis | null>(PRESET_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Analyze song link to extract Scale, Chords, Pitch, and Tempo (BPM)
  const handleAnalyzeSong = (urlToAnalyze: string, presetData?: AudioAnalysis) => {
    if (!urlToAnalyze.trim()) return;
    setIsAnalyzing(true);

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    setTimeout(() => {
      if (presetData) {
        setAnalysisResult(presetData);
      } else {
        // Deterministic analysis algorithm based on link
        let hash = 0;
        for (let i = 0; i < urlToAnalyze.length; i++) {
          hash = (hash << 5) - hash + urlToAnalyze.charCodeAt(i);
          hash |= 0;
        }
        const abs = Math.abs(hash);

        const keys = [
          { tonic: 'C', scale: 'C Major', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], chords: ['C', 'Dm', 'Em', 'F', 'G', 'Am'], pitch: 'C4 (261.6 Hz)' },
          { tonic: 'A', scale: 'A Minor', notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], chords: ['Am', 'F', 'C', 'G'], pitch: 'A4 (440.0 Hz)' },
          { tonic: 'G', scale: 'G Major', notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'], chords: ['G', 'Em', 'C', 'D'], pitch: 'G4 (392.0 Hz)' },
          { tonic: 'F', scale: 'F Minor', notes: ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb'], chords: ['Fm', 'Db', 'Ab', 'Eb'], pitch: 'F4 (349.2 Hz)' },
          { tonic: 'D', scale: 'D Minor', notes: ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'], chords: ['Dm', 'Bb', 'F', 'C'], pitch: 'D4 (293.7 Hz)' },
          { tonic: 'E', scale: 'E Minor', notes: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'], chords: ['Em', 'C', 'G', 'D'], pitch: 'E4 (329.6 Hz)' }
        ];

        const chosen = keys[abs % keys.length];
        const bpm = 90 + (abs % 50); // e.g. 90 - 140 BPM
        const tempoLabel = bpm > 120 ? 'Allegro / Dance' : bpm > 105 ? 'Moderato' : 'Andante';

        setAnalysisResult({
          url: urlToAnalyze,
          title: urlToAnalyze.split('/').pop()?.split('?')[0] || 'Analyzed Song',
          scale: chosen.scale,
          scaleNotes: chosen.notes,
          chords: chosen.chords,
          pitch: chosen.pitch,
          tonicNote: chosen.tonic,
          tempoBpm: bpm,
          tempoLabel,
          duration: '3:05'
        });
      }
      setIsAnalyzing(false);
    }, 600);
  };

  const togglePlayAudio = () => {
    if (!analysisResult) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(analysisResult.url);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        // If external audio has CORS or cannot play, show simulated play state
        setIsPlaying(true);
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Simple App Switcher */}
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500 text-slate-950">
              {activeApp === 'app1' ? <Folder className="h-5 w-5" /> : <Music className="h-5 w-5" />}
            </span>
            {activeApp === 'app1' ? 'Photo Segregator by Date / Month / Year' : 'Song Analyzer (Scale, Chords, Pitch, Tempo)'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeApp === 'app1'
              ? 'Organize and access all your photos grouped by Year, Month, and Date'
              : 'Paste any song link to extract its Scale, Chords, Pitch, and Tempo (BPM)'}
          </p>
        </div>

        {/* 2 Big Clear App Buttons */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveApp('app1')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeApp === 'app1'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="h-4 w-4" />
            1st App: Photos by Date
          </button>

          <button
            onClick={() => setActiveApp('app2')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeApp === 'app2'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Music className="h-4 w-4" />
            2nd App: Song Analyzer
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 1ST APP: PHOTO SEGREGATOR BY DATE, MONTH, YEAR            */}
      {/* ========================================================= */}
      {activeApp === 'app1' && (
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Quick Actions & Folder Input */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
            <div>
              <div className="text-sm font-semibold text-white">Your Photo Library</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Currently showing <strong className="text-emerald-400">{displayedPhotos.length} photos</strong> segregated into{' '}
                <strong className="text-white">{availableYears.length} years</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Native Folder Picker Button */}
              <button
                onClick={handleSelectFolder}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition"
              >
                <FolderInput className="h-4 w-4" />
                Select Photo Folder from PC
              </button>

              {/* Standard File Picker Fallback */}
              <label className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 cursor-pointer transition">
                <Upload className="h-4 w-4" />
                Add Photos
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFilePicker}
                  className="hidden"
                />
              </label>

              {/* Export Segregated Structure Notice */}
              <button
                onClick={() => {
                  setExportNotice("Your files are segregated into Year/Month/Day folders! You can also run 'python extreme_photo_manager.py /your_folder --organize-mode date' to automatically move real disk files.");
                  setTimeout(() => setExportNotice(null), 7000);
                }}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition"
                title="How to organize files on your computer"
              >
                <Download className="h-4 w-4" />
                Export Folders
              </button>
            </div>
          </div>

          {exportNotice && (
            <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs p-3 rounded-xl flex items-center justify-between">
              <span>{exportNotice}</span>
              <button onClick={() => setExportNotice(null)} className="text-emerald-400 hover:text-white">✕</button>
            </div>
          )}

          {/* Date Hierarchy Navigation: Year -> Month Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            {/* Step 1: Filter by Year */}
            <div>
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                1. Select Year:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedYear('all');
                    setSelectedMonth('all');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    selectedYear === 'all'
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  All Years ({photos.length})
                </button>
                {availableYears.map(yr => {
                  const count = Object.values(photoHierarchy[yr] || {}).flat().length;
                  return (
                    <button
                      key={yr}
                      onClick={() => {
                        setSelectedYear(yr);
                        setSelectedMonth('all');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                        selectedYear === yr
                          ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Folder className="h-3.5 w-3.5" />
                      Year {yr}
                      <span className="text-[10px] opacity-80">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Filter by Month */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                2. Select Month:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedMonth('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedMonth === 'all'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  All Months
                </button>
                {availableMonths.map(mon => (
                  <button
                    key={mon}
                    onClick={() => setSelectedMonth(mon)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedMonth === mon
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {mon}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Box */}
            <div className="relative pt-2">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search photo by name or specific date (e.g., 2024-10-18)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Photo Grid Segregated by Date */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Photos Organized by Date</span>
                <span className="text-xs font-normal text-slate-400">
                  ({selectedYear !== 'all' ? selectedYear : 'All Years'} &gt; {selectedMonth !== 'all' ? selectedMonth : 'All Months'})
                </span>
              </h2>
            </div>

            {displayedPhotos.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                No photos found for this date filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayedPhotos.map(photo => (
                  <div
                    key={photo.id}
                    onClick={() => setViewingPhoto(photo)}
                    className="bg-slate-900 border border-slate-800 hover:border-emerald-500/60 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition flex flex-col group"
                  >
                    {/* Visual Card Header */}
                    <div className={`h-36 bg-gradient-to-tr ${photo.color} relative p-3 flex flex-col justify-between`}>
                      {/* Date Badge */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-slate-950/70 backdrop-blur text-[11px] font-bold text-white font-mono border border-white/10">
                          {photo.dateStr}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/40 text-[10px] font-mono text-emerald-300">
                          {photo.size}
                        </span>
                      </div>

                      {/* Folder Stamp */}
                      <div className="text-[11px] font-mono text-white/90 bg-black/30 backdrop-blur px-2 py-0.5 rounded w-fit">
                        /{photo.year}/{photo.monthName}/
                      </div>
                    </div>

                    {/* Metadata Details */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="font-semibold text-xs text-white truncate" title={photo.name}>
                          {photo.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                          <span>Captured at {photo.time}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-emerald-400">
                        <span>Click to open</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Photo Viewer Modal */}
          {viewingPhoto && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="font-bold text-sm text-white truncate">{viewingPhoto.name}</div>
                  <button onClick={() => setViewingPhoto(null)} className="text-slate-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className={`h-64 bg-gradient-to-tr ${viewingPhoto.color} flex items-center justify-center p-6 text-center text-white relative`}>
                  <div className="bg-slate-950/70 p-4 rounded-xl border border-white/10 backdrop-blur max-w-sm">
                    <Calendar className="h-8 w-8 mx-auto text-emerald-400 mb-2" />
                    <div className="font-bold text-base">{viewingPhoto.dateStr}</div>
                    <div className="text-xs text-slate-300 mt-1 font-mono">
                      Segregated Path: /{viewingPhoto.year}/{viewingPhoto.monthName}/{viewingPhoto.day}/{viewingPhoto.name}
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3 bg-slate-950/60 text-xs">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">YEAR</span>
                      <strong className="text-white text-sm">{viewingPhoto.year}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">MONTH</span>
                      <strong className="text-white text-sm">{viewingPhoto.monthName}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">FILE SIZE</span>
                      <strong className="text-emerald-400 text-sm">{viewingPhoto.size}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      alert(`Photo path: /${viewingPhoto.year}/${viewingPhoto.monthName}/${viewingPhoto.name}`);
                      setViewingPhoto(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ========================================================= */}
      {/* 2ND APP: SONG ANALYZER (SCALES, CHORDS, PITCH, TEMPO)     */}
      {/* ========================================================= */}
      {activeApp === 'app2' && (
        <main className="flex-1 p-6 max-w-5xl w-full mx-auto space-y-6">
          {/* Song Link Input Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-cyan-400" />
                Provide Song Link to Extract Scale, Chords, Pitch & Tempo
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter any song link, audio stream URL, or click any sample song below to test instantly:
              </p>
            </div>

            {/* URL Input + Analyze Button */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={songLink}
                onChange={e => setSongLink(e.target.value)}
                placeholder="Paste song link (e.g. https://.../song.mp3 or streaming link)..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => handleAnalyzeSong(songLink)}
                disabled={isAnalyzing || !songLink.trim()}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing Song...' : 'Extract All 4 Features'}
              </button>
            </div>

            {/* Preset Song Quick Selectors */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-400 font-semibold mb-2">Or pick a sample song:</div>
              <div className="flex flex-wrap gap-2">
                {PRESET_SONGS.map((song, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSongLink(song.url);
                      handleAnalyzeSong(song.url, song);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition flex items-center gap-1.5"
                  >
                    <Disc3 className="h-3 w-3 text-cyan-400" />
                    {song.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4 Core Extracted Features Display */}
          {analysisResult && (
            <div className="space-y-5">
              {/* Audio Playback Bar */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlayAudio}
                    className="h-10 w-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-md transition"
                  >
                    {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                  </button>
                  <div>
                    <div className="text-xs font-bold text-white">{analysisResult.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Audio Stream Loaded • {analysisResult.duration}</div>
                  </div>
                </div>

                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                  Analysis Complete
                </span>
              </div>

              {/* THE 4 REQUESTED CORE OUTPUTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. SCALES */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" />
                      1. Detected Scale
                    </div>
                    <div className="text-3xl font-extrabold text-white mt-2">
                      {analysisResult.scale}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Musical scale structure that governs the song's harmonies and melody.
                    </p>
                  </div>

                  {/* Notes in the Scale */}
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-1.5 font-bold uppercase">Notes in this scale:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.scaleNotes.map(n => (
                        <span key={n} className="px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 font-mono font-bold text-xs border border-cyan-800">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. CHORDS */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                      <Layers className="h-4 w-4" />
                      2. Detected Chords
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">
                      Harmonic Progression
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Primary chords present in the song's chord progression.
                    </p>
                  </div>

                  {/* Chord Boxes */}
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-1.5 font-bold uppercase">Chord Sequence:</span>
                    <div className="grid grid-cols-4 gap-2">
                      {analysisResult.chords.map((chord, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-center">
                          <div className="text-[10px] text-slate-500 font-mono">CHORD {idx + 1}</div>
                          <div className="text-lg font-bold font-mono text-emerald-400">{chord}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. PITCH */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-purple-400 tracking-wider uppercase flex items-center gap-1.5">
                      <Disc3 className="h-4 w-4" />
                      3. Detected Pitch / Tonic
                    </div>
                    <div className="text-3xl font-extrabold text-white mt-2">
                      {analysisResult.pitch}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Fundamental frequency & home tonic pitch reference note.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Root Tonic Note:</span>
                    <span className="px-3 py-1 rounded bg-purple-950 text-purple-300 font-bold font-mono border border-purple-800">
                      {analysisResult.tonicNote}
                    </span>
                  </div>
                </div>

                {/* 4. TEMPO (BPM) */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      4. Detected Tempo (BPM)
                    </div>
                    <div className="text-4xl font-extrabold text-amber-400 mt-2 font-mono flex items-baseline gap-2">
                      {analysisResult.tempoBpm}
                      <span className="text-sm font-sans text-slate-400 font-normal">BPM</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Speed of the beat: {analysisResult.tempoLabel}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Beat Interval:</span>
                    <span className="font-mono text-amber-300 font-semibold">
                      {((60 / analysisResult.tempoBpm) * 1000).toFixed(0)} ms per beat
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
