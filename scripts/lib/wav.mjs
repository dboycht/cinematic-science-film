// Minimal RIFF/WAVE reader: the mix probes only need mono float samples at the file's rate.
// Adapted from huashu-motion's cli/lib/sound.js (MIT, © 2026 Huashu) — see NOTICE.
import { readFileSync } from 'node:fs';

export function readWav(file) {
  const b = readFileSync(file);
  if (b.toString('ascii', 0, 4) !== 'RIFF') return null;
  let p = 12;
  let fmt = null;
  while (p + 8 <= b.length) {
    const id = b.toString('ascii', p, p + 4);
    const size = b.readUInt32LE(p + 4);
    const body = p + 8;
    if (id === 'fmt ') {
      fmt = {
        tag: b.readUInt16LE(body),
        ch: b.readUInt16LE(body + 2),
        rate: b.readUInt32LE(body + 4),
        bits: b.readUInt16LE(body + 14),
      };
    }
    if (id === 'data' && fmt) {
      const bytes = fmt.bits / 8;
      const frames = Math.floor(Math.min(size, b.length - body) / (bytes * fmt.ch));
      const out = new Float32Array(frames);
      for (let i = 0; i < frames; i++) {
        let s = 0;
        for (let c = 0; c < fmt.ch; c++) {
          const at = body + (i * fmt.ch + c) * bytes;
          s +=
            fmt.tag === 3 && bytes === 4 ? b.readFloatLE(at)
              : bytes === 1 ? (b.readUInt8(at) - 128) / 128
                : bytes === 2 ? b.readInt16LE(at) / 32768
                  : bytes === 3 ? b.readIntLE(at, 3) / 8388608
                    : bytes === 4 ? b.readInt32LE(at) / 2147483648
                      : 0;
        }
        out[i] = s / fmt.ch;
      }
      return { rate: fmt.rate, data: out };
    }
    p = body + size + (size & 1);
  }
  return null;
}
