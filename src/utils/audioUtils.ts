/**
 * Converts a base64 PCM string (24kHz 16-bit mono) from Gemini TTS into a standard WAV ArrayBuffer
 */
export function pcmToWav(pcmBase64: string, sampleRate = 24000, numChannels = 1): ArrayBuffer {
  const binaryString = atob(pcmBase64);
  const len = binaryString.length;
  const pcmBytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    pcmBytes[i] = binaryString.charCodeAt(i);
  }

  // If the audio already has RIFF WAV header, return it directly
  if (
    len >= 12 &&
    pcmBytes[0] === 0x52 && // 'R'
    pcmBytes[1] === 0x49 && // 'I'
    pcmBytes[2] === 0x46 && // 'F'
    pcmBytes[3] === 0x46    // 'F'
  ) {
    return pcmBytes.buffer;
  }

  const pcmLength = pcmBytes.length;
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);

  // 0-3: "RIFF"
  view.setUint32(0, 0x52494646, false);
  // 4-7: File length - 8
  view.setUint32(4, 36 + pcmLength, true);
  // 8-11: "WAVE"
  view.setUint32(8, 0x57415645, false);
  // 12-15: "fmt "
  view.setUint32(12, 0x666d7420, false);
  // 16-19: Subchunk1Size (16 for PCM)
  view.setUint32(16, 16, true);
  // 20-21: AudioFormat (1 for PCM)
  view.setUint16(20, 1, true);
  // 22-23: NumChannels
  view.setUint16(22, numChannels, true);
  // 24-27: SampleRate
  view.setUint32(24, sampleRate, true);
  // 28-31: ByteRate (SampleRate * NumChannels * BitsPerSample/8)
  view.setUint32(28, sampleRate * numChannels * 2, true);
  // 32-33: BlockAlign (NumChannels * BitsPerSample/8)
  view.setUint16(32, numChannels * 2, true);
  // 34-35: BitsPerSample (16 bits)
  view.setUint16(34, 16, true);
  // 36-39: "data"
  view.setUint32(36, 0x64617461, false);
  // 40-43: Subchunk2Size
  view.setUint32(40, pcmLength, true);

  const wavBytes = new Uint8Array(44 + pcmLength);
  wavBytes.set(new Uint8Array(wavHeader), 0);
  wavBytes.set(pcmBytes, 44);

  return wavBytes.buffer;
}

/**
 * Creates a Blob and Object URL from base64 PCM audio data
 */
export function createWavBlobUrl(pcmBase64: string, sampleRate = 24000): { blob: Blob; url: string } {
  const wavBuffer = pcmToWav(pcmBase64, sampleRate);
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  return { blob, url };
}

/**
 * Formats time in seconds to mm:ss format
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Triggers a browser download for an audio Blob
 */
export function downloadAudioBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename.endsWith('.wav') ? filename : `${filename}.wav`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
