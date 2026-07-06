import {
  getSiteSettings,
  getHeroSettings,
  getStatsSettings,
  getTimelineSettings,
  getProjects,
  getTechnologies,
  getSkills,
  getServices,
  getTestimonials,
  getThemeColors,
  getThemeConfig,
  getContactMessages,
  getCaseRealSettings,
  getEducation,
  getCertifications,
  getSectionsSettings
} from "@/lib/dataService";
import ClientAdmin from "./ClientAdmin";

// Desativa o cache estático para a rota admin para garantir dados sempre atualizados
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [
    siteSettings,
    heroSettings,
    statsSettings,
    timelineSettings,
    projects,
    technologies,
    skills,
    services,
    testimonials,
    themeColors,
    themeConfig,
    contactMessages,
    caseReal,
    education,
    certifications,
    sectionsSettings
  ] = await Promise.all([
    getSiteSettings(),
    getHeroSettings(),
    getStatsSettings(),
    getTimelineSettings(),
    getProjects(),
    getTechnologies(),
    getSkills(),
    getServices(),
    getTestimonials(),
    getThemeColors(),
    getThemeConfig(),
    getContactMessages(),
    getCaseRealSettings(),
    getEducation(),
    getCertifications(),
    getSectionsSettings()
  ]);

  return (
    <ClientAdmin
      siteSettings={siteSettings}
      heroSettings={heroSettings}
      statsSettings={statsSettings}
      timelineSettings={timelineSettings}
      projects={projects}
      technologies={technologies}
      skills={skills}
      services={services}
      testimonials={testimonials}
      themeColors={themeColors}
      themeConfig={themeConfig}
      initialMessages={contactMessages}
      initialCaseReal={caseReal}
      initialEducation={education}
      initialCertifications={certifications}
      initialSectionsSettings={sectionsSettings}
    />
  );
}
