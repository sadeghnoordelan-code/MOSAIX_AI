import assert from 'node:assert/strict';
import { services } from '../src/content/services.ts';
import { media } from '../src/content/media.ts';
const origin='http://127.0.0.1:4180';
for(const service of services){
 const response=await fetch(`${origin}/services/${service.slug}`);const html=await response.text();
 assert.equal(response.status,200,service.id);
 assert.ok(html.includes(media[service.mediaId].src),`${service.id}: corresponding source video`);
 assert.match(html,/<video[^>]*autoPlay=""[^>]*muted=""[^>]*playsInline=""[^>]*loop=""/i,`${service.id}: autonomous inline looping film`);
 for(const title of ['What we can build','Technical approach','Working together','Start a project'])assert.ok(html.includes(title),`${service.id}: ${title}`);
 assert.ok(html.includes(`/start-a-project?service=${service.id}`),`${service.id}: request preselection`);
 console.log(`VERIFIED ${service.id}: correct video, autoplay/muted/loop, service/technical/delivery copy, preselected request`);
}
const home=await(await fetch(origin)).text();assert.match(home,/carousel-light-ring/);assert.doesNotMatch(home,/aria-label="(?:Previous|Next) service"/);assert.match(home,/Select Applications/);
console.log('VERIFIED homepage: carousel, luminous ring, controls and selectable side card');

for(const stage of ['CONNECT','DISCOVER','DEFINE','CREATE','REFINE','DELIVER'])assert.ok(home.includes(stage),`Process stage ${stage}`);
for(const value of ['mailto:mosaix07@gmail.com','tel:+491776681427','https://wa.me/491776681427','https://instagram.com/mosaix_ai','Wiesbaden, Germany'])assert.ok(home.includes(value),`Official contact ${value}`);
assert.ok(home.indexOf('process-heading')<home.indexOf('studio-heading'));
assert.ok(home.indexOf('studio-heading')<home.indexOf('final-cta-heading'));
console.log('VERIFIED owner additions: process order, CTA and official contact paths');
