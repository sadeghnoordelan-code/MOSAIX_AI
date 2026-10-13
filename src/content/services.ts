import type { MediaId } from './media.ts';
export type ServiceId = 'website' | 'application' | 'automation' | 'advertising' | 'lab';
export type Service = Readonly<{ id: ServiceId; slug: string; title: string; shortTitle: string; discipline: string; summary: string; mediaId: MediaId; relatedProjectIds: readonly string[] }>;
export const services: readonly Service[] = [
  { id:'website', slug:'website-design-development', title:'Website Design & Development', shortTitle:'Websites', discipline:'Digital experiences', summary:'Website design and development at the intersection of design, interaction and technology.', mediaId:'website', relatedProjectIds:[] },
  { id:'application', slug:'application-design-development', title:'Application Design & Development', shortTitle:'Applications', discipline:'Software products', summary:'Application design and development, bringing product interfaces and software together.', mediaId:'application', relatedProjectIds:[] },
  { id:'automation', slug:'ai-automation', title:'AI Automation Design & Development', shortTitle:'AI automation', discipline:'Intelligent systems', summary:'AI automation design and development for digital workflows.', mediaId:'automation', relatedProjectIds:[] },
  { id:'advertising', slug:'advertising-video', title:'Advertising & Custom Video Design & Production', shortTitle:'Films & advertising', discipline:'Visual storytelling', summary:'Advertising and custom video design and production.', mediaId:'advertising', relatedProjectIds:[] },
  { id:'lab', slug:'mosaix-lab', title:'AI Tools — MOSAIX LAB', shortTitle:'MOSAIX Lab', discipline:'Tools & experiments', summary:'The home for MOSAIX-built AI tools, prototypes and experiments, distinct from client work.', mediaId:'lab', relatedProjectIds:[] },
];
export const getServiceBySlug = (slug: string) => services.find((service) => service.slug === slug);
export const getServiceById = (id: string) => services.find((service) => service.id === id);
export const serviceHref = (service: Service) => `/services/${service.slug}`;
export const requestHref = (service: Service) => `/start-a-project?service=${service.id}`;
