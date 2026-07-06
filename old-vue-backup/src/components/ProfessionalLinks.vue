<template>
  <section id="contato-profissional" class="section professional-links">
    <div class="container">
      <div class="professional-card" data-aos="zoom-in">
        <h2 class="professional-title">Vamos nos <span class="muted">conectar?</span></h2>
        <p class="professional-description">
          Estou sempre aberto a novas oportunidades e conexões. Veja meu perfil completo e recomendações nestas plataformas.
        </p>
        <div class="links-grid">
          <a href="https://linkedin.com/in/seuusuario" target="_blank" class="link-item linkedin">
             <font-awesome-icon :icon="['fab', 'linkedin']" />
            <span>LinkedIn</span>
          </a>
          <a href="https://glassdoor.com" target="_blank" class="link-item glassdoor">
             <font-awesome-icon :icon="['fas', 'briefcase']" />
            <span>Glassdoor</span>
          </a>
          <a href="/curriculo.pdf" download class="link-item cv">
             <font-awesome-icon :icon="['fas', 'file-pdf']" />
            <span>Baixar CV</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ProfessionalLinks'
}
</script>

<style scoped>
.professional-card {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.professional-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.05em;
}

.professional-description {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 32px;
  line-height: 1.5;
}

.links-grid {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 1rem;
  border: 1px solid var(--border);
}

.link-item.linkedin {
  background: #0a66c2;
  color: white;
  border-color: #0a66c2;
}

.link-item.glassdoor {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.link-item.cv {
  background: var(--text-primary);
  color: var(--bg-primary);
}

.link-item:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.muted {
  opacity: 0.4;
  font-weight: 400;
}

@media (max-width: 768px) {
  .professional-card {
    padding: 32px 20px;
  }
  
  .links-grid {
    flex-direction: column;
  }
  
  .link-item {
    justify-content: center;
  }
}
</style>
