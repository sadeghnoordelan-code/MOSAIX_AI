import assert from 'node:assert/strict';
const origin = 'http://127.0.0.1:4180';
const routes = [
  ['/',200],['/services',200],['/services/website-design-development',200],['/services/application-design-development',200],['/services/ai-automation',200],['/services/advertising-video',200],['/services/mosaix-lab',200],['/projects',200],['/about',200],['/lab',200],['/start-a-project?service=automation',200],['/book-a-meeting',200],['/missing',404],['/services/missing',404],['/projects/missing',404],['/lab/missing',404],['/admin',404],['/admin/projects',404],
];
for (const [path,status] of routes) {
  const response = await fetch(origin+path);
  const html = await response.text();
  assert.equal(response.status,status,path);
  assert.match(html,/<html[^>]*lang="en"/,path);
  assert.match(html,/<h1[ >]/,path);
  assert.match(html,/<main[^>]*id="main-content"/,path);
  assert.match(html,/noindex/,path);
  if (path.includes('service=automation')) assert.match(html,/Selected service:[\s\S]*AI Automation Design/);
  console.log(`VERIFIED ${path}: HTTP ${status}, semantic main/h1, unindexed preview`);
}
const home = await (await fetch(origin)).text();
const hrefs = [...new Set([...home.matchAll(/href="([^"?#]+)(?:[?#][^"]*)?"/g)].map((match) => match[1]).filter((href) => href.startsWith('/') && !href.startsWith('/_next/')))];
for (const href of hrefs) {
  assert.equal((await fetch(origin+href)).status,200,`Home link ${href}`);
}
console.log(`VERIFIED ${hrefs.length} unique internal homepage links`);
const robots = await (await fetch(origin+'/robots.txt')).text();
assert.match(robots,/Disallow: \//);
const sitemap = await (await fetch(origin+'/sitemap.xml')).text();
assert.doesNotMatch(sitemap,/<loc>/);
const ranged = await fetch(origin+'/media/hero%20section.mp4',{headers:{Range:'bytes=0-31'}});
assert.equal(ranged.status,206); assert.match(ranged.headers.get('content-type') || '',/video\/mp4/);
assert.equal((await ranged.arrayBuffer()).byteLength,32);
console.log('VERIFIED robots, no fabricated sitemap origin, MP4 byte-range delivery');
