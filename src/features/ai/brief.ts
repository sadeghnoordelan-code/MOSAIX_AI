import type { ProjectState } from './types.ts';
import type {Locale} from '../i18n/locale.ts';
const headings={
 en:['Business','Goal','Requirements','Preferences','Constraints','Confirmed decisions','Excluded options','Requested timeline','User-provided budget constraint (not a MOSAIX quote)','Preferred contact','To clarify'],
 ar:['النشاط','الهدف','المتطلبات','التفضيلات','القيود','القرارات المؤكدة','الخيارات المستبعدة','الجدول الزمني المطلوب','قيد الميزانية الذي ذكره المستخدم (ليس عرض سعر من MOSAIX)','وسيلة التواصل المفضلة','نقاط تحتاج إلى توضيح']
};
/** Only user facts, with localized labels. Never an offer or automatic submission. */
export function projectBrief(project:ProjectState,locale:Locale='en'):string {
 const h=headings[locale],separator=locale==='ar'?'؛ ':'; ';
 return [project.summary,
 project.business&&`${h[0]}: ${project.business}`,
 project.goal&&`${h[1]}: ${project.goal}`,
 project.requirements.length&&`${h[2]}: ${project.requirements.join(separator)}`,
 project.preferences.length&&`${h[3]}: ${project.preferences.join(separator)}`,
 project.constraints.length&&`${h[4]}: ${project.constraints.join(separator)}`,
 project.decisions.length&&`${h[5]}: ${project.decisions.join(separator)}`,
 project.rejectedOptions.length&&`${h[6]}: ${project.rejectedOptions.join(separator)}`,
 project.timeline&&`${h[7]}: ${project.timeline}`,
 project.budget&&`${h[8]}: ${project.budget}`,
 project.contactPreference&&`${h[9]}: ${project.contactPreference}`,
 project.openQuestions.length&&`${h[10]}: ${project.openQuestions.join(separator)}`
 ].filter(Boolean).join('\n\n');
}

