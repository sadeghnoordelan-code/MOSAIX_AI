export type MediaId = 'hero' | 'website' | 'application' | 'automation' | 'advertising' | 'lab';
export type MediaAsset = Readonly<{ id: MediaId; filename: string; src: string; bytes: number; width: number; height: number; duration: number; sha256: string; videoCodec: 'avc1'; hasAudioTrack: true }>;
const asset = (id: MediaId, filename: string, bytes: number, duration: number, sha256: string): MediaAsset => ({ id, filename, src: `/media/${encodeURIComponent(filename)}`, bytes, duration, sha256, width: 1280, height: 720, videoCodec: 'avc1', hasAudioTrack: true });
export const media: Readonly<Record<MediaId, MediaAsset>> = {
  hero: asset('hero','hero section.mp4',4832817,10.005,'860df9758e729e1fa6e5ecdb250b227a94007f9d00363f083d2520eab687305d'),
  website: asset('website','Website design.mp4',4623647,8,'d5a865c20c7378acc700618cd610e694cbdc1aed9bd82d2c3f2abf21c2349482'),
  application: asset('application','App design.mp4',5926929,10.005,'9f017e38ae4729c68fce82e9c42c746450f5f5b6ea9db2a34a978c2335acc45a'),
  automation: asset('automation','Ai automation.mp4',5671143,10.005,'d96cbb4a87ae2496541a6a6758e58dce0e2cbf881f747c578b52074d43d27bd4'),
  advertising: asset('advertising','Advertisment video.mp4',5792139,10.005,'9d9710e1cfb4f7abb3d8e560158b6018171213dda8694baa1f74d94b30de6d55'),
  lab: asset('lab','Mosaix Lab video.mp4',4728859,10.005,'1b5d0c83494320383d0c5bc0924927e9e57fb4abc2e07cc1961c7ca50332bbf5'),
};
