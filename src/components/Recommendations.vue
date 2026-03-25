<template>
  <section id="recomendacoes" class="section">
    <div class="container">
      <h2 class="section-title">Recomendações <span class="muted">& Depoimentos</span></h2>
      <div class="recommendations-grid">
        <div v-for="rec in recommendations" :key="rec.id" class="rec-card" data-aos="fade-up">
          <div class="rec-content">
            <p>"{{ rec.text }}"</p>
          </div>
          <div class="rec-author">
            <div class="author-info">
              <span class="author-name">{{ rec.author }}</span>
              <span class="author-role">{{ rec.role }} @ {{ rec.company }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Recommendations',
  setup() {
    const recommendations = ref([
      {
        id: 1,
        text: 'Bruno é um desenvolvedor excepcional. Sua capacidade de resolver problemas complexos com soluções elegantes e sua atenção aos detalhes tornaram nosso projeto um sucesso absoluto.',
        author: 'Guilherme Silva',
        role: 'Tech Lead',
        company: 'InovaTech'
      },
      {
        id: 2,
        text: 'Trabalhar com o Bruno foi uma experiência incrível. Ele é altamente técnico, proativo e sempre entrega código de alta qualidade no prazo.',
        author: 'Ana Costa',
        role: 'Product Manager',
        company: 'Soluções Digitais'
      },
      {
        id: 3,
        text: 'Extremamente profissional e comprometido. O Bruno entende além do código, focando sempre no valor que a solução traz para o negócio.',
        author: 'Marcos Oliveira',
        role: 'CEO',
        company: 'Startup XYZ'
      }
    ])

    return { recommendations }
  }
}
</script>

<style scoped>
.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.rec-card {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.2s ease;
}

.rec-card:hover {
  border-color: var(--text-primary);
}

.rec-content p {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-primary);
  opacity: 0.9;
  font-style: italic;
  margin-bottom: 24px;
}

.rec-author {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
}

.author-role {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.muted {
  opacity: 0.4;
  font-weight: 400;
}
</style>
