import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { media } from '../src/content/media.ts';
for (const asset of Object.values(media)) {
  for (const folder of ['Videos','public/media']) {
    const bytes = readFileSync(fileURLToPath(new URL(`../${folder}/${asset.filename}`,import.meta.url)));
    if (bytes.length !== asset.bytes || createHash('sha256').update(bytes).digest('hex') !== asset.sha256) throw new Error(`Media identity mismatch: ${asset.id}`);
  }
  console.log(`VERIFIED ${asset.id}: original and served copy match SHA256`);
}
