<template>
  <section id="certificacoes" class="section">
    <div class="container">
      <h2 class="section-title">Certificações <span class="muted">& Acadêmico</span></h2>
      <div class="cert-grid">
        <div v-for="cert in certifications" :key="cert.id" class="cert-card" data-aos="fade-up">
          <div class="cert-icon">
             <font-awesome-icon :icon="['fas', 'certificate']" />
          </div>
          <div class="cert-info">
            <h3>{{ cert.title }}</h3>
            <p class="issuer">{{ cert.issuer }}</p>
            <p class="date">{{ cert.date }}</p>
          </div>
          <a v-if="cert.link" :href="cert.link" target="_blank" class="cert-verify">
            Verificar <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Certifications',
  setup() {
    const certifications = ref([
      {
        id: 1,
        title: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2024',
        link: '#'
      },
      {
        id: 2,
        title: 'Meta Front-End Developer Professional Certificate',
        issuer: 'Meta / Coursera',
        date: '2023',
        link: '#'
      },
      {
        id: 3,
        title: 'Google Cloud Professional Cloud Developer',
        issuer: 'Google Cloud',
        date: '2023',
        link: '#'
      },
      {
        id: 4,
        title: 'Full Stack Web Development',
        issuer: 'Rocketseat / Alura',
        date: '2022',
        link: '#'
      }
    ])

    return { certifications }
  }
}
</script>

<style scoped>
.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.cert-card {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  position: relative;
}

.cert-card:hover {
  border-color: var(--text-primary);
  transform: translateY(-2px);
}

.cert-icon {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 16px;
  opacity: 0.8;
}

.cert-info h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  line-height: 1.3;
}

.issuer {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.date {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.cert-verify {
  margin-top: auto;
  padding-top: 16px;
  font-size: 0.85rem;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.cert-verify:hover {
  opacity: 1;
}

.muted {
  opacity: 0.4;
  font-weight: 400;
}
</style>
