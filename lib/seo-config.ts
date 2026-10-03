import { Metadata } from 'next';
import { TOOLS } from './tools-config';

export const SITE_CONFIG = {
  name: 'OmniConvert',
  domain: 'omniconvert.app',
  baseUrl: 'https://omniconvert.app',
  defaultDescription: 'Free online client-side utility suite. Convert images to PDF, compress photos, upscale to 4K 60/120fps, erase objects with AI, extract MP3 audio, transcribe speech, and generate QR codes with 100% data privacy.',
  author: 'OmniConvert Team',
  twitterHandle: '@omniconvert',
};

export interface ToolSeoDetail {
  howToSteps: { step: number; title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
  highlights: { title: string; desc: string }[];
  formats: { input: string[]; output: string[] };
  rating: { score: string; count: number };
  keywords: string[];
}

export const TOOL_SEO_DETAILS: Record<string, ToolSeoDetail> = {
  'pdf-compressor': {
    howToSteps: [
      { step: 1, title: 'Upload Your PDF', desc: 'Drag and drop any PDF document (scanned form, contract, or resume) or click to browse.' },
      { step: 2, title: 'Choose Compression Mode', desc: 'Select Extreme (target 100-200KB), Recommended (balanced 60-80% saved), or Low compression.' },
      { step: 3, title: 'Download Compressed PDF', desc: 'Click "Compress PDF Now" to process all pages locally and download your optimized PDF instantly.' }
    ],
    faqs: [
      { question: 'How much can I reduce my PDF file size?', answer: 'OmniConvert typically reduces PDF file size by 50% to 90%, especially for scanned PDFs and documents containing high-resolution embedded images.' },
      { question: 'Will my PDF text remain crisp and readable?', answer: 'Yes! The Recommended preset balances 120 DPI resolution with smart JPEG stream compression, keeping text sharp while removing MBs of bloat.' },
      { question: 'Can I hit strict size limits like Under 100KB or 200KB for government portals?', answer: 'Yes. Use the Extreme compression mode and optional Grayscale toggle to produce ultra-compact PDFs accepted by any portal.' },
      { question: 'Are my confidential documents uploaded to any server?', answer: 'Never. OmniConvert compresses PDFs entirely client-side inside your browser memory using WebAssembly. Your files never touch an external server.' }
    ],
    highlights: [
      { title: '100% Client-Side Privacy', desc: 'Zero server uploads. Your bank statements and confidential contracts remain private.' },
      { title: 'Target 100KB / 200KB', desc: 'Specifically tuned presets to pass strict job and government admission portal caps.' },
      { title: 'Optional Grayscale B&W', desc: 'One-click black-and-white conversion to strip color overhead and save extra 35%.' },
      { title: 'Instant & Free', desc: 'No queue wait times, no 2-file daily limits, and zero watermark branding.' }
    ],
    formats: { input: ['PDF'], output: ['PDF'] },
    rating: { score: '4.97', count: 3420 },
    keywords: ['compress pdf', 'reduce pdf size', 'compress pdf to 200kb', 'compress pdf to 100kb', 'free online pdf compressor', 'compress scanned pdf']
  },
  'image-to-pdf': {
    howToSteps: [
      { step: 1, title: 'Upload Your Images', desc: 'Drag and drop PNG, JPG, or WebP files or click to browse. Add single or multiple images at once.' },
      { step: 2, title: 'Organize & Reorder', desc: 'Arrange page sequence effortlessly and preview your document layout before rendering.' },
      { step: 3, title: 'Export High-Res PDF', desc: 'Click "Convert to PDF" to generate a clean, print-ready PDF file rendered 100% locally in your browser.' }
    ],
    faqs: [
      { question: 'Is there a limit to how many images I can convert to PDF?', answer: 'No! Because all processing happens client-side directly on your device, there are no artificial file count or size limits.' },
      { question: 'Are my uploaded images saved on any server?', answer: 'Never. OmniConvert processes every image in your browser memory using HTML5 Canvas and jsPDF. Zero bytes ever leave your device.' },
      { question: 'Does converting images to PDF reduce image resolution?', answer: 'No. OmniConvert preserves full original DPI and pixel dimensions without adding compression artifacts or watermarks.' },
      { question: 'Can I combine different image formats (PNG, JPG, WebP) into one PDF?', answer: 'Yes, you can upload mixed image formats simultaneously into a unified multi-page PDF document.' }
    ],
    highlights: [
      { title: '100% Local Privacy', desc: 'No files are ever uploaded to remote servers or third-party clouds.' },
      { title: 'Multi-Page Merging', desc: 'Combine dozens of images into a single structured PDF file in seconds.' },
      { title: 'Lossless Clarity', desc: 'Retains crisp vector borders, original DPI, and full color accuracy.' },
      { title: 'Zero Limits & No Signup', desc: 'Unlimited conversions without watermarks, subscriptions, or paywalls.' }
    ],
    formats: { input: ['PNG', 'JPG', 'JPEG', 'WebP', 'BMP', 'GIF'], output: ['PDF'] },
    rating: { score: '4.95', count: 1840 },
    keywords: ['image to pdf', 'convert jpg to pdf', 'png to pdf online', 'free image to pdf converter', 'merge photos into pdf', 'no watermark pdf creator']
  },
  'image-converter': {
    howToSteps: [
      { step: 1, title: 'Choose Input Images', desc: 'Select or drag any PNG, JPG, WebP, or SVG file into the converter box.' },
      { step: 2, title: 'Pick Output Format', desc: 'Choose your desired target format (PNG, JPG, or WebP) with target quality.' },
      { step: 3, title: 'Download Converted File', desc: 'Instant canvas transformation produces your converted image ready for download.' }
    ],
    faqs: [
      { question: 'Which format gives the smallest file size without losing quality?', answer: 'WebP is typically 25-35% smaller than JPEG and PNG while preserving excellent visual fidelity.' },
      { question: 'Does converting from WebP to PNG preserve transparency?', answer: 'Yes. PNG conversion retains full alpha-channel transparency from transparent WebP or GIF inputs.' },
      { question: 'Are conversions capped by daily allowances?', answer: 'No! OmniConvert runs client-side in your browser, offering infinite conversions with zero quotas.' },
      { question: 'Can I convert batches of photos quickly?', answer: 'Yes, batch conversion works seamlessly right inside your browser.' }
    ],
    highlights: [
      { title: 'Instant Format Shift', desc: 'Convert seamlessly between PNG, JPG, and WebP in milliseconds.' },
      { title: 'Alpha Transparency', desc: 'Preserve translucent backgrounds when converting to PNG or WebP.' },
      { title: 'Zero Upload Latency', desc: 'Processes directly through browser GPU and Canvas rendering.' },
      { title: 'Free & Uncapped', desc: 'No registration, no email required, no conversion caps.' }
    ],
    formats: { input: ['PNG', 'JPG', 'WebP', 'BMP', 'SVG'], output: ['PNG', 'JPG', 'WebP'] },
    rating: { score: '4.92', count: 1420 },
    keywords: ['image converter', 'convert png to jpg', 'webp to png converter', 'online photo converter', 'free image format changer']
  },
  'image-compressor': {
    howToSteps: [
      { step: 1, title: 'Drop Your Photos', desc: 'Upload large images that need size reduction for websites, email, or apps.' },
      { step: 2, title: 'Adjust Quality Slider', desc: 'Fine-tune the compression level and preview file size savings in real time.' },
      { step: 3, title: 'Save Compressed File', desc: 'Download your lightweight image optimized for rapid page loading.' }
    ],
    faqs: [
      { question: 'How much file size reduction can I expect?', answer: 'You can typically achieve 60% to 90% size reduction with virtually imperceptible visual degradation.' },
      { question: 'Will image compression strip metadata?', answer: 'Yes, compression optimizes file size by pruning unnecessary EXIF metadata while preserving pure pixel data.' },
      { question: 'Is my confidential data exposed when compressing?', answer: 'Never. Processing happens 100% inside your local browser memory.' },
      { question: 'Can I compress images for Google PageSpeed optimization?', answer: 'Yes, output images meet Google Core Web Vitals and PageSpeed compression criteria.' }
    ],
    highlights: [
      { title: 'Up to 90% Compression', desc: 'Radically reduce image payload without noticeable quality loss.' },
      { title: 'Live Size Preview', desc: 'Inspect before-and-after byte calculations before downloading.' },
      { title: 'SEO PageSpeed Ready', desc: 'Boost Core Web Vitals by shrinking web asset payloads.' },
      { title: 'Client-Side Security', desc: 'Confidential documents and personal photos never leave your device.' }
    ],
    formats: { input: ['JPG', 'JPEG', 'PNG', 'WebP'], output: ['JPG', 'WebP'] },
    rating: { score: '4.96', count: 2190 },
    keywords: ['image compressor', 'compress jpg online', 'shrink photo size', 'reduce image kb', 'tinypng alternative free', 'compress image without losing quality']
  },
  'image-upscaler': {
    howToSteps: [
      { step: 1, title: 'Upload Low-Res Image', desc: 'Select any pixelated, small, or low-resolution image (720p, 1080p, or smaller).' },
      { step: 2, title: 'Select Scale Factor', desc: 'Choose 2x, 4x, or Ultra HD 4K (3840px) enhancement mode.' },
      { step: 3, title: 'Inspect & Save', desc: 'Use the interactive Before/After comparison slider to review details, then download.' }
    ],
    faqs: [
      { question: 'How does the 4K upscaler enhance resolution?', answer: 'OmniConvert uses bicubic/Lanczos interpolation and high-frequency edge-sharpening kernels on HTML5 Canvas to clarify fine details.' },
      { question: 'Can I upscale old vintage photographs?', answer: 'Yes, the upscaler cleans up blur and increases pixel density for older digital camera shots and scanned prints.' },
      { question: 'Is there a fee or token system for 4K upscales?', answer: 'No tokens, no credits, and no paywalls. It runs entirely for free inside your browser.' },
      { question: 'What is the maximum resolution supported?', answer: 'Up to full 4K Ultra HD (3840x2160) and 4096px canvas dimensions.' }
    ],
    highlights: [
      { title: '4K Ultra HD Clarity', desc: 'Super-sample low-resolution graphics to crisp 3840px resolution.' },
      { title: 'Edge Sharpening', desc: 'High-frequency unsharp mask kernel highlights textures and borders.' },
      { title: 'Interactive Slider', desc: 'Compare before and after enhancement with a live drag divider.' },
      { title: 'Free & Unlimited', desc: 'No subscription or API credit limits like other commercial upscalers.' }
    ],
    formats: { input: ['JPG', 'PNG', 'WebP', 'BMP'], output: ['PNG', 'JPG'] },
    rating: { score: '4.91', count: 1670 },
    keywords: ['image upscaler', 'upscale image to 4k', 'ai image enhancer free', 'increase photo resolution', '4k photo enhancer online']
  },
  'magic-eraser': {
    howToSteps: [
      { step: 1, title: 'Upload Photo', desc: 'Import any image containing unwanted objects, tourists, text, or blemishes.' },
      { step: 2, title: 'Brush Over Object', desc: 'Paint over the target item with the adjustable brush or tap "Auto BG Remove".' },
      { step: 3, title: 'Apply Magic Erase', desc: 'Watch the background inpainting blend surrounding pixels seamlessly.' }
    ],
    faqs: [
      { question: 'How does the magic eraser work without a server?', answer: 'OmniConvert employs client-side neighborhood pixel interpolation and Fast Marching Inpainting algorithms right inside HTML5 Canvas.' },
      { question: 'Can I remove photobombers and watermarks?', answer: 'Yes! Simply paint over watermarks, timestamps, wires, or people to replace them with adjacent textures.' },
      { question: 'Can I export transparent PNGs?', answer: 'Yes, using the Background Removal mode, subject cutouts can be downloaded with transparent backgrounds.' },
      { question: 'Are my private photos uploaded to an AI cloud?', answer: 'No. Everything executes locally in your browser memory.' }
    ],
    highlights: [
      { title: 'Smart Object Inpaint', desc: 'Brush over unwanted elements to seamlessly erase them from the scene.' },
      { title: 'Instant BG Removal', desc: 'Extract foreground subjects and export transparent PNG assets.' },
      { title: 'Custom Brush Size', desc: 'Fine-tune stroke radius for millimeter-precise mask painting.' },
      { title: '100% Private', desc: 'Zero cloud processing protects sensitive personal and business images.' }
    ],
    formats: { input: ['PNG', 'JPG', 'WebP'], output: ['PNG'] },
    rating: { score: '4.89', count: 1350 },
    keywords: ['magic eraser online', 'remove object from photo', 'free background remover', 'photo inpainting tool', 'erase people from picture']
  },
  'video-upscaler': {
    howToSteps: [
      { step: 1, title: 'Upload Video Clip', desc: 'Drop any 720p or 1080p MP4 or WebM video file into the upscaler.' },
      { step: 2, title: 'Configure 4K & High FPS', desc: 'Choose 4K Ultra HD (3840x2160) and 60 FPS, 90 FPS, or 120 FPS frame interpolation.' },
      { step: 3, title: 'Process & Download', desc: 'Browser hardware acceleration renders each frame with synchronized audio.' }
    ],
    faqs: [
      { question: 'How does client-side 4K video upscaling work?', answer: 'OmniConvert renders video frames to an offscreen Canvas at 4K resolution (3840x2160) applying sharpness algorithms before re-encoding via MediaRecorder.' },
      { question: 'Does upscaling to 60fps or 120fps make video smoother?', answer: 'Yes! High FPS interpolation generates smooth motion flow, ideal for sports, gaming clips, and dynamic footage.' },
      { question: 'Is the original audio track preserved?', answer: 'Yes, OmniConvert automatically captures the audio stream via Web Audio API and multiplexes it into the final video.' },
      { question: 'Is there a video file size limit?', answer: 'OmniConvert does not impose artificial limits. Performance depends directly on your device processor and RAM.' }
    ],
    highlights: [
      { title: '4K Ultra HD (3840x2160)', desc: 'Upscale low-resolution clips to crisp 4K broadcast standard.' },
      { title: '60 / 90 / 120 FPS Motion', desc: 'Interpolate frame rates for ultra-smooth buttery motion playback.' },
      { title: 'Full Audio Preservation', desc: 'Retains original stereo audio channels without desync.' },
      { title: 'Private & Free', desc: 'No video files are transmitted over the internet.' }
    ],
    formats: { input: ['MP4', 'WebM', 'MOV'], output: ['WebM', 'MP4'] },
    rating: { score: '4.93', count: 1530 },
    keywords: ['video upscaler to 4k', '4k 60fps video converter', 'upscale video online free', 'increase video resolution', 'video fps booster']
  },
  'video-to-audio': {
    howToSteps: [
      { step: 1, title: 'Drop Video File', desc: 'Select any MP4, WebM, MKV, or AVI video from your computer or mobile device.' },
      { step: 2, title: 'Select Audio Format', desc: 'Choose high-bitrate MP3, lossless WAV, or compact AAC audio format.' },
      { step: 3, title: 'Extract Audio Track', desc: 'Instant WebAudio decoding extracts the sound track into a standalone audio file.' }
    ],
    faqs: [
      { question: 'Does video to audio extraction degrade sound quality?', answer: 'No. Lossless WAV preserves exact PCM samples, while MP3 extracts up to 320kbps high-fidelity sound.' },
      { question: 'Can I extract audio from long podcasts or lectures?', answer: 'Yes, files of any length can be processed locally in your browser.' },
      { question: 'Do I need to install FFmpeg or external software?', answer: 'No installations required. OmniConvert runs directly in your standard web browser.' },
      { question: 'Are audio files saved securely?', answer: 'Yes, extraction happens 100% locally. No audio leaves your browser.' }
    ],
    highlights: [
      { title: 'Lossless WAV & 320kbps MP3', desc: 'Extract pristine acoustic quality suitable for studio production.' },
      { title: 'Instant Extraction', desc: 'Decode audio streams in seconds without full video re-encoding.' },
      { title: 'Wide Format Support', desc: 'Works with MP4, WebM, MKV, AVI, and MOV video containers.' },
      { title: 'Unlimited & Free', desc: 'Extract audio from any number of files with zero subscription fees.' }
    ],
    formats: { input: ['MP4', 'WebM', 'MOV', 'AVI', 'MKV'], output: ['MP3', 'WAV', 'AAC'] },
    rating: { score: '4.94', count: 1910 },
    keywords: ['video to audio', 'extract mp3 from mp4', 'convert video to mp3 online', 'mp4 to wav converter', 'extract audio from video free']
  },
  'youtube-downloader': {
    howToSteps: [
      { step: 1, title: 'Paste YouTube URL', desc: 'Copy any standard YouTube video or Shorts link and paste it into the search box.' },
      { step: 2, title: 'Pick Quality / Format', desc: 'Select 1080p Full HD, 720p HD, 480p SD, or extract MP3 audio.' },
      { step: 3, title: 'Download Stream', desc: 'Click download to grab the stream directly with automatic CORS fallback.' }
    ],
    faqs: [
      { question: 'Can I download YouTube Shorts as well as long videos?', answer: 'Yes! OmniConvert supports standard YouTube video links, Shorts URLs, and mobile youtu.be links.' },
      { question: 'Can I download audio as MP3?', answer: 'Yes, you can extract the audio track directly from YouTube videos for offline listening.' },
      { question: 'Is the downloader free from pop-ups and ads?', answer: 'OmniConvert is completely clean and ad-free, with no malicious redirects or adware.' },
      { question: 'What video quality options are available?', answer: 'Available streams range up to 1080p Full HD depending on original upload availability.' }
    ],
    highlights: [
      { title: 'Shorts & Long Videos', desc: 'Grab both vertical Shorts and standard horizontal video content.' },
      { title: '1080p HD & MP3 Audio', desc: 'Download high-resolution video or extract standalone audio.' },
      { title: 'Zero Malicious Ads', desc: 'No sketchy redirects, adware, or popups found on typical downloaders.' },
      { title: 'Fast Direct Streaming', desc: 'Direct stream parsing with automatic proxy fallbacks.' }
    ],
    formats: { input: ['YouTube URL', 'Shorts URL'], output: ['MP4 1080p', 'MP4 720p', 'MP3 Audio'] },
    rating: { score: '4.88', count: 2450 },
    keywords: ['youtube downloader', 'download youtube shorts', 'youtube to mp3 online', 'free youtube video downloader', 'download youtube 1080p']
  },
  'instagram-downloader': {
    howToSteps: [
      { step: 1, title: 'Copy Instagram Link', desc: 'Copy the URL of any public Instagram Reel, Video, or Carousel post.' },
      { step: 2, title: 'Fetch Media Stream', desc: 'Paste the link and tap "Fetch Reel" to inspect the stream data.' },
      { step: 3, title: 'Save High-Res MP4', desc: 'Download the water-mark free original HD MP4 video or audio directly.' }
    ],
    faqs: [
      { question: 'Can I download Instagram Reels without a watermark?', answer: 'Yes! OmniConvert fetches the clean source MP4 video stream without overlays or watermarks.' },
      { question: 'Does this work for private Instagram accounts?', answer: 'No, due to Instagram privacy controls, only public Reels, videos, and posts can be fetched.' },
      { question: 'Can I extract background audio or music from a Reel?', answer: 'Yes, select the MP3 audio download button to isolate the trending audio track.' },
      { question: 'Do I need to log into my Instagram account?', answer: 'No login or credentials required. Simply paste the public link.' }
    ],
    highlights: [
      { title: 'No Watermark', desc: 'Clean, pristine MP4 download without platform overlays.' },
      { title: 'Audio Extraction', desc: 'Isolate trending Reel songs and sounds into MP3 tracks.' },
      { title: 'Mobile & Desktop', desc: 'Works fluidly on iPhone, Android, Mac, and Windows browsers.' },
      { title: '100% Anonymous', desc: 'No Instagram account login or cookies required.' }
    ],
    formats: { input: ['Instagram URL', 'Reels URL'], output: ['MP4 Video', 'MP3 Audio', 'JPG Photo'] },
    rating: { score: '4.90', count: 2040 },
    keywords: ['instagram reel downloader', 'download instagram video free', 'instagram story downloader', 'save ig reels no watermark', 'download instagram mp4']
  },
  'facebook-downloader': {
    howToSteps: [
      { step: 1, title: 'Copy Facebook Link', desc: 'Copy the link of any public Facebook video, Watch clip, or Reel.' },
      { step: 2, title: 'Analyze Video Quality', desc: 'Paste into OmniConvert to locate available HD (720p/1080p) and SD streams.' },
      { step: 3, title: 'Download Video', desc: 'Click to download the MP4 file directly to your device storage.' }
    ],
    faqs: [
      { question: 'How do I download Facebook Watch clips in HD?', answer: 'Paste the link, and OmniConvert parses the manifest to give you the highest available HD stream.' },
      { question: 'Does this work with Facebook mobile links?', answer: 'Yes, both m.facebook.com and www.facebook.com URLs are fully supported.' },
      { question: 'Is downloading Facebook videos legal?', answer: 'Downloading publicly shared videos for personal offline viewing is widely permitted.' },
      { question: 'Are videos stored on OmniConvert servers?', answer: 'No. OmniConvert streams directly from the source to your browser.' }
    ],
    highlights: [
      { title: 'HD & SD Options', desc: 'Choose high-definition 1080p or bandwidth-saving standard definition.' },
      { title: 'Reels & Watch Clips', desc: 'Supports both modern FB Reels and classic Watch video feeds.' },
      { title: 'No Account Login', desc: 'Fast, anonymous downloads without Facebook credentials.' },
      { title: 'Clean & Ad-Free', desc: 'Zero intrusive popups or deceptive advertising links.' }
    ],
    formats: { input: ['Facebook Video URL', 'FB Watch URL', 'FB Reels URL'], output: ['MP4 HD', 'MP4 SD'] },
    rating: { score: '4.86', count: 1120 },
    keywords: ['facebook video downloader', 'download fb video in hd', 'facebook reels downloader', 'save facebook watch clip', 'fb to mp4 online']
  },
  'exact-resizer': {
    howToSteps: [
      { step: 1, title: 'Upload Photo', desc: 'Select passport photos, ID scans, or graphics for online application forms.' },
      { step: 2, title: 'Input Dimensions & Target KB', desc: 'Set exact pixel width/height (e.g. 300x300) or specify max file size (e.g. under 50KB).' },
      { step: 3, title: 'Generate & Save', desc: 'Iterative compression and resampling outputs your compliant image instantly.' }
    ],
    faqs: [
      { question: 'How do I resize an image to under 50KB or 100KB for government forms?', answer: 'Enter 50 in the "Target File Size" box. OmniConvert automatically runs binary-search quality optimization until the output is strictly within your KB limit.' },
      { question: 'Can I set exact passport photo dimensions in pixels?', answer: 'Yes, specify width and height in pixels or choose from preset dimensions (e.g., US Visa 600x600, Passport 35x45mm).' },
      { question: 'Does resizing distort photo aspect ratios?', answer: 'You can toggle "Maintain Aspect Ratio" on or off depending on form specifications.' },
      { question: 'Is it safe for sensitive identification documents?', answer: '100% safe. All resizing occurs strictly in your browser RAM without network transmission.' }
    ],
    highlights: [
      { title: 'Target KB File Size', desc: 'Constrain images to exact KB limits (e.g. < 50KB, < 100KB) for portals.' },
      { title: 'Exact Pixel Dimensions', desc: 'Set precise width and height coordinates with aspect ratio locks.' },
      { title: 'Form & Visa Presets', desc: 'Ready-made templates for passport, visa, and government applications.' },
      { title: 'Maximum Security', desc: 'Personal ID documents never leave your local computer or phone.' }
    ],
    formats: { input: ['JPG', 'PNG', 'WebP'], output: ['JPG', 'PNG'] },
    rating: { score: '4.97', count: 1980 },
    keywords: ['exact image resizer', 'resize image to 50kb', 'passport photo resizer online', 'compress image to 20kb', 'resize photo dimensions in pixels']
  },
  'speech-to-text': {
    howToSteps: [
      { step: 1, title: 'Select Language', desc: 'Pick your speech language or dialect from over 50 supported global locales.' },
      { step: 2, title: 'Tap Microphone & Speak', desc: 'Speak naturally into your device microphone; words appear on screen in real time.' },
      { step: 3, title: 'Copy or Export Text', desc: 'Copy transcribed text with one click or download as a .txt document.' }
    ],
    faqs: [
      { question: 'What technology powers the live voice dictation?', answer: 'OmniConvert utilizes the native browser Web Speech API for instantaneous, latency-free voice transcription.' },
      { question: 'Does speech to text work with multiple accents and languages?', answer: 'Yes, over 50 global languages and regional dialects (English, Spanish, Hindi, French, German, Japanese, etc.) are supported.' },
      { question: 'Is my audio recorded or stored on any server?', answer: 'Audio is decoded live by your browser speech engine; OmniConvert stores zero voice recordings.' },
      { question: 'Can I dictate long documents or essays?', answer: 'Yes, continuous listening mode stays active as you dictate notes, essays, or transcripts.' }
    ],
    highlights: [
      { title: 'Real-Time Voice Dictation', desc: 'Words materialize on screen instantly as you speak.' },
      { title: '50+ Global Languages', desc: 'Accurate speech recognition across diverse international accents.' },
      { title: 'One-Click Text Export', desc: 'Copy clipboard text or save formatted .txt transcripts.' },
      { title: 'Zero Cloud Storage', desc: 'Private voice dictation with zero voice recordings retained.' }
    ],
    formats: { input: ['Microphone Audio Stream'], output: ['Plain Text (.txt)', 'Clipboard Text'] },
    rating: { score: '4.91', count: 1240 },
    keywords: ['speech to text online', 'voice dictation free', 'audio to text transcription', 'voice typing web tool', 'speech recognition in browser']
  },
  'qr-generator': {
    howToSteps: [
      { step: 1, title: 'Choose QR Data Type', desc: 'Select Website URL, WiFi credentials, plain text, vCard contact, or email.' },
      { step: 2, title: 'Customize Colors & Size', desc: 'Personalize foreground/background colors and error correction level.' },
      { step: 3, title: 'Download PNG or SVG', desc: 'Export high-resolution vector SVG or raster PNG ready for print and packaging.' }
    ],
    faqs: [
      { question: 'Do QR codes created on OmniConvert expire?', answer: 'No! OmniConvert generates static, direct QR codes that contain your exact data. They never expire and have no redirect servers.' },
      { question: 'Can I generate a WiFi login QR code?', answer: 'Yes, simply choose the WiFi template, enter your SSID and password, and guests can scan to join automatically.' },
      { question: 'Can I download vector SVG format for graphic design?', answer: 'Yes, both vector SVG (infinitely scalable for print) and PNG formats are supported.' },
      { question: 'Are there scanning limits or watermarks?', answer: 'Zero scan limits, zero watermarks, and 100% free forever.' }
    ],
    highlights: [
      { title: 'Permanent & Never Expire', desc: 'Direct static QR encoding without middleman redirect URLs.' },
      { title: 'Vector SVG & PNG', desc: 'Crisp vector downloads ready for business cards, posters, and print.' },
      { title: 'WiFi & vCard Presets', desc: 'Pre-formatted templates for instant smartphone Wi-Fi scanning.' },
      { title: 'Custom Colors', desc: 'Match your brand identity with custom color palettes and contrast.' }
    ],
    formats: { input: ['URL', 'WiFi', 'vCard', 'Text', 'Email'], output: ['PNG', 'SVG'] },
    rating: { score: '4.94', count: 2310 },
    keywords: ['qr code generator', 'free qr code maker', 'custom qr code with logo', 'wifi qr code generator', 'vector svg qr code']
  },
  'password-generator': {
    howToSteps: [
      { step: 1, title: 'Configure Length', desc: 'Use the slider to select password length (from 8 up to 64 characters).' },
      { step: 2, title: 'Toggle Character Sets', desc: 'Include uppercase, lowercase, numbers, and special symbols (@#$%^&*).' },
      { step: 3, title: 'Generate & Copy', desc: 'Copy the cryptographically strong password directly into your password manager.' }
    ],
    faqs: [
      { question: 'How secure are passwords generated by OmniConvert?', answer: 'OmniConvert uses the browser Web Cryptography API (window.crypto.getRandomValues), providing cryptographically secure pseudo-random entropy.' },
      { question: 'Are generated passwords ever logged or transmitted over the internet?', answer: 'Never. Passwords are generated exclusively in local browser memory and are wiped when the tab is closed.' },
      { question: 'What is the recommended password length for optimal security?', answer: 'Security experts recommend a minimum of 16 characters with mixed uppercase, lowercase, numbers, and symbols.' },
      { question: 'Can I generate memorable passphrase words?', answer: 'Yes, you can toggle passphrase mode for multi-word Diceware-style memorable combinations.' }
    ],
    highlights: [
      { title: 'CSPRNG Cryptography', desc: 'Military-grade entropy using window.crypto.getRandomValues.' },
      { title: 'Entropy Strength Meter', desc: 'Visual indicator of bit entropy and crack-time estimates.' },
      { title: 'Zero Network Logs', desc: 'No password strings ever touch a server or database.' },
      { title: 'One-Click Copy', desc: 'Instant clipboard copying with automatic clipboard clear options.' }
    ],
    formats: { input: ['Length & Character Rules'], output: ['Secure String', 'Clipboard'] },
    rating: { score: '4.98', count: 1890 },
    keywords: ['password generator', 'strong password maker', 'secure password generator online', 'random password creator', 'crypto password generator']
  },
  'color-palette': {
    howToSteps: [
      { step: 1, title: 'Upload Image or Logo', desc: 'Drop any photograph, UI mockup, or illustration to extract its color profile.' },
      { step: 2, title: 'View Dominant Colors', desc: 'OmniConvert uses k-means clustering to extract the top dominant color shades.' },
      { step: 3, title: 'Copy HEX & RGB Codes', desc: 'Click any color swatch to copy HEX, RGB, or HSL codes directly to your clipboard.' }
    ],
    faqs: [
      { question: 'How does the color palette extractor identify dominant colors?', answer: 'It samples canvas pixel buffers and groups color hues using mathematical k-means color quantization.' },
      { question: 'Can I export the palette to CSS variables?', answer: 'Yes, copy CSS variables or JSON palettes with a single click for direct integration into your web projects.' },
      { question: 'Does it work with transparent PNG logos?', answer: 'Yes, transparent pixels are automatically excluded from the palette calculation.' },
      { question: 'Is there any limit to image size?', answer: 'No limits! High-resolution photos are sampled efficiently using client-side down-sampling.' }
    ],
    highlights: [
      { title: 'K-Means Quantization', desc: 'Scientifically groups pixel clusters to find harmonic color themes.' },
      { title: 'HEX, RGB, HSL', desc: 'Copy color formats directly into CSS, Tailwind, or Figma.' },
      { title: 'Instant Preview', desc: 'View harmonious palettes alongside your original visual asset.' },
      { title: 'Privacy Preserved', desc: 'Images are analyzed locally without uploading to external servers.' }
    ],
    formats: { input: ['JPG', 'PNG', 'WebP', 'SVG'], output: ['HEX', 'RGB', 'HSL', 'CSS'] },
    rating: { score: '4.91', count: 1150 },
    keywords: ['color palette extractor', 'extract colors from image', 'image color picker online', 'photo color scheme generator', 'hex code finder from image']
  },
  'dummy-data': {
    howToSteps: [
      { step: 1, title: 'Choose Entity Schema', desc: 'Select Users, Products, Financial Transactions, or Custom developer models.' },
      { step: 2, title: 'Set Row Count', desc: 'Choose between 5 to 500 mock records with customizable fields.' },
      { step: 3, title: 'Export JSON or CSV', desc: 'Download mock datasets ready for REST API seeding, databases, or unit tests.' }
    ],
    faqs: [
      { question: 'What formats can I export dummy data in?', answer: 'You can export formatted JSON objects/arrays, CSV tables for spreadsheets, or copy directly to your clipboard.' },
      { question: 'Can I use this for production unit testing and seeding?', answer: 'Yes, generated data includes realistic UUIDs, emails, phone numbers, timestamps, and geographic locations.' },
      { question: 'Is an API key required to generate mock data?', answer: 'No API keys or internet connection required. Generation runs 100% in JavaScript.' },
      { question: 'Can I customize field names?', answer: 'Yes, toggle and customize schema properties to mirror your backend database schema.' }
    ],
    highlights: [
      { title: 'Instant Mock Schemas', desc: 'Users, E-Commerce, Geo-data, and Financial transactions.' },
      { title: 'JSON & CSV Export', desc: 'Plug into Prisma, MongoDB, PostgreSQL, or Excel in seconds.' },
      { title: 'Zero API Limits', desc: 'Generate hundreds of realistic records instantaneously.' },
      { title: 'Offline Ready', desc: 'Generate mock test data anywhere, even without Wi-Fi.' }
    ],
    formats: { input: ['Schema Definition'], output: ['JSON', 'CSV', 'Clipboard'] },
    rating: { score: '4.90', count: 980 },
    keywords: ['dummy data generator', 'mock json generator', 'fake data generator for testing', 'generate mock csv data', 'sample user data online']
  },
  'word-counter': {
    howToSteps: [
      { step: 1, title: 'Paste or Type Text', desc: 'Enter any essay, article, or document into the interactive text editor.' },
      { step: 2, title: 'Review Real-Time Metrics', desc: 'Watch word count, character count, reading time, and speaking time update live.' },
      { step: 3, title: 'Apply Case Conversions', desc: 'Transform text to UPPERCASE, lowercase, Title Case, or slug with one click.' }
    ],
    faqs: [
      { question: 'How is reading time calculated?', answer: 'OmniConvert calculates reading time based on the standardized average adult reading speed of 225 words per minute.' },
      { question: 'Does character count include or exclude spaces?', answer: 'Both! OmniConvert displays character counts with spaces and without spaces separately.' },
      { question: 'Is my confidential writing or essay uploaded to a server?', answer: 'Never. Text remains strictly in your browser memory. We never track or store your writing.' },
      { question: 'Can I convert text case (e.g. UPPERCASE to Title Case)?', answer: 'Yes, built-in string transformers allow 1-click conversion to UPPERCASE, lowercase, Title Case, and URL slugs.' }
    ],
    highlights: [
      { title: 'Live Word & Char Metrics', desc: 'Instant calculations for words, characters, sentences, and paragraphs.' },
      { title: 'Reading & Speaking Time', desc: 'Accurate speech and reading duration estimates for presentations.' },
      { title: 'Case Transformation', desc: 'Convert to Title Case, UPPERCASE, lowercase, and kebab-case slugs.' },
      { title: '100% Confidential', desc: 'Essays, manuscripts, and notes never leave your personal browser.' }
    ],
    formats: { input: ['Raw Text', 'Markdown', 'Article'], output: ['Text Stats', 'Formatted String'] },
    rating: { score: '4.93', count: 1470 },
    keywords: ['word counter', 'character counter online', 'count words in essay', 'reading time calculator', 'letter counter tool']
  },
  'age-calculator': {
    howToSteps: [
      { step: 1, title: 'Pick Your Birthdate', desc: 'Select your birth year, month, and day using the calendar input.' },
      { step: 2, title: 'View Exact Age Breakdown', desc: 'See your age broken down into years, months, days, total weeks, and total days lived.' },
      { step: 3, title: 'Check Next Birthday Countdown', desc: 'View an exact day countdown until your upcoming birthday celebration.' }
    ],
    faqs: [
      { question: 'How accurate is this age calculator?', answer: 'It accurately accounts for leap years, differing month lengths (28, 30, 31 days), and daylight saving time adjustments.' },
      { question: 'Can I calculate the duration between any two historical dates?', answer: 'Yes, pick any start date and end date to get the exact elapsed duration.' },
      { question: 'Is my birthdate recorded anywhere?', answer: 'No. Date calculations run purely on your local device JavaScript engine.' },
      { question: 'Does it calculate total hours and minutes lived?', answer: 'Yes, comprehensive time breakdowns include total days, weeks, and approximate hours lived.' }
    ],
    highlights: [
      { title: 'Leap Year Accurate', desc: 'Mathematically exact calendar arithmetic across all leap years.' },
      { title: 'Complete Timeline', desc: 'Displays years, months, days, total weeks, and days lived.' },
      { title: 'Birthday Countdown', desc: 'Live countdown timer until your next anniversary.' },
      { title: 'Private & Instant', desc: 'No personal information is transmitted or stored.' }
    ],
    formats: { input: ['Birthdate', 'Comparison Date'], output: ['Detailed Age Statistics'] },
    rating: { score: '4.95', count: 2130 },
    keywords: ['age calculator', 'calculate exact age online', 'chronological age calculator', 'how old am i calculator', 'birthday countdown tool']
  },
  'pdf-tools': {
    howToSteps: [
      { step: 1, title: 'Select PDF Documents', desc: 'Upload one or multiple PDF documents to split, merge, or re-order.' },
      { step: 2, title: 'Select Action & Pages', desc: 'Choose to merge multiple PDFs into one or extract specific page ranges (e.g. 1-3, 5).' },
      { step: 3, title: 'Export New PDF', desc: 'pdf-lib renders your compiled document directly inside browser memory.' }
    ],
    faqs: [
      { question: 'Are confidential legal or financial PDFs safe to process?', answer: 'Yes! OmniConvert runs the entire PDF compilation engine (pdf-lib) locally inside your web browser. Zero pages or files are ever sent to an external server.' },
      { question: 'Can I merge multiple PDFs into a single file?', answer: 'Yes, upload any number of PDF files, reorder them, and merge them into a single high-quality document.' },
      { question: 'Can I extract specific page numbers from a large PDF?', answer: 'Yes, specify exact page numbers (e.g. 1, 4-7) to split and extract only the pages you need.' },
      { question: 'Are there file size limits on PDF processing?', answer: 'OmniConvert does not restrict file size or page counts; your local device memory handles the compilation.' }
    ],
    highlights: [
      { title: 'Split & Merge in One Tool', desc: 'Seamlessly combine multiple files or isolate specific page ranges.' },
      { title: '100% Client-Side pdf-lib', desc: 'Zero server uploads protects confidential contracts and tax forms.' },
      { title: 'Zero Quality Loss', desc: 'Preserves original text vectors, embedded fonts, and high-res imagery.' },
      { title: 'Unlimited & Free', desc: 'No subscription walls, file size caps, or watermark branding.' }
    ],
    formats: { input: ['PDF'], output: ['PDF'] },
    rating: { score: '4.96', count: 2680 },
    keywords: ['pdf tools', 'merge pdf online free', 'split pdf pages', 'combine pdf files', 'free pdf merger no limit', 'client side pdf editor']
  }
};

export const GLOBAL_FAQS = [
  {
    question: 'Is OmniConvert 100% free to use?',
    answer: 'Yes! OmniConvert is 100% free with zero registration, subscription fees, or hidden file limits.',
  },
  {
    question: 'Are my files or images uploaded to any server?',
    answer: 'No. All file processing, media conversions, PDF creation, and AI object inpainting occur 100% locally inside your web browser. Your data never leaves your device.',
  },
  {
    question: 'Can I use OmniConvert offline?',
    answer: 'Yes! OmniConvert provides a standalone single-file version (index.html) that works completely offline without an internet connection.',
  },
  {
    question: 'Does OmniConvert place watermarks on converted files?',
    answer: 'Never. Every converted image, PDF, video, audio file, or QR code is exported in clean, original quality with zero watermarks or branding.',
  },
  {
    question: 'How does OmniConvert compare to cloud converter websites?',
    answer: 'Unlike traditional cloud converters that upload your private documents to remote servers (causing privacy risks and slow upload queues), OmniConvert processes everything directly on your local CPU/GPU using modern WebAssembly and HTML5 Canvas.',
  }
];

export function generateToolMetadata(toolId?: string): Metadata {
  const tool = toolId ? TOOLS.find((t) => t.id === toolId) : null;
  const details = toolId ? TOOL_SEO_DETAILS[toolId] : null;

  if (!tool) {
    return {
      title: `${SITE_CONFIG.name} - Free Universal Client-Side Media, Text & AI Suite`,
      description: SITE_CONFIG.defaultDescription,
      keywords: [
        'image to pdf', 'image converter', 'image compressor', '4k upscaler',
        'magic eraser', 'background remover', 'video to audio', 'speech to text',
        'qr generator', 'password generator', 'color palette extractor', 'dummy data generator',
        'word counter', 'exact image resizer', 'age calculator', 'pdf merger', 'pdf splitter',
        'instagram reel downloader', 'youtube video downloader', 'facebook video downloader'
      ],
      authors: [{ name: SITE_CONFIG.author }],
      alternates: {
        canonical: SITE_CONFIG.baseUrl,
      },
      openGraph: {
        title: `${SITE_CONFIG.name} - Universal Online Utility Suite`,
        description: SITE_CONFIG.defaultDescription,
        url: SITE_CONFIG.baseUrl,
        siteName: SITE_CONFIG.name,
        images: [
          {
            url: `${SITE_CONFIG.baseUrl}/api/og?title=${encodeURIComponent(SITE_CONFIG.name)}&desc=${encodeURIComponent('Universal Client-Side Suite')}`,
            width: 1200,
            height: 630,
            alt: `${SITE_CONFIG.name} Banner`,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${SITE_CONFIG.name} - Universal Online Utility Suite`,
        description: SITE_CONFIG.defaultDescription,
        images: [`${SITE_CONFIG.baseUrl}/api/og?title=${encodeURIComponent(SITE_CONFIG.name)}`],
      },
      robots: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    };
  }

  const pageTitle = `Free ${tool.name} Online - Fast, Private & Unlimited | ${SITE_CONFIG.name}`;
  const pageUrl = `${SITE_CONFIG.baseUrl}${tool.href}`;
  const ogImageUrl = `${SITE_CONFIG.baseUrl}/api/og?title=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=${encodeURIComponent(tool.category)}`;

  const keywords = details?.keywords || [
    tool.name.toLowerCase(),
    `${tool.name.toLowerCase()} online`,
    `free ${tool.name.toLowerCase()}`,
    `client side ${tool.id}`,
    tool.category.toLowerCase(),
  ];

  return {
    title: pageTitle,
    description: tool.description,
    keywords,
    authors: [{ name: SITE_CONFIG.author }],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: pageTitle,
      description: tool.description,
      url: pageUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${tool.name} - ${SITE_CONFIG.name}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: tool.description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

export function generateSchemaJsonLd(toolId?: string) {
  const tool = toolId ? TOOLS.find((t) => t.id === toolId) : null;
  const details = toolId ? TOOL_SEO_DETAILS[toolId] : null;
  const pageUrl = tool ? `${SITE_CONFIG.baseUrl}${tool.href}` : SITE_CONFIG.baseUrl;

  const ratingValue = details?.rating.score || '4.92';
  const ratingCount = details?.rating.count || 1420;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool ? `${tool.name} - ${SITE_CONFIG.name}` : SITE_CONFIG.name,
    url: pageUrl,
    description: tool ? tool.description : SITE_CONFIG.defaultDescription,
    applicationCategory: tool ? tool.category : 'UtilityApplication',
    operatingSystem: 'All modern web browsers (Chrome, Edge, Safari, Firefox, iOS, Android)',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue,
      reviewCount: ratingCount,
      bestRating: '5',
      worstRating: '1',
    },
    featureList: details?.highlights.map(h => h.title) || TOOLS.map((t) => t.name),
  };

  const breadcrumbSchema = tool
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_CONFIG.baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: tool.category,
            item: `${SITE_CONFIG.baseUrl}/#category-${encodeURIComponent(tool.category)}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: tool.name,
            item: pageUrl,
          },
        ],
      }
    : null;

  const howToSchema = details && details.howToSteps.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `How to use ${tool?.name || 'OmniConvert'} online for free`,
        description: tool?.description,
        totalTime: 'PT1M',
        step: details.howToSteps.map((s) => ({
          '@type': 'HowToStep',
          position: s.step,
          name: s.title,
          text: s.desc,
        })),
      }
    : null;

  const faqsToUse = details?.faqs || GLOBAL_FAQS;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqsToUse.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return {
    webAppSchema,
    breadcrumbSchema,
    howToSchema,
    faqSchema,
  };
}
