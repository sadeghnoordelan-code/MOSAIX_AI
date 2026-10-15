import {websitePortfolioDefaults} from './website-portfolio.ts';
import {advertisingPortfolioDefaults} from './advertising-portfolio.ts';
import {services} from '../../content/services.ts';
import {serviceWorlds} from '../../content/service-worlds.ts';
import {contact} from '../../content/contact.ts';
import {media} from '../../content/media.ts';
export const projectExample={slug:'new-project',title:'New project',summary:'',body:'',image:'',link:'',published:false};
export const toolExample={slug:'new-tool',title:'New tool',summary:'',body:'',url:'',published:false};
export const defaultContent={
 brand:{name:'MOSAIX',tagline:'AUTOMATE A BRIGHTER TOMORROW',logo:'/brand/mosaix-emblem-transparent-v1.png'},
 hero:{eyebrow:'AI Product Studio',descriptor:'Design × AI × Technology',headline:['Automate a','brighter','tomorrow.'],description:'We work at the intersection of design, software and artificial intelligence.',button:'Explore our worlds',video:media.hero.src},
 intro:{enabled:true,caption:'IDEAS · SYSTEMS · PEOPLE · IMPACT',button:'Enter MOSAIX',video:'/brand/mosaix-intro-orb-source.mp4'},
 home:{servicesEyebrow:'02 / Our worlds',servicesCaption:'Five disciplines. One MOSAIX perspective.',servicesHeading:'Ideas become',servicesMuted:'digital realities.',servicesDescription:'Explore our work across websites, applications, AI automation, films and experimental tools.',studioEyebrow:'04 / The studio',studioHeading:'People.\nPerspective.',studioMuted:'MOSAIX.',studioDescription:'An AI Product Studio at the intersection of design, software, interaction and digital experience.',studioButton:'People behind MOSAIX',ctaEyebrow:'05 / Your next possibility',ctaHeading:'Have an idea?',ctaMuted:'Let’s make it real.',ctaButton:'Start a project'},
 process:{eyebrow:'03 / How we work',heading:'From first idea.',muted:'To real impact.',description:'A clear path, shaped around your vision.',stages:[['CONNECT','Start the conversation'],['DISCOVER','Understand the vision'],['DEFINE','Shape the solution'],['CREATE','Design & build'],['REFINE','Test & perfect'],['DELIVER','Ready for the world']]},
 services:services.map(s=>({...s,...serviceWorlds[s.id],video:media[s.mediaId].src})),
 navigation:{services:'Services',projects:'Projects',lab:'Lab',about:'Studio',assistant:'MOSAIX AI',start:'Start a project'},
 worldPage:{back:'← All services',discover:'Discover the possibilities',scroll:'The world keeps moving. Scroll to explore.',capabilitiesEyebrow:'01 / What we can build',capabilitiesTitle:'Ideas, shaped into possibilities.',technicalEyebrow:'02 / Technical approach',technicalTitle:'Built with clear foundations.',scope:'The technology, integrations and final deliverables are defined around your project’s requirements.',deliveryEyebrow:'03 / Working together',deliveryTitle:'From definition to delivery.',outroEyebrow:'Your next possibility',outroTitle:'Let’s shape what comes next.'},
 servicesPage:{eyebrow:'Our worlds',title:'Five ways forward.',description:'Design, software, AI and visual storytelling, connected by one MOSAIX perspective.'},
 about:{eyebrow:'About us · Ideas / Systems / People / Impact',title:'People behind MOSAIX.',description:'We are architects, designers and AI enthusiasts, building digital solutions that connect design, technology and people to create smarter, faster and more inspiring possibilities for a brighter tomorrow.',visionTitle:'A smarter built world.',visionDescription:'By combining architectural thinking with artificial intelligence, we create digital tools and solutions that empower people to imagine, design and build a brighter future.',signature:'From ideas to impact',contactTitle:'Let’s build what’s next.',domain:'',founders:[{name:'MohammadHossein Rabanizadeh',role:'Co-Founder',portrait:'/brand/mohammadhossein-transparent-v1.png',width:1098,height:1432,skills:['Architect (M.Sc.)','Interior Design','3D Visualization','AI Specialist','Business Development']},{name:'Sadegh Noordelan',role:'Co-Founder',portrait:'/brand/sadegh-transparent-v1.png',width:1242,height:1266,skills:['Architect','Interior Design','3D Visualization','AI Specialist','Kitchen Design','Decorative Wood Design']}]},
 websitePortfolio:websitePortfolioDefaults,
 advertisingPortfolio:advertisingPortfolioDefaults,
 projectsPage:{eyebrow:'Selected work',title:'Proof through experience.',description:'Project previews, case studies and verified live experiences.',empty:'Case studies will appear here as they are approved for publication.'},
 projects:[] as typeof projectExample[],
 labPage:{eyebrow:'Tools & experiments',title:'An open space for ideas.',description:'MOSAIX Lab is the home for MOSAIX-built tools, prototypes, experiments and emerging ideas.',empty:'Experiments will appear here when they are ready to share.'},
 lab:[] as typeof toolExample[],
 projectRequest:{eyebrow:'Start a project',title:'What comes next?',description:'A new website. An application. An intelligent workflow. A story worth telling.',note:'Tell us about your idea, the outcome you need and your preferred timing. We’ll discuss the scope and next steps with you.',button:'Email your project brief'},
 meeting:{eyebrow:'Book a meeting',title:'A conversation first.',description:'A separate space to discuss your project with MOSAIX.',note:'Contact us to arrange a conversation about your idea and a suitable meeting time.'},
 contact,
 appearance:{background:'#04060a',surface:'#0c1018',text:'#e8eef6',muted:'#a0a7b4',accent:'#4b8dff',font:'Sora',textScale:1,cardRadius:24},
 assistant:{teaserMessage:'Hi, I am MOSAIX. How may I help you?',visible:true,enabled:true,greetingEnabled:true,welcomeDelaySeconds:120,welcomeMessage:'Hi, I am MOSAIX. How may I help you?',title:'A clearer next move.',description:'Tell me what you’re trying to build, improve or automate. We’ll shape the idea before deciding what you need.'},
 seo:{title:'MOSAIX — Design × AI × Technology',description:'MOSAIX is an AI Product Studio at the intersection of design, software, AI and digital experience.'}
};
export type SiteContent=typeof defaultContent;
