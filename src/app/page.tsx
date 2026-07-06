import {
  getSiteSettings,
  getHeroSettings,
  getStatsSettings,
  getTimelineSettings,
  getProjects,
  getTechnologies,
  getSkills,
  getThemeConfig,
  getServices,
  getTestimonials,
  getCaseRealSettings,
  getEducation,
  getCertifications,
  getSectionsSettings
} from "@/lib/dataService";
import ClientPage from "./ClientPage";

export const dynamic = "force-dynamic"; // Garante que a Landing Page mostre os dados do Firestore instantaneamente

export default async function Home() {
  // Busca todas as configurações e dados dinâmicos de forma paralela no servidor
  const [
    siteSettings,
    heroSettings,
    statsSettings,
    timelineSettings,
    projects,
    technologies,
    skills,
    themeConfig,
    services,
    testimonials,
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
    getThemeConfig(),
    getServices(),
    getTestimonials(),
    getCaseRealSettings(),
    getEducation(),
    getCertifications(),
    getSectionsSettings()
  ]);

  return (
    <ClientPage
      siteSettings={siteSettings}
      heroSettings={heroSettings}
      statsSettings={statsSettings}
      timelineSettings={timelineSettings}
      projects={projects}
      technologies={technologies}
      skills={skills}
      themeConfig={themeConfig}
      services={services}
      testimonials={testimonials}
      caseReal={caseReal}
      education={education}
      certifications={certifications}
      sectionsSettings={sectionsSettings}
    />
  );
}
