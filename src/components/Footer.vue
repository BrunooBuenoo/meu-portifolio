<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>BB</h3>
          <p>Desenvolvedor Full Stack</p>
        </div>
        
        <div class="footer-section">
          <h4>Navegação</h4>
          <div class="footer-links">
            <router-link to="/">Início</router-link>
            <router-link to="/projetos">Projetos</router-link>
            <router-link to="/tecnologias">Tecnologias</router-link>
            <router-link to="/sobre">Sobre</router-link>
            <router-link to="/contato">Contato</router-link>
          </div>
        </div>
        
        <div class="footer-section">
          <h4>Social</h4>
          <div class="social-links">
            <a href="#" target="_blank">GitHub</a>
            <a href="#" target="_blank">Instagram</a>
            <a href="#" target="_blank">LinkedIn</a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2025 Bruno Bueno. Todos os direitos reservados.</p>
        <div class="footer-bottom-links">
          <a href="#">Política de Privacidade</a>
          <a href="#">Termos de Uso</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  padding: 60px 0 24px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section h3 {
  color: var(--accent);
  font-size: 1.5rem;
  margin-bottom: 16px;
}

.footer-section h4 {
  color: var(--text-primary);
  margin-bottom: 16px;
}

.footer-section p {
  color: var(--text-secondary);
}

.footer-links,
.social-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-links a,
.social-links a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover,
.social-links a:hover {
  color: var(--accent);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
  gap: 16px;
}

.footer-bottom p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.footer-bottom-links {
  display: flex;
  gap: 24px;
}

.footer-bottom-links a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-bottom-links a:hover {
  color: var(--accent);
}

@media (max-width: 768px) {
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
