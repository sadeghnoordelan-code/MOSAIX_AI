import type { ServiceId } from './services.ts';
export type VerifiedDestination = Readonly<{ url: string; verifiedAt: string }>;
type BaseProject = Readonly<{ id: string; slug: string; title: string; serviceIds: readonly ServiceId[]; previewMediaId: string; caseStudy: Readonly<{ challenge: string; approach: string }> }>;
export type Project = BaseProject & (
  | { availability:'LIVE PROJECT'; destination:VerifiedDestination }
  | { availability:'INTERACTIVE DEMO'; destination:VerifiedDestination }
  | { availability:'CASE STUDY ONLY'; destination?:never }
  | { availability:'DOWNLOADABLE APP'; destination:VerifiedDestination }
);
// No verified project facts or public destinations are supplied for publication.
export const projects: readonly Project[] = [];
