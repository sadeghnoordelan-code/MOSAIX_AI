import test from 'node:test';
import assert from 'node:assert/strict';
import { services } from '../src/content/services.ts';
import { media } from '../src/content/media.ts';
import { projects, type Project } from '../src/content/projects.ts';
import { validateRegistries } from '../src/lib/validate-registries.ts';
const assets = Object.values(media);
const fixture = (availability: 'LIVE PROJECT' | 'CASE STUDY ONLY'): Project => ({ id:'test', slug:'test', title:'Test fixture', serviceIds:['website'], previewMediaId:'website', caseStudy:{ challenge:'Fixture', approach:'Fixture' }, ...(availability === 'LIVE PROJECT' ? { availability, destination:{ url:'https://example.org', verifiedAt:'2026-10-03T00:00:00Z' } } : { availability }) });
test('canonical media and relationships resolve without invented projects', () => {
  assert.equal(services.length,5); assert.equal(projects.length,0);
  assert.deepEqual(validateRegistries(services,projects,assets),[]);
});
test('duplicate routes and dangling references are rejected', () => {
  const errors = validateRegistries([...services,{ ...services[0], relatedProjectIds:['missing'], mediaId:'missing' as 'website' }],projects,assets);
  assert.ok(errors.some((error) => error.includes('Duplicate service slug')));
  assert.ok(errors.some((error) => error.includes('Unknown service media')));
  assert.ok(errors.some((error) => error.includes('Unknown related project')));
});
test('GitHub repository cannot be presented as a live experience', () => {
  const project = { ...fixture('LIVE PROJECT'), availability:'LIVE PROJECT', destination:{ url:'https://github.com/mosaix/example', verifiedAt:'2026-10-03T00:00:00Z' } } as Project;
  assert.ok(validateRegistries(services,[project],assets).some((error) => error.includes('Unverified public destination')));
});
test('unsafe destinations and unknown service relations fail closed', () => {
  const project = { ...fixture('LIVE PROJECT'), serviceIds:['unknown'], destination:{ url:'javascript:alert(1)', verifiedAt:'invalid' } } as unknown as Project;
  const errors = validateRegistries(services,[project],assets);
  assert.ok(errors.some((error) => error.includes('Unknown related service')));
  assert.ok(errors.some((error) => error.includes('Unverified public destination')));
});
test('case study only cannot acquire an external destination', () => {
  const project = { ...fixture('CASE STUDY ONLY'), destination:{ url:'https://example.org', verifiedAt:'2026-10-03T00:00:00Z' } } as unknown as Project;
  assert.ok(validateRegistries(services,[project],assets).some((error) => error.includes('Case study has external destination')));
});
