import type { MediaAsset } from '../content/media.ts';
import type { Service } from '../content/services.ts';
import type { Project } from '../content/projects.ts';
export function validateRegistries(services: readonly Service[], projects: readonly Project[], assets: readonly MediaAsset[]): string[] {
  const errors: string[] = [];
  const serviceIds = new Set(services.map((service) => service.id));
  const projectIds = new Set(projects.map((project) => project.id));
  const mediaIds = new Set(assets.map((asset) => asset.id));
  for (const [label, items] of [['service',services],['project',projects],['media',assets]] as const) {
    if (new Set(items.map((item) => item.id)).size !== items.length) errors.push(`Duplicate ${label} id`);
  }
  for (const [label, items] of [['service',services],['project',projects]] as const) {
    if (new Set(items.map((item) => item.slug)).size !== items.length) errors.push(`Duplicate ${label} slug`);
    for (const item of items) if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) errors.push(`Invalid ${label} slug: ${item.slug}`);
  }
  for (const service of services) {
    if (!mediaIds.has(service.mediaId)) errors.push(`Unknown service media: ${service.id}`);
    for (const id of service.relatedProjectIds) if (!projectIds.has(id)) errors.push(`Unknown related project: ${id}`);
  }
  for (const project of projects) {
    const projectId = project.id;
    if (!project.title.trim() || !project.caseStudy.challenge.trim() || !project.caseStudy.approach.trim()) errors.push(`Incomplete case study: ${projectId}`);
    if (!mediaIds.has(project.previewMediaId as MediaAsset['id'])) errors.push(`Unknown project preview: ${projectId}`);
    for (const id of project.serviceIds) if (!serviceIds.has(id)) errors.push(`Unknown related service: ${id}`);
    if (project.availability === 'CASE STUDY ONLY') {
      if (project.destination) errors.push(`Case study has external destination: ${projectId}`);
      continue;
    }
    try {
      const destination = project.destination;
      const url = new URL(destination.url);
      if (url.protocol !== 'https:' || url.username || url.password || !Number.isFinite(Date.parse(destination.verifiedAt))) throw new Error('Invalid destination');
      if (['github.com','www.github.com','gitlab.com','www.gitlab.com'].includes(url.hostname) && project.availability !== 'DOWNLOADABLE APP') throw new Error('Repository is not a live experience');
    } catch { errors.push(`Unverified public destination: ${projectId}`); }
  }
  return errors;
}

