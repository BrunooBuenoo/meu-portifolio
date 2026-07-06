import { db } from "./firebase";
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, updateDoc, query, orderBy } from "firebase/firestore";

// ==========================================
// AUXILIAR DE SERIALIZAÇÃO PARA NEXT.JS (RSC)
// ==========================================
function serializeFirestoreData(data: any): any {
  if (data === null || data === undefined) return data;
  
  // Se for um Timestamp do Firestore (possui toDate)
  if (typeof data.toDate === "function") {
    return data.toDate().toISOString();
  }
  
  // Se for uma instância de Date
  if (data instanceof Date) {
    return data.toISOString();
  }
  
  // Se for array
  if (Array.isArray(data)) {
    return data.map(serializeFirestoreData);
  }
  
  // Se for objeto (e não Date/Timestamp)
  if (typeof data === "object") {
    const clean: any = {};
    for (const key of Object.keys(data)) {
      // Ignorar funções do protótipo
      clean[key] = serializeFirestoreData(data[key]);
    }
    return clean;
  }
  
  return data;
}

// ==========================================
// CONFIGURAÇÕES PADRÃO DAS SEÇÕES DA LP
// ==========================================
export const DEFAULT_SECTIONS = {
  sobreMim: true,
  servicos: true,
  projetos: true,
  jornada: true,
  casoReal: true,
  depoimentos: true,
  certificacoes: true,
  contato: true,
  stats: true
};

export const MOCK_THEME_COLORS = {
  light: {
    primary: "#ffffff",
    secondary: "#fafafa",
    card: "#f4f4f5",
    textPrimary: "#09090b",
    textSecondary: "#52525b",
    textMuted: "#71717a",
    accent: "#09090b",
    accentHover: "rgba(9,9,11,0.85)",
    border: "#e4e4e7"
  },
  dark: {
    primary: "#09090b",
    secondary: "#09090b",
    card: "rgba(9,9,11,0.5)",
    textPrimary: "#ffffff",
    textSecondary: "rgba(255,255,255,0.7)",
    textMuted: "rgba(255,255,255,0.4)",
    accent: "#94ff47",
    accentHover: "#a8ff6b",
    border: "#27272a"
  }
};

export const MOCK_THEME_CONFIG = {
  light: {
    heroBackground: {
      circleColor: "rgba(9,9,11,0.05)",
      circleOpacity: 10,
      circleSize: 80,
      circleX: 50,
      circleY: 50,
      innerGlowColor: "#fafafa",
      innerGlowOpacity: 5,
      outerGlowColor: "#ffffff",
      outerGlowOpacity: 2
    }
  },
  dark: {
    heroBackground: {
      circleColor: "#94ff47",
      circleOpacity: 15,
      circleSize: 80,
      circleX: 50,
      circleY: 50,
      innerGlowColor: "#94ff47",
      innerGlowOpacity: 8,
      outerGlowColor: "#09090b",
      outerGlowOpacity: 3
    }
  }
};

// ==========================================
// FUNÇÕES DE LEITURA (GETTERS SANITIZADOS)
// ==========================================

export async function getSiteSettings() {
  if (!db) return {};
  try {
    const docRef = doc(db, "settings", "site");
    const snap = await getDoc(docRef);
    return serializeFirestoreData(snap.exists() ? snap.data() : {});
  } catch (error) {
    console.warn("Erro ao obter site settings do Firestore:", error);
    return {};
  }
}

export async function getHeroSettings() {
  if (!db) return { messages: [] };
  try {
    const docRef = doc(db, "settings", "hero");
    const snap = await getDoc(docRef);
    return serializeFirestoreData(snap.exists() ? snap.data() : { messages: [] });
  } catch (error) {
    console.warn("Erro ao obter hero settings do Firestore:", error);
    return { messages: [] };
  }
}

export async function getStatsSettings() {
  if (!db) return { stats: [] };
  try {
    const docRef = doc(db, "settings", "stats");
    const snap = await getDoc(docRef);
    return serializeFirestoreData(snap.exists() ? snap.data() : { stats: [] });
  } catch (error) {
    console.warn("Erro ao obter stats settings do Firestore:", error);
    return { stats: [] };
  }
}

export async function getTimelineSettings() {
  if (!db) return { timeline: [] };
  try {
    const docRef = doc(db, "settings", "timeline");
    const snap = await getDoc(docRef);
    return serializeFirestoreData(snap.exists() ? snap.data() : { timeline: [] });
  } catch (error) {
    console.warn("Erro ao obter timeline settings do Firestore:", error);
    return { timeline: [] };
  }
}

export async function getProjects() {
  if (!db) return [];
  try {
    const queryCol = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const snap = await getDocs(queryCol);
    if (snap.empty) return [];
    const list = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    return serializeFirestoreData(list);
  } catch (error) {
    console.warn("Erro ao obter projetos do Firestore:", error);
    return [];
  }
}

export async function getTechnologies() {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "technologies"));
    if (snap.empty) return [];
    const list = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    return serializeFirestoreData(list);
  } catch (error) {
    console.warn("Erro ao obter tecnologias do Firestore:", error);
    return [];
  }
}

export async function getSkills() {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "skills"));
    if (snap.empty) return [];
    const list = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    return serializeFirestoreData(list);
  } catch (error) {
    console.warn("Erro ao obter habilidades do Firestore:", error);
    return [];
  }
}

export async function getServices() {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "services"));
    if (snap.empty) return [];
    const list = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    return serializeFirestoreData(list);
  } catch (error) {
    console.warn("Erro ao obter serviços do Firestore:", error);
    return [];
  }
}

export async function getTestimonials() {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "testimonials"));
    if (snap.empty) return [];
    const list = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    return serializeFirestoreData(list);
  } catch (error) {
    console.warn("Erro ao obter depoimentos do Firestore:", error);
    return [];
  }
}

export async function getThemeColors() {
  if (!db) return MOCK_THEME_COLORS;
  try {
    const docRef = doc(db, "theme", "colors");
    const snap = await getDoc(docRef);
    return serializeFirestoreData(snap.exists() ? snap.data() : MOCK_THEME_COLORS);
  } catch (error) {
    console.warn("Erro ao obter cores do tema do Firestore, usando Mock:", error);
    return MOCK_THEME_COLORS;
  }
}

export async function getThemeConfig() {
  if (!db) return MOCK_THEME_CONFIG;
  try {
    const docRef = doc(db, "theme", "config");
    const snap = await getDoc(docRef);
    return serializeFirestoreData(snap.exists() ? snap.data() : MOCK_THEME_CONFIG);
  } catch (error) {
    console.warn("Erro ao obter config do tema do Firestore, usando Mock:", error);
    return MOCK_THEME_CONFIG;
  }
}

export async function getCaseRealSettings() {
  if (!db) return { highlights: [] };
  try {
    const docRef = doc(db, "settings", "caseReal");
    const snap = await getDoc(docRef);
    return serializeFirestoreData(snap.exists() ? snap.data() : { highlights: [] });
  } catch (error) {
    console.warn("Erro ao obter case real do Firestore:", error);
    return { highlights: [] };
  }
}

export async function getEducation() {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "education"));
    if (snap.empty) return [];
    const list = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    return serializeFirestoreData(list);
  } catch (error) {
    console.warn("Erro ao obter educação do Firestore:", error);
    return [];
  }
}

export async function getCertifications() {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "certifications"));
    if (snap.empty) return [];
    const list = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    return serializeFirestoreData(list);
  } catch (error) {
    console.warn("Erro ao obter certificações do Firestore:", error);
    return [];
  }
}

export async function getSectionsSettings() {
  if (!db) return DEFAULT_SECTIONS;
  try {
    const docRef = doc(db, "settings", "sections");
    const snap = await getDoc(docRef);
    return serializeFirestoreData(snap.exists() ? snap.data() : DEFAULT_SECTIONS);
  } catch (error) {
    console.warn("Erro ao obter configurações de seções:", error);
    return DEFAULT_SECTIONS;
  }
}

export async function sendContactMessage(name: string, email: string, message: string) {
  if (!db) {
    console.log("Mock: Mensagem enviada com sucesso!", { name, email, message });
    return true;
  }
  try {
    await addDoc(collection(db, "messages"), {
      name,
      email,
      message,
      createdAt: new Date(),
      read: false
    });
    return true;
  } catch (error) {
    console.error("Erro ao enviar mensagem para o Firestore:", error);
    throw error;
  }
}

// ==========================================
// FUNÇÕES DE ESCRITA / CRUD (ADMIN PANEL)
// ==========================================

export async function updateSiteSettings(data: any) {
  if (!db) return true;
  try {
    const docRef = doc(db, "settings", "site");
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (error) {
    console.error("Erro ao atualizar site settings:", error);
    throw error;
  }
}

export async function updateHeroSettings(data: any) {
  if (!db) return true;
  try {
    const docRef = doc(db, "settings", "hero");
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (error) {
    console.error("Erro ao atualizar hero settings:", error);
    throw error;
  }
}

export async function updateStatsSettings(data: any) {
  if (!db) return true;
  try {
    const docRef = doc(db, "settings", "stats");
    await setDoc(docRef, data);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar stats settings:", error);
    throw error;
  }
}

export async function updateTimelineSettings(data: any) {
  if (!db) return true;
  try {
    const docRef = doc(db, "settings", "timeline");
    await setDoc(docRef, data);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar timeline settings:", error);
    throw error;
  }
}

export async function updateCaseRealSettings(data: any) {
  if (!db) return true;
  try {
    const docRef = doc(db, "settings", "caseReal");
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (error) {
    console.error("Erro ao atualizar caseReal settings:", error);
    throw error;
  }
}

export async function updateSectionsSettings(data: any) {
  if (!db) return true;
  try {
    const docRef = doc(db, "settings", "sections");
    await setDoc(docRef, data);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar sections settings:", error);
    throw error;
  }
}

export async function saveProject(project: any) {
  if (!db) return true;
  try {
    const { id, ...data } = project;
    if (id && !id.startsWith("proj-")) {
      const docRef = doc(db, "projects", id);
      await setDoc(docRef, { ...data, updatedAt: new Date() }, { merge: true });
    } else {
      const colRef = collection(db, "projects");
      await addDoc(colRef, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    return true;
  } catch (error) {
    console.error("Erro ao salvar projeto:", error);
    throw error;
  }
}

export async function deleteProject(id: string) {
  if (!db) return true;
  try {
    const docRef = doc(db, "projects", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Erro ao deletar projeto:", error);
    throw error;
  }
}

export async function saveTechnology(tech: any) {
  if (!db) return true;
  try {
    const { id, ...data } = tech;
    if (id && !id.startsWith("tech-")) {
      const docRef = doc(db, "technologies", id);
      await setDoc(docRef, { ...data, updatedAt: new Date() }, { merge: true });
    } else {
      const colRef = collection(db, "technologies");
      await addDoc(colRef, { ...data, createdAt: new Date(), updatedAt: new Date() });
    }
    return true;
  } catch (error) {
    console.error("Erro ao salvar tecnologia:", error);
    throw error;
  }
}

export async function deleteTechnology(id: string) {
  if (!db) return true;
  try {
    const docRef = doc(db, "technologies", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Erro ao deletar tecnologia:", error);
    throw error;
  }
}

export async function saveSkill(skill: any) {
  if (!db) return true;
  try {
    const { id, ...data } = skill;
    if (id && !id.startsWith("skill-")) {
      const docRef = doc(db, "skills", id);
      await setDoc(docRef, { ...data, updatedAt: new Date() }, { merge: true });
    } else {
      const colRef = collection(db, "skills");
      await addDoc(colRef, { ...data, createdAt: new Date(), updatedAt: new Date() });
    }
    return true;
  } catch (error) {
    console.error("Erro ao salvar habilidade:", error);
    throw error;
  }
}

export async function deleteSkill(id: string) {
  if (!db) return true;
  try {
    const docRef = doc(db, "skills", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Erro ao deletar habilidade:", error);
    throw error;
  }
}

export async function saveService(service: any) {
  if (!db) return true;
  try {
    const { id, ...data } = service;
    if (id && !id.startsWith("serv-")) {
      const docRef = doc(db, "services", id);
      await setDoc(docRef, { ...data, updatedAt: new Date() }, { merge: true });
    } else {
      const colRef = collection(db, "services");
      await addDoc(colRef, { ...data, createdAt: new Date(), updatedAt: new Date() });
    }
    return true;
  } catch (error) {
    console.error("Erro ao salvar serviço:", error);
    throw error;
  }
}

export async function deleteService(id: string) {
  if (!db) return true;
  try {
    const docRef = doc(db, "services", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Erro ao deletar serviço:", error);
    throw error;
  }
}

export async function saveTestimonial(testimonial: any) {
  if (!db) return true;
  try {
    const { id, ...data } = testimonial;
    if (id && !id.startsWith("test-")) {
      const docRef = doc(db, "testimonials", id);
      await setDoc(docRef, { ...data, updatedAt: new Date() }, { merge: true });
    } else {
      const colRef = collection(db, "testimonials");
      await addDoc(colRef, { ...data, createdAt: new Date(), updatedAt: new Date() });
    }
    return true;
  } catch (error) {
    console.error("Erro ao salvar depoimento:", error);
    throw error;
  }
}

export async function deleteTestimonial(id: string) {
  if (!db) return true;
  try {
    const docRef = doc(db, "testimonials", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Erro ao deletar depoimento:", error);
    throw error;
  }
}

export async function saveEducation(edu: any) {
  if (!db) return true;
  try {
    const { id, ...data } = edu;
    if (id && !id.startsWith("edu-")) {
      const docRef = doc(db, "education", id);
      await setDoc(docRef, { ...data, updatedAt: new Date() }, { merge: true });
    } else {
      const colRef = collection(db, "education");
      await addDoc(colRef, { ...data, createdAt: new Date(), updatedAt: new Date() });
    }
    return true;
  } catch (error) {
    console.error("Erro ao salvar educação:", error);
    throw error;
  }
}

export async function deleteEducation(id: string) {
  if (!db) return true;
  try {
    const docRef = doc(db, "education", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Erro ao deletar educação:", error);
    throw error;
  }
}

export async function saveCertification(cert: any) {
  if (!db) return true;
  try {
    const { id, ...data } = cert;
    if (id && !id.startsWith("cert-")) {
      const docRef = doc(db, "certifications", id);
      await setDoc(docRef, { ...data, updatedAt: new Date() }, { merge: true });
    } else {
      const colRef = collection(db, "certifications");
      await addDoc(colRef, { ...data, createdAt: new Date(), updatedAt: new Date() });
    }
    return true;
  } catch (error) {
    console.error("Erro ao salvar certificação:", error);
    throw error;
  }
}

export async function deleteCertification(id: string) {
  if (!db) return true;
  try {
    const docRef = doc(db, "certifications", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Erro ao deletar certificação:", error);
    throw error;
  }
}

export async function getContactMessages() {
  if (!db) return [];
  try {
    const queryCol = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const snap = await getDocs(queryCol);
    const list = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    return serializeFirestoreData(list);
  } catch (error) {
    console.error("Erro ao obter mensagens:", error);
    return [];
  }
}

export async function markMessageAsRead(id: string) {
  if (!db) return true;
  try {
    const docRef = doc(db, "messages", id);
    await updateDoc(docRef, { read: true });
    return true;
  } catch (error) {
    console.error("Erro ao marcar mensagem como lida:", error);
    throw error;
  }
}
