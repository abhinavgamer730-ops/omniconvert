const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tabIds = [
  'dashboard',
  'image-to-pdf',
  'image-converter',
  'image-compressor',
  'image-upscaler',
  'magic-eraser',
  'video-to-audio',
  'speech-to-text',
  'qr-generator',
  'password-generator',
  'color-palette',
  'dummy-data',
  'word-counter',
  'exact-resizer',
  'age-calculator',
  'pdf-tools',
  'instagram-downloader',
  'youtube-downloader',
  'facebook-downloader'
];

for (let i = 0; i < tabIds.length; i++) {
  const current = 'tab-' + tabIds[i];
  const next = i < tabIds.length - 1 ? 'tab-' + tabIds[i + 1] : '</main>';
  const startIdx = html.indexOf(`id="${current}"`);
  const endIdx = html.indexOf(next, startIdx + 1);
  if (startIdx !== -1 && endIdx !== -1) {
    const section = html.substring(startIdx, endIdx);
    const opens = (section.match(/<div[\s>]/g) || []).length;
    const closes = (section.match(/<\/div>/g) || []).length;
    console.log(`${current}: opens=${opens}, closes=${closes}, diff=${opens - closes}`);
  } else {
    console.log(`Could not find section for ${current}`);
  }
}
