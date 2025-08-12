<template>
  <div class="admin-container">
    <!-- Status de Conexão -->
    <div v-if="connectionStatus" class="connection-status" :class="connectionStatus.type">
      {{ connectionStatus.message }}
    </div>

    <div class="admin-header">
      <h1>Painel Administrativo</h1>
      <div class="admin-user-info">
        <span v-if="user">{{ user.email }}</span>
        <button @click="logout" class="admin-btn admin-btn-secondary">Sair</button>
      </div>
    </div>

    <div class="admin-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['admin-tab', { active: activeTab === tab.id }]"
      >
        {{ tab.name }}
      </button>
    </div>

    <div class="admin-content">
      <!-- Tema Tab -->
      <div v-if="activeTab === 'theme'" class="admin-section">
        <h2>Configurações de Tema</h2>
        
        <!-- Cores do Tema -->
        <div class="theme-section">
          <h3>Cores do Tema</h3>
          <div class="theme-modes">
            <div class="theme-mode">
              <h4>Tema Escuro</h4>
              <div class="color-grid">
                <div class="color-input-group">
                  <label>Cor Principal:</label>
                  <input type="color" v-model="themeColors.dark.primary" @input="applyTheme">
                </div>
                <div class="color-input-group">
                  <label>Cor Secundária:</label>
                  <input type="color" v-model="themeColors.dark.secondary" @input="applyTheme">
                </div>
                <div class="color-input-group">
                  <label>Cor de Destaque:</label>
                  <input type="color" v-model="themeColors.dark.accent" @input="applyTheme">
                </div>
                <div class="color-input-group">
                  <label>Cor do Card:</label>
                  <input type="color" v-model="themeColors.dark.card" @input="applyTheme">
                </div>
                <div class="color-input-group">
                  <label>Cor da Borda:</label>
                  <input type="color" v-model="themeColors.dark.border" @input="applyTheme">
                </div>
                <div class="color-input-group">
                  <label>Texto Primário:</label>
                  <input type="color" v-model="themeColors.dark.textPrimary" @input="applyTheme">
                </div>
                <div class="color-input-group">
                  <label>Texto Secundário:</label>
                  <input type="color" v-model="themeColors.dark.textSecondary" @input="applyTheme">
                </div>
                <div class="color-input-group">
                  <label>Texto Muted:</label>
                  <input type="color" v-model="themeColors.dark.textMuted" @input="applyTheme">
                </div>
                <div class="color-input-group">
                  <label>Hover do Destaque:</label>
                  <input type="color" v-model="themeColors.dark.accentHover" @input="applyTheme">
                </div>
              </div>
            </div>

            <div class="theme-mode">
              <h4>Tema Claro</h4>
              <div class="color-grid">
                <div class="color-input-group">
                  <label>Cor Principal:</label>
                  <input type="color" v-model="themeColors.light.primary" @input="applyTheme">
                </div>
                <div class="color-input-group">
                  <label>Cor Secundária:</label>
                  <input type="color" v-model="themeColors.light.secondary" @input="applyTheme">
                </div>
                <div class="color-input-group">
                  <label>Cor de Destaque:</label>
                  <input type="color" v-model="themeColors.light.accent" @input="applyTheme">
                </div>
                <div class="color-input-group">
                  <label>Cor do Card:</label>
                  <input type="color" v-model="themeColors.light.card" @input="applyTheme">
                </div>
                <div class="color-input-group">
                  <label>Cor da Borda:</label>
                  <input type="color" v-model="themeColors.light.border" @input="applyTheme">
                </div>
                <div class="color-input-group">
                  <label>Texto Primário:</label>
                  <input type="color" v-model="themeColors.light.textPrimary" @input="applyTheme">
                </div>
                <div class="color-input-group">
                  <label>Texto Secundário:</label>
                  <input type="color" v-model="themeColors.light.textSecondary" @input="applyTheme">
                </div>
                <div class="color-input-group">
                  <label>Texto Muted:</label>
                  <input type="color" v-model="themeColors.light.textMuted" @input="applyTheme">
                </div>
                <div class="color-input-group">
                  <label>Hover do Destaque:</label>
                  <input type="color" v-model="themeColors.light.accentHover" @input="applyTheme">
                </div>
              </div>
            </div>
          </div>

          <div class="admin-form-actions">
            <button @click="saveThemeColors" :disabled="saving" class="admin-btn admin-btn-primary">
              {{ saving ? 'Salvando...' : 'Salvar Cores' }}
            </button>
            <button @click="testConnection" class="admin-btn admin-btn-secondary">
              Testar Conexão
            </button>
          </div>
        </div>

        <!-- Hero Background Configuration -->
        <div class="theme-section">
          <h3>Background do Hero</h3>
          <div class="theme-modes">
            <div class="theme-mode">
              <h4>Tema Escuro</h4>
              <div class="hero-config-grid">
                <!-- Circle Configuration -->
                <div class="config-group">
                  <h5>Configuração do Círculo</h5>
                  <div class="color-input-group">
                    <label>Cor do Círculo:</label>
                    <input type="color" v-model="themeConfig.dark.heroBackground.circleColor" @input="applyTheme">
                  </div>
                  <div class="slider-input-group">
                    <label>Opacidade do Círculo: {{ themeConfig.dark.heroBackground.circleOpacity }}%</label>
                    <input type="range" min="0" max="100" v-model="themeConfig.dark.heroBackground.circleOpacity" @input="applyTheme">
                  </div>
                  <div class="slider-input-group">
                    <label>Tamanho do Círculo: {{ themeConfig.dark.heroBackground.circleSize }}%</label>
                    <input type="range" min="50" max="200" v-model="themeConfig.dark.heroBackground.circleSize" @input="applyTheme">
                  </div>
                  <div class="slider-input-group">
                    <label>Posição Horizontal: {{ themeConfig.dark.heroBackground.circleX }}%</label>
                    <input type="range" min="-50" max="150" v-model="themeConfig.dark.heroBackground.circleX" @input="applyTheme">
                  </div>
                  <div class="slider-input-group">
                    <label>Posição Vertical: {{ themeConfig.dark.heroBackground.circleY }}%</label>
                    <input type="range" min="-50" max="150" v-model="themeConfig.dark.heroBackground.circleY" @input="applyTheme">
                  </div>
                </div>

                <!-- Inner Glow Configuration -->
                <div class="config-group">
                  <h5>Brilho Interno</h5>
                  <div class="color-input-group">
                    <label>Cor do Brilho Interno:</label>
                    <input type="color" v-model="themeConfig.dark.heroBackground.innerGlowColor" @input="applyTheme">
                  </div>
                  <div class="slider-input-group">
                    <label>Opacidade do Brilho Interno: {{ themeConfig.dark.heroBackground.innerGlowOpacity }}%</label>
                    <input type="range" min="0" max="100" v-model="themeConfig.dark.heroBackground.innerGlowOpacity" @input="applyTheme">
                  </div>
                </div>

                <!-- Outer Glow Configuration -->
                <div class="config-group">
                  <h5>Brilho Externo</h5>
                  <div class="color-input-group">
                    <label>Cor do Brilho Externo:</label>
                    <input type="color" v-model="themeConfig.dark.heroBackground.outerGlowColor" @input="applyTheme">
                  </div>
                  <div class="slider-input-group">
                    <label>Opacidade do Brilho Externo: {{ themeConfig.dark.heroBackground.outerGlowOpacity }}%</label>
                    <input type="range" min="0" max="100" v-model="themeConfig.dark.heroBackground.outerGlowOpacity" @input="applyTheme">
                  </div>
                </div>
              </div>
            </div>

            <div class="theme-mode">
              <h4>Tema Claro</h4>
              <div class="hero-config-grid">
                <!-- Circle Configuration -->
                <div class="config-group">
                  <h5>Configuração do Círculo</h5>
                  <div class="color-input-group">
                    <label>Cor do Círculo:</label>
                    <input type="color" v-model="themeConfig.light.heroBackground.circleColor" @input="applyTheme">
                  </div>
                  <div class="slider-input-group">
                    <label>Opacidade do Círculo: {{ themeConfig.light.heroBackground.circleOpacity }}%</label>
                    <input type="range" min="0" max="100" v-model="themeConfig.light.heroBackground.circleOpacity" @input="applyTheme">
                  </div>
                  <div class="slider-input-group">
                    <label>Tamanho do Círculo: {{ themeConfig.light.heroBackground.circleSize }}%</label>
                    <input type="range" min="50" max="200" v-model="themeConfig.light.heroBackground.circleSize" @input="applyTheme">
                  </div>
                  <div class="slider-input-group">
                    <label>Posição Horizontal: {{ themeConfig.light.heroBackground.circleX }}%</label>
                    <input type="range" min="-50" max="150" v-model="themeConfig.light.heroBackground.circleX" @input="applyTheme">
                  </div>
                  <div class="slider-input-group">
                    <label>Posição Vertical: {{ themeConfig.light.heroBackground.circleY }}%</label>
                    <input type="range" min="-50" max="150" v-model="themeConfig.light.heroBackground.circleY" @input="applyTheme">
                  </div>
                </div>

                <!-- Inner Glow Configuration -->
                <div class="config-group">
                  <h5>Brilho Interno</h5>
                  <div class="color-input-group">
                    <label>Cor do Brilho Interno:</label>
                    <input type="color" v-model="themeConfig.light.heroBackground.innerGlowColor" @input="applyTheme">
                  </div>
                  <div class="slider-input-group">
                    <label>Opacidade do Brilho Interno: {{ themeConfig.light.heroBackground.innerGlowOpacity }}%</label>
                    <input type="range" min="0" max="100" v-model="themeConfig.light.heroBackground.innerGlowOpacity" @input="applyTheme">
                  </div>
                </div>

                <!-- Outer Glow Configuration -->
                <div class="config-group">
                  <h5>Brilho Externo</h5>
                  <div class="color-input-group">
                    <label>Cor do Brilho Externo:</label>
                    <input type="color" v-model="themeConfig.light.heroBackground.outerGlowColor" @input="applyTheme">
                  </div>
                  <div class="slider-input-group">
                    <label>Opacidade do Brilho Externo: {{ themeConfig.light.heroBackground.outerGlowOpacity }}%</label>
                    <input type="range" min="0" max="100" v-model="themeConfig.light.heroBackground.outerGlowOpacity" @input="applyTheme">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Hero Background Preview -->
          <div class="hero-preview">
            <h5>Preview do Background</h5>
            <div class="hero-preview-container">
              <div class="hero-preview-background"></div>
              <div class="hero-preview-content">
                <h3>Preview do Hero</h3>
                <p>Visualização do background futurístico</p>
              </div>
            </div>
          </div>

          <div class="admin-form-actions">
            <button @click="saveThemeConfig" :disabled="saving" class="admin-btn admin-btn-primary">
              {{ saving ? 'Salvando...' : 'Salvar Hero Background' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Hero Tab -->
      <div v-if="activeTab === 'hero'" class="admin-section">
        <h2>Configurações do Hero</h2>
        
        <div class="hero-config-section">
          <h3>Mensagens do Typing Effect</h3>
          <div class="messages-list">
            <div v-for="(message, index) in heroConfig.messages" :key="index" class="message-item">
              <input v-model="heroConfig.messages[index]" class="admin-input" placeholder="Digite a mensagem">
              <button @click="removeHeroMessage(index)" class="admin-btn admin-btn-danger admin-btn-sm">Remover</button>
            </div>
          </div>
          <button @click="addHeroMessage" class="admin-btn admin-btn-secondary">+ Nova Mensagem</button>
        </div>

        <div class="hero-config-section">
          <h3>Configurações de Velocidade</h3>
          <div class="config-grid">
            <div class="form-group">
              <label>Velocidade de Digitação (ms):</label>
              <input type="number" v-model="heroConfig.typingSpeed" class="admin-input">
            </div>
            <div class="form-group">
              <label>Velocidade de Apagar (ms):</label>
              <input type="number" v-model="heroConfig.deletingSpeed" class="admin-input">
            </div>
            <div class="form-group">
              <label>Pausa no Final (ms):</label>
              <input type="number" v-model="heroConfig.pauseEnd" class="admin-input">
            </div>
            <div class="form-group">
              <label>Pausa no Início (ms):</label>
              <input type="number" v-model="heroConfig.pauseStart" class="admin-input">
            </div>
          </div>
        </div>

        <div class="admin-form-actions">
          <button @click="saveHeroConfig" :disabled="saving" class="admin-btn admin-btn-primary">
            {{ saving ? 'Salvando...' : 'Salvar Hero' }}
          </button>
        </div>
      </div>

      <!-- Stats Tab -->
      <div v-if="activeTab === 'stats'" class="admin-section">
        <div class="section-header">
          <h2>Gerenciar Estatísticas</h2>
          <button @click="openStatsModal" class="admin-btn admin-btn-primary">Nova Estatística</button>
        </div>

        <div class="stats-admin-grid">
          <div v-for="(stat, index) in statsConfig" :key="index" class="stats-admin-card">
            <div class="stats-icon">{{ stat.icon }}</div>
            <div class="stats-content">
              <h3>{{ stat.number }}{{ stat.suffix }}</h3>
              <p>{{ stat.label }}</p>
              <div class="stats-actions">
                <button @click="editStats(index)" class="admin-btn admin-btn-sm admin-btn-secondary">Editar</button>
                <button @click="deleteStats(index)" class="admin-btn admin-btn-sm admin-btn-danger">Excluir</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Modal -->
        <div v-if="showStatsModal" class="admin-modal-overlay" @click="closeStatsModal">
          <div class="admin-modal-content" @click.stop>
            <div class="admin-modal-header">
              <h3>{{ editingStats ? 'Editar Estatística' : 'Nova Estatística' }}</h3>
              <button @click="closeStatsModal" class="admin-modal-close">&times;</button>
            </div>
            <div class="admin-modal-body">
              <form @submit.prevent="saveStats" class="stats-form">
                <div class="form-group">
                  <label>Ícone (Emoji):</label>
                  <input type="text" v-model="statsForm.icon" required class="admin-input" placeholder="🚀">
                </div>
                <div class="form-group">
                  <label>Número:</label>
                  <input type="number" v-model="statsForm.number" required class="admin-input">
                </div>
                <div class="form-group">
                  <label>Sufixo:</label>
                  <input type="text" v-model="statsForm.suffix" class="admin-input" placeholder="+ ou %">
                </div>
                <div class="form-group">
                  <label>Descrição:</label>
                  <input type="text" v-model="statsForm.label" required class="admin-input">
                </div>
                <div class="admin-form-actions">
                  <button type="submit" :disabled="saving" class="admin-btn admin-btn-primary">
                    {{ saving ? 'Salvando...' : (editingStats ? 'Atualizar' : 'Criar') }}
                  </button>
                  <button type="button" @click="closeStatsModal" class="admin-btn admin-btn-secondary">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline Tab -->
      <div v-if="activeTab === 'timeline'" class="admin-section">
        <div class="section-header">
          <h2>Gerenciar Timeline</h2>
          <button @click="openTimelineModal" class="admin-btn admin-btn-primary">Nova Experiência</button>
        </div>

        <div class="timeline-admin-list">
          <div v-for="(item, index) in timelineItems" :key="index" class="timeline-admin-card">
            <div class="timeline-admin-content">
              <div class="timeline-admin-date">{{ item.date }}</div>
              <h3>{{ item.title }}</h3>
              <p class="timeline-admin-company">{{ item.company }}</p>
              <p class="timeline-admin-desc">{{ truncateText(item.description, 100) }}</p>
              <div class="timeline-admin-skills">
                <span v-for="skill in item.skills.slice(0, 3)" :key="skill" class="skill-tag">{{ skill }}</span>
                <span v-if="item.skills.length > 3" class="skill-more">+{{ item.skills.length - 3 }}</span>
              </div>
              <div class="timeline-admin-actions">
                <button @click="editTimeline(index)" class="admin-btn admin-btn-sm admin-btn-secondary">Editar</button>
                <button @click="deleteTimeline(index)" class="admin-btn admin-btn-sm admin-btn-danger">Excluir</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline Modal -->
        <div v-if="showTimelineModal" class="admin-modal-overlay" @click="closeTimelineModal">
          <div class="admin-modal-content" @click.stop>
            <div class="admin-modal-header">
              <h3>{{ editingTimeline ? 'Editar Experiência' : 'Nova Experiência' }}</h3>
              <button @click="closeTimelineModal" class="admin-modal-close">&times;</button>
            </div>
            <div class="admin-modal-body">
              <form @submit.prevent="saveTimeline" class="timeline-form">
                <div class="form-group">
                  <label>Período:</label>
                  <input type="text" v-model="timelineForm.date" required class="admin-input" placeholder="2024 - Presente">
                </div>
                <div class="form-group">
                  <label>Cargo:</label>
                  <input type="text" v-model="timelineForm.title" required class="admin-input">
                </div>
                <div class="form-group">
                  <label>Empresa:</label>
                  <input type="text" v-model="timelineForm.company" required class="admin-input">
                </div>
                <div class="form-group">
                  <label>Descrição:</label>
                  <textarea v-model="timelineForm.description" required class="admin-textarea" rows="4"></textarea>
                </div>
                <div class="form-group">
                  <label>Habilidades (separadas por vírgula):</label>
                  <input type="text" v-model="timelineSkills" class="admin-input" placeholder="Vue.js, React, Node.js">
                </div>
                <div class="admin-form-actions">
                  <button type="submit" :disabled="saving" class="admin-btn admin-btn-primary">
                    {{ saving ? 'Salvando...' : (editingTimeline ? 'Atualizar' : 'Criar') }}
                  </button>
                  <button type="button" @click="closeTimelineModal" class="admin-btn admin-btn-secondary">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Configurações Tab -->
      <div v-if="activeTab === 'config'" class="admin-section">
        <h2>Configurações Gerais</h2>
        
        <div class="config-form">
          <div class="form-group">
            <label>Nome:</label>
            <input type="text" v-model="siteConfig.name" class="admin-input">
          </div>
          
          <div class="form-group">
            <label>Título:</label>
            <input type="text" v-model="siteConfig.title" class="admin-input">
          </div>
          
          <div class="form-group">
            <label>Subtítulo:</label>
            <input type="text" v-model="siteConfig.subtitle" class="admin-input">
          </div>
          
          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="siteConfig.email" class="admin-input">
          </div>
          
          <div class="form-group">
            <label>Telefone:</label>
            <input type="text" v-model="siteConfig.phone" class="admin-input">
          </div>
          
          <div class="form-group">
            <label>Localização:</label>
            <input type="text" v-model="siteConfig.location" class="admin-input">
          </div>
          
          <div class="form-group">
            <label>LinkedIn:</label>
            <input type="url" v-model="siteConfig.linkedin" class="admin-input">
          </div>
          
          <div class="form-group">
            <label>GitHub:</label>
            <input type="url" v-model="siteConfig.github" class="admin-input">
          </div>
          
          <div class="form-group">
            <label>WhatsApp:</label>
            <input type="text" v-model="siteConfig.whatsapp" class="admin-input">
          </div>
          
          <div class="form-group">
            <label>Sobre Mim:</label>
            <textarea v-model="siteConfig.about" class="admin-textarea" rows="5"></textarea>
          </div>

          <div class="form-group">
            <label>Pensamento:</label>
            <textarea v-model="siteConfig.thought" class="admin-textarea" rows="3"></textarea>
          </div>
          
          <div class="form-group">
            <label>Foto de Perfil (Base64):</label>
            <div class="image-upload-container">
              <input type="file" @change="handleProfileImageUpload" accept="image/*" class="admin-input">
              <div v-if="siteConfig.profileImage" class="image-preview">
                <img :src="siteConfig.profileImage" alt="Preview" class="preview-image">
              </div>
            </div>
          </div>
        </div>
        
        <div class="admin-form-actions">
          <button @click="saveSiteConfig" :disabled="saving" class="admin-btn admin-btn-primary">
            {{ saving ? 'Salvando...' : 'Salvar Configurações' }}
          </button>
        </div>
      </div>

      <!-- Projetos Tab -->
      <div v-if="activeTab === 'projects'" class="admin-section">
        <div class="section-header">
          <h2>Gerenciar Projetos</h2>
          <button @click="openProjectModal" class="admin-btn admin-btn-primary">Novo Projeto</button>
        </div>

        <div class="projects-grid">
          <div v-for="project in projects" :key="project.id" class="admin-project-card">
            <div class="admin-project-image">
              <img :src="project.image || '/placeholder.svg?height=200&width=300'" :alt="project.title" />
              <div v-if="project.featured" class="project-badge">Destaque</div>
            </div>
            <div class="admin-project-content">
              <h3 class="admin-project-title">{{ truncateText(project.title, 50) }}</h3>
              <p class="admin-project-desc">{{ truncateText(project.description, 100) }}</p>
              <div class="admin-project-tech">
                <span v-for="(tech, index) in project.technologies.slice(0, 3)" :key="index" class="tech-tag">
                  {{ tech }}
                </span>
                <span v-if="project.technologies.length > 3" class="tech-more">
                  +{{ project.technologies.length - 3 }}
                </span>
              </div>
              <div class="admin-project-actions">
                <button @click="viewProjectDetails(project)" class="admin-action-btn admin-action-view">
                  Ver detalhes
                </button>
                <button @click="editProject(project)" class="admin-action-btn admin-action-edit">
                  Editar
                </button>
                <button @click="deleteProject(project.id)" class="admin-action-btn admin-action-delete">
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Project Details Modal -->
        <div v-if="showProjectDetailsModal" class="admin-modal-overlay" @click="closeProjectDetailsModal">
          <div class="admin-project-modal-content" @click.stop>
            <div class="admin-modal-header">
              <h3>{{ selectedProject.title }}</h3>
              <button @click="closeProjectDetailsModal" class="admin-modal-close">&times;</button>
            </div>
            <div class="admin-modal-body">
              <div class="admin-project-modal-image">
                <img :src="selectedProject.image || '/placeholder.svg?height=400&width=600'" :alt="selectedProject.title" />
                <div v-if="selectedProject.featured" class="project-badge">Projeto em Destaque</div>
              </div>
              <div class="admin-modal-section">
                <h4>Descrição</h4>
                <p>{{ selectedProject.description }}</p>
              </div>
              <div class="admin-modal-section">
                <h4>Tecnologias Utilizadas</h4>
                <div class="tech-tags">
                  <span v-for="tech in selectedProject.technologies" :key="tech" class="tech-tag">{{ tech }}</span>
                </div>
              </div>
              <div class="admin-modal-section">
                <h4>Links</h4>
                <div class="project-links">
                  <a v-if="selectedProject.liveUrl" :href="selectedProject.liveUrl" target="_blank" class="admin-btn admin-btn-primary">
                    Ver Projeto ↗
                  </a>
                  <a v-if="selectedProject.githubUrl" :href="selectedProject.githubUrl" target="_blank" class="admin-btn admin-btn-secondary">
                    Ver Código ↗
                  </a>
                </div>
              </div>
            </div>
            <div class="admin-modal-footer">
              <button @click="editProjectFromModal" class="admin-btn admin-btn-primary">Editar Projeto</button>
              <button @click="deleteProjectFromModal" class="admin-btn admin-btn-danger">Excluir Projeto</button>
            </div>
          </div>
        </div>

        <!-- Project Form Modal -->
        <div v-if="showProjectModal" class="admin-modal-overlay" @click="closeProjectModal">
          <div class="admin-modal-content" @click.stop>
            <div class="admin-modal-header">
              <h3>{{ editingProject ? 'Editar Projeto' : 'Novo Projeto' }}</h3>
              <button @click="closeProjectModal" class="admin-modal-close">&times;</button>
            </div>
            <div class="admin-modal-body">
              <form @submit.prevent="saveProject" class="project-form">
                <div class="form-group">
                  <label>Título:</label>
                  <input type="text" v-model="projectForm.title" required class="admin-input">
                </div>
                
                <div class="form-group">
                  <label>Descrição:</label>
                  <textarea v-model="projectForm.description" required class="admin-textarea" rows="4"></textarea>
                </div>
                
                <div class="form-group">
                  <label>Imagem (Base64):</label>
                  <div class="image-upload-container">
                    <input type="file" @change="handleProjectImageUpload" accept="image/*" class="admin-input">
                    <div v-if="projectForm.image" class="image-preview">
                      <img :src="projectForm.image" alt="Preview" class="preview-image">
                    </div>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Tecnologias (separadas por vírgula):</label>
                  <input type="text" v-model="projectTechnologies" class="admin-input" placeholder="React, Node.js, MongoDB">
                </div>
                
                <div class="form-group">
                  <label>URL do Projeto:</label>
                  <input type="url" v-model="projectForm.liveUrl" class="admin-input">
                </div>
                
                <div class="form-group">
                  <label>URL do GitHub:</label>
                  <input type="url" v-model="projectForm.githubUrl" class="admin-input">
                </div>
                
                <div class="form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="projectForm.featured">
                    Projeto em Destaque
                  </label>
                </div>
                
                <div class="admin-form-actions">
                  <button type="submit" :disabled="saving" class="admin-btn admin-btn-primary">
                    {{ saving ? 'Salvando...' : (editingProject ? 'Atualizar' : 'Criar') }}
                  </button>
                  <button type="button" @click="closeProjectModal" class="admin-btn admin-btn-secondary">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Tecnologias Tab -->
      <div v-if="activeTab === 'technologies'" class="admin-section">
        <div class="section-header">
          <h2>Gerenciar Tecnologias</h2>
          <button @click="openTechnologyModal" class="admin-btn admin-btn-primary">Nova Tecnologia</button>
        </div>

        <div class="technologies-grid">
          <div v-for="tech in technologies" :key="tech.id" class="technology-card">
            <div class="technology-icon">
              <img :src="tech.icon || '/placeholder.svg?height=64&width=64'" :alt="tech.name" />
            </div>
            <div class="technology-content">
              <h3>{{ tech.name }}</h3>
              <p>{{ tech.category }}</p>
              <div class="technology-actions">
                <button @click="editTechnology(tech)" class="admin-btn admin-btn-sm admin-btn-secondary">Editar</button>
                <button @click="deleteTechnology(tech.id)" class="admin-btn admin-btn-sm admin-btn-danger">Excluir</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Technology Form Modal -->
        <div v-if="showTechnologyModal" class="admin-modal-overlay" @click="closeTechnologyModal">
          <div class="admin-modal-content" @click.stop>
            <div class="admin-modal-header">
              <h3>{{ editingTechnology ? 'Editar Tecnologia' : 'Nova Tecnologia' }}</h3>
              <button @click="closeTechnologyModal" class="admin-modal-close">&times;</button>
            </div>
            <div class="admin-modal-body">
              <form @submit.prevent="saveTechnology" class="technology-form">
                <div class="form-group">
                  <label>Nome:</label>
                  <input type="text" v-model="technologyForm.name" required class="admin-input">
                </div>
                
                <div class="form-group">
                  <label>Categoria:</label>
                  <select v-model="technologyForm.category" required class="admin-select">
                    <option value="">Selecione uma categoria</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="Tools">Tools</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label>Ícone (Base64):</label>
                  <div class="image-upload-container">
                    <input type="file" @change="handleTechnologyIconUpload" accept="image/*" class="admin-input">
                    <div v-if="technologyForm.icon" class="image-preview">
                      <img :src="technologyForm.icon" alt="Preview" class="preview-image">
                    </div>
                  </div>
                </div>
                
                <div class="admin-form-actions">
                  <button type="submit" :disabled="saving" class="admin-btn admin-btn-primary">
                    {{ saving ? 'Salvando...' : (editingTechnology ? 'Atualizar' : 'Criar') }}
                  </button>
                  <button type="button" @click="closeTechnologyModal" class="admin-btn admin-btn-secondary">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Habilidades Tab -->
      <div v-if="activeTab === 'skills'" class="admin-section">
        <div class="section-header">
          <h2>Gerenciar Habilidades</h2>
          <button @click="openSkillModal" class="admin-btn admin-btn-primary">Nova Habilidade</button>
        </div>

        <div class="skills-grid">
          <div v-for="skill in skills" :key="skill.id" class="skill-card">
            <div class="skill-content">
              <h3>{{ skill.name }}</h3>
              <div class="skill-level">
                <div class="skill-bar">
                  <div class="skill-progress" :style="{ width: skill.percentage + '%' }"></div>
                </div>
                <span class="skill-percentage">{{ skill.percentage }}%</span>
              </div>
              <div class="skill-actions">
                <button @click="editSkill(skill)" class="admin-btn admin-btn-sm admin-btn-secondary">Editar</button>
                <button @click="deleteSkill(skill.id)" class="admin-btn admin-btn-sm admin-btn-danger">Excluir</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Skill Form Modal -->
        <div v-if="showSkillModal" class="admin-modal-overlay" @click="closeSkillModal">
          <div class="admin-modal-content" @click.stop>
            <div class="admin-modal-header">
              <h3>{{ editingSkill ? 'Editar Habilidade' : 'Nova Habilidade' }}</h3>
              <button @click="closeSkillModal" class="admin-modal-close">&times;</button>
            </div>
            <div class="admin-modal-body">
              <form @submit.prevent="saveSkill" class="skill-form">
                <div class="form-group">
                  <label>Nome:</label>
                  <input type="text" v-model="skillForm.name" required class="admin-input">
                </div>
                
                <div class="form-group">
                  <label>Nível (%):</label>
                  <input type="number" v-model="skillForm.percentage" min="0" max="100" required class="admin-input">
                </div>
                
                <div class="admin-form-actions">
                  <button type="submit" :disabled="saving" class="admin-btn admin-btn-primary">
                    {{ saving ? 'Salvando...' : (editingSkill ? 'Atualizar' : 'Criar') }}
                  </button>
                  <button type="button" @click="closeSkillModal" class="admin-btn admin-btn-secondary">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensagens Tab -->
      <div v-if="activeTab === 'messages'" class="admin-section">
        <h2>Mensagens de Contato</h2>
        
        <div v-if="messages.length === 0" class="no-messages">
          <p>Nenhuma mensagem encontrada.</p>
        </div>
        
        <div v-else class="messages-list">
          <div v-for="message in messages" :key="message.id" class="message-card">
            <div class="message-header">
              <h3>{{ message.name }}</h3>
              <span class="message-date">{{ formatDate(message.createdAt) }}</span>
            </div>
            <div class="message-content">
              <p><strong>Email:</strong> {{ message.email }}</p>
              <p><strong>Mensagem:</strong></p>
              <p>{{ message.message }}</p>
            </div>
            <div class="message-actions">
              <button @click="deleteMessage(message.id)" class="admin-btn admin-btn-sm admin-btn-danger">
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase.js'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, orderBy, query } from 'firebase/firestore'

export default {
  name: 'Admin',
  setup() {
    const router = useRouter()
    const { user } = inject('auth') || { user: ref(null) }
    
    // Connection status
    const connectionStatus = ref(null)
    
    // Reactive data
    const activeTab = ref('theme')
    const saving = ref(false)
    
    const tabs = [
      { id: 'theme', name: 'Tema' },
      { id: 'config', name: 'Configurações' },
      { id: 'hero', name: 'Hero' },
      { id: 'stats', name: 'Estatísticas' },
      { id: 'timeline', name: 'Timeline' },
      { id: 'projects', name: 'Projetos' },
      { id: 'technologies', name: 'Tecnologias' },
      { id: 'skills', name: 'Habilidades' },
      { id: 'messages', name: 'Mensagens' }
    ]
    
    // Theme Colors
    const themeColors = ref({
      dark: {
        primary: '#0f172a',
        secondary: '#1e293b',
        accent: '#3b82f6',
        card: '#334155',
        border: '#475569',
        textPrimary: '#ffffff',
        textSecondary: '#cbd5e1',
        textMuted: '#64748b',
        accentHover: '#2563eb'
      },
      light: {
        primary: '#ffffff',
        secondary: '#f8fafc',
        accent: '#3b82f6',
        card: '#f1f5f9',
        border: '#e2e8f0',
        textPrimary: '#0f172a',
        textSecondary: '#334155',
        textMuted: '#64748b',
        accentHover: '#2563eb'
      }
    })

    const themeConfig = ref({
      dark: {
        heroBackground: {
          circleColor: '#3b82f6',
          circleOpacity: 30,
          circleSize: 120,
          circleX: 50,
          circleY: 50,
          innerGlowColor: '#60a5fa',
          innerGlowOpacity: 20,
          outerGlowColor: '#1d4ed8',
          outerGlowOpacity: 10
        }
      },
      light: {
        heroBackground: {
          circleColor: '#e2e8f0',
          circleOpacity: 40,
          circleSize: 120,
          circleX: 50,
          circleY: 50,
          innerGlowColor: '#cbd5e1',
          innerGlowOpacity: 30,
          outerGlowColor: '#94a3b8',
          outerGlowOpacity: 15
        }
      }
    })
    
    // Site Configuration
    const siteConfig = ref({
      name: '',
      title: '',
      subtitle: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      whatsapp: '',
      about: '',
      thought: '',
      profileImage: ''
    })
    
    // Projects
    const projects = ref([])
    const showProjectModal = ref(false)
    const showProjectDetailsModal = ref(false)
    const editingProject = ref(false)
    const selectedProject = ref({})
    const projectForm = ref({
      title: '',
      description: '',
      image: '',
      technologies: [],
      liveUrl: '',
      githubUrl: '',
      featured: false
    })
    const projectTechnologies = ref('')
    
    // Technologies
    const technologies = ref([])
    const showTechnologyModal = ref(false)
    const editingTechnology = ref(false)
    const technologyForm = ref({
      name: '',
      category: '',
      icon: ''
    })
    const selectedTechnology = ref({})
    
    // Skills
    const skills = ref([])
    const showSkillModal = ref(false)
    const editingSkill = ref(false)
    const skillForm = ref({
      name: '',
      percentage: 0
    })
    const selectedSkill = ref({})
    
    // Messages
    const messages = ref([])

    // Hero Configuration
    const heroConfig = ref({
      messages: ['Olá, eu sou Bruno Bueno.', 'Seja Bem-vindo ao meu portifólio.'],
      typingSpeed: 85,
      deletingSpeed: 40,
      pauseEnd: 2500,
      pauseStart: 400
    })

    // Stats Configuration
    const statsConfig = ref([
      { icon: '🚀', number: 25, suffix: '+', label: 'Projetos Concluídos' },
      { icon: '⭐', number: 98, suffix: '%', label: 'Satisfação do Cliente' },
      { icon: '☕', number: 1247, suffix: '', label: 'Xícaras de Café' },
      { icon: '🏆', number: 15, suffix: '+', label: 'Prêmios Recebidos' }
    ])

    // Timeline Configuration
    const timelineItems = ref([
      {
        date: '2024 - Presente',
        title: 'Desenvolvedor Full Stack Freelancer',
        company: 'Autônomo',
        description: 'Desenvolvimento de aplicações web modernas usando Vue.js, React, Node.js e Firebase.',
        skills: ['Vue.js', 'React', 'Node.js', 'Firebase', 'TypeScript']
      }
    ])

    // Modals for editing
    const showStatsModal = ref(false)
    const showTimelineModal = ref(false)
    const editingStats = ref(false)
    const editingTimeline = ref(false)
    const selectedStatsIndex = ref(-1)
    const selectedTimelineIndex = ref(-1)
    const statsForm = ref({
      icon: '',
      number: 0,
      suffix: '',
      label: ''
    })
    const timelineForm = ref({
      date: '',
      title: '',
      company: '',
      description: '',
      skills: []
    })
    const timelineSkills = ref('')

    // Utility functions
    const showConnectionStatus = (message, type = 'info') => {
      connectionStatus.value = { message, type }
      setTimeout(() => {
        connectionStatus.value = null
      }, 5000)
    }

    // Check authentication
    const checkAuth = () => {
      if (!user.value) {
        console.log('❌ Usuário não autenticado, redirecionando...')
        showConnectionStatus('Usuário não autenticado. Redirecionando...', 'error')
        router.push('/login')
        return false
      }
      console.log('✅ Usuário autenticado:', user.value.email)
      return true
    }

    // Test connection
    const testConnection = async () => {
      if (!checkAuth()) return
      
      try {
        showConnectionStatus('Testando conexão...', 'info')
        const testDoc = doc(db, 'test', 'connection')
        await setDoc(testDoc, { timestamp: new Date(), user: user.value.email })
        showConnectionStatus('✅ Conexão com Firebase funcionando!', 'success')
      } catch (error) {
        console.error('❌ Erro na conexão:', error)
        showConnectionStatus('❌ Erro na conexão: ' + error.message, 'error')
      }
    }

    // Theme Methods
    const saveThemeColors = async () => {
      if (!checkAuth()) return
      
      saving.value = true
      try {
        console.log('💾 Salvando cores do tema...')
        await setDoc(doc(db, 'theme', 'colors'), themeColors.value)
        console.log('✅ Cores do tema salvas com sucesso!')
        showConnectionStatus('✅ Cores do tema salvas com sucesso!', 'success')
      } catch (error) {
        console.error('❌ Erro ao salvar cores do tema:', error)
        showConnectionStatus('❌ Erro ao salvar cores: ' + error.message, 'error')
      }
      saving.value = false
    }

    const saveThemeConfig = async () => {
      if (!checkAuth()) return
      
      saving.value = true
      try {
        console.log('💾 Salvando configurações do tema...')
        await setDoc(doc(db, 'theme', 'config'), themeConfig.value)
        console.log('✅ Configurações do tema salvas com sucesso!')
        showConnectionStatus('✅ Hero background salvo com sucesso!', 'success')
      } catch (error) {
        console.error('❌ Erro ao salvar configurações do tema:', error)
        showConnectionStatus('❌ Erro ao salvar configurações: ' + error.message, 'error')
      }
      saving.value = false
    }
    
    const loadThemeColors = async () => {
      try {
        console.log('📥 Carregando cores do tema...')
        const docRef = doc(db, 'theme', 'colors')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          themeColors.value = docSnap.data()
          console.log('✅ Cores do tema carregadas')
        }
      } catch (error) {
        console.error('❌ Erro ao carregar cores do tema:', error)
      }
    }

    const loadThemeConfig = async () => {
      try {
        console.log('📥 Carregando configurações do tema...')
        const docRef = doc(db, 'theme', 'config')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          themeConfig.value = docSnap.data()
          console.log('✅ Configurações do tema carregadas')
        }
      } catch (error) {
        console.error('❌ Erro ao carregar configurações do tema:', error)
      }
    }
    
    const applyTheme = () => {
      if (!themeColors.value || !themeConfig.value) {
        console.warn('⚠️ Dados do tema não carregados completamente')
        return
      }
      
      const isDark = document.documentElement.classList.contains('dark-theme')
      const theme = isDark ? themeColors.value.dark : themeColors.value.light
      const heroConfig = isDark ? 
        (themeConfig.value.dark && themeConfig.value.dark.heroBackground) : 
        (themeConfig.value.light && themeConfig.value.light.heroBackground)
      
      if (!theme) {
        console.warn('⚠️ Cores do tema não disponíveis')
        return
      }
      
      const root = document.documentElement
      
      // Apply color variables
      root.style.setProperty('--primary-bg', theme.primary)
      root.style.setProperty('--secondary-bg', theme.secondary)
      root.style.setProperty('--accent-color', theme.accent)
      root.style.setProperty('--card-bg', theme.card)
      root.style.setProperty('--border-color', theme.border)
      root.style.setProperty('--text-primary', theme.textPrimary)
      root.style.setProperty('--text-secondary', theme.textSecondary)
      root.style.setProperty('--text-muted', theme.textMuted)
      root.style.setProperty('--accent-hover', theme.accentHover)
      
      // Apply hero background configuration
      if (heroConfig) {
        const hexToRgb = (hex) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : null
        }
        
        const circleRgb = hexToRgb(heroConfig.circleColor)
        const innerGlowRgb = hexToRgb(heroConfig.innerGlowColor)
        const outerGlowRgb = hexToRgb(heroConfig.outerGlowColor)
        
        if (circleRgb && innerGlowRgb && outerGlowRgb) {
          root.style.setProperty('--hero-circle-rgb', `${circleRgb.r}, ${circleRgb.g}, ${circleRgb.b}`)
          root.style.setProperty('--hero-inner-glow-rgb', `${innerGlowRgb.r}, ${innerGlowRgb.g}, ${innerGlowRgb.b}`)
          root.style.setProperty('--hero-outer-glow-rgb', `${outerGlowRgb.r}, ${outerGlowRgb.g}, ${outerGlowRgb.b}`)
        }
        
        root.style.setProperty('--hero-circle-opacity', (heroConfig.circleOpacity / 100).toString())
        root.style.setProperty('--hero-circle-size', heroConfig.circleSize + '%')
        root.style.setProperty('--hero-circle-x', heroConfig.circleX + '%')
        root.style.setProperty('--hero-circle-y', heroConfig.circleY + '%')
        root.style.setProperty('--hero-inner-glow-opacity', (heroConfig.innerGlowOpacity / 100).toString())
        root.style.setProperty('--hero-outer-glow-opacity', (heroConfig.outerGlowOpacity / 100).toString())
        
        updatePreviewBackground()
      }
    }

    const updatePreviewBackground = () => {
      const previewElement = document.querySelector('.hero-preview-background')
      if (previewElement && themeConfig.value) {
        const isDark = document.documentElement.classList.contains('dark-theme')
        const heroConfig = isDark ? 
          (themeConfig.value.dark && themeConfig.value.dark.heroBackground) : 
          (themeConfig.value.light && themeConfig.value.light.heroBackground)
        
        if (heroConfig) {
          const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '59, 130, 246'
          }
          
          const circleRgb = hexToRgb(heroConfig.circleColor)
          const innerGlowRgb = hexToRgb(heroConfig.innerGlowColor)
          const outerGlowRgb = hexToRgb(heroConfig.outerGlowColor)
          
          previewElement.style.background = `
            radial-gradient(
              circle ${heroConfig.circleSize}% at ${heroConfig.circleX}% ${heroConfig.circleY}%, 
              transparent ${heroConfig.circleSize * 0.35}%, 
              rgba(${circleRgb}, ${heroConfig.circleOpacity / 100}) ${heroConfig.circleSize * 0.36}%, 
              rgba(${circleRgb}, ${heroConfig.circleOpacity / 100}) ${heroConfig.circleSize * 0.37}%, 
              transparent ${heroConfig.circleSize * 0.38}%
            ),
            radial-gradient(
              circle ${heroConfig.circleSize}% at ${heroConfig.circleX}% ${heroConfig.circleY}%, 
              rgba(${innerGlowRgb}, ${heroConfig.innerGlowOpacity / 100}) 0%, 
              rgba(${innerGlowRgb}, ${heroConfig.innerGlowOpacity / 200}) 30%,
              transparent 50%
            ),
            radial-gradient(
              circle ${heroConfig.circleSize}% at ${heroConfig.circleX}% ${heroConfig.circleY}%, 
              transparent 40%, 
              rgba(${outerGlowRgb}, ${heroConfig.outerGlowOpacity / 100}) 45%, 
              rgba(${outerGlowRgb}, ${heroConfig.outerGlowOpacity / 200}) 60%,
              transparent 80%
            )
          `
        }
      }
    }
    
    // Site Configuration Methods
    const saveSiteConfig = async () => {
      if (!checkAuth()) return
      
      saving.value = true
      try {
        console.log('💾 Salvando configurações do site...')
        await setDoc(doc(db, 'settings', 'site'), siteConfig.value)
        console.log('✅ Configurações do site salvas!')
        showConnectionStatus('✅ Configurações salvas com sucesso!', 'success')
      } catch (error) {
        console.error('❌ Erro ao salvar configurações:', error)
        showConnectionStatus('❌ Erro ao salvar configurações: ' + error.message, 'error')
      }
      saving.value = false
    }
    
    const loadSiteConfig = async () => {
      try {
        console.log('📥 Carregando configurações do site...')
        const docRef = doc(db, 'settings', 'site')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          siteConfig.value = docSnap.data()
          console.log('✅ Configurações do site carregadas')
        }
      } catch (error) {
        console.error('❌ Erro ao carregar configurações:', error)
      }
    }

    // Hero Methods
    const saveHeroConfig = async () => {
      if (!checkAuth()) return
      
      saving.value = true
      try {
        console.log('💾 Salvando configurações do Hero...')
        await setDoc(doc(db, 'settings', 'hero'), heroConfig.value)
        console.log('✅ Configurações do Hero salvas!')
        showConnectionStatus('✅ Configurações do Hero salvas com sucesso!', 'success')
      } catch (error) {
        console.error('❌ Erro ao salvar configurações do Hero:', error)
        showConnectionStatus('❌ Erro ao salvar Hero: ' + error.message, 'error')
      }
      saving.value = false
    }

    const loadHeroConfig = async () => {
      try {
        console.log('📥 Carregando configurações do Hero...')
        const docRef = doc(db, 'settings', 'hero')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          heroConfig.value = { ...heroConfig.value, ...docSnap.data() }
          console.log('✅ Configurações do Hero carregadas')
        }
      } catch (error) {
        console.error('❌ Erro ao carregar configurações do Hero:', error)
      }
    }

    const addHeroMessage = () => {
      heroConfig.value.messages.push('')
    }

    const removeHeroMessage = (index) => {
      heroConfig.value.messages.splice(index, 1)
    }

    // Stats Methods
    const saveStatsConfig = async () => {
      if (!checkAuth()) return
      
      saving.value = true
      try {
        console.log('💾 Salvando estatísticas...')
        await setDoc(doc(db, 'settings', 'stats'), { stats: statsConfig.value })
        console.log('✅ Estatísticas salvas!')
        showConnectionStatus('✅ Estatísticas salvas com sucesso!', 'success')
        
        // Dispatch event for real-time updates
        window.dispatchEvent(new CustomEvent('statsUpdated', { detail: statsConfig.value }))
      } catch (error) {
        console.error('❌ Erro ao salvar estatísticas:', error)
        showConnectionStatus('❌ Erro ao salvar estatísticas: ' + error.message, 'error')
      }
      saving.value = false
    }

    const loadStatsConfig = async () => {
      try {
        console.log('📥 Carregando estatísticas...')
        const docRef = doc(db, 'settings', 'stats')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          statsConfig.value = docSnap.data().stats || statsConfig.value
          console.log('✅ Estatísticas carregadas')
        }
      } catch (error) {
        console.error('❌ Erro ao carregar estatísticas:', error)
      }
    }

    const openStatsModal = () => {
      showStatsModal.value = true
      editingStats.value = false
      resetStatsForm()
    }

    const closeStatsModal = () => {
      showStatsModal.value = false
      resetStatsForm()
    }

    const resetStatsForm = () => {
      statsForm.value = {
        icon: '',
        number: 0,
        suffix: '',
        label: ''
      }
    }

    const editStats = (index) => {
      editingStats.value = true
      selectedStatsIndex.value = index
      statsForm.value = { ...statsConfig.value[index] }
      showStatsModal.value = true
    }

    const saveStats = async () => {
      saving.value = true
      try {
        if (editingStats.value) {
          statsConfig.value[selectedStatsIndex.value] = { ...statsForm.value }
        } else {
          statsConfig.value.push({ ...statsForm.value })
        }
        await saveStatsConfig()
        closeStatsModal()
      } catch (error) {
        console.error('❌ Erro ao salvar estatística:', error)
        showConnectionStatus('❌ Erro ao salvar estatística: ' + error.message, 'error')
      }
      saving.value = false
    }

    const deleteStats = (index) => {
      if (confirm('Tem certeza que deseja excluir esta estatística?')) {
        statsConfig.value.splice(index, 1)
        saveStatsConfig()
      }
    }

    // Timeline Methods
    const saveTimelineConfig = async () => {
      if (!checkAuth()) return
      
      saving.value = true
      try {
        console.log('💾 Salvando timeline...')
        await setDoc(doc(db, 'settings', 'timeline'), { timeline: timelineItems.value })
        console.log('✅ Timeline salva!')
        showConnectionStatus('✅ Timeline salva com sucesso!', 'success')
        
        // Dispatch event for real-time updates
        window.dispatchEvent(new CustomEvent('timelineUpdated', { detail: timelineItems.value }))
      } catch (error) {
        console.error('❌ Erro ao salvar timeline:', error)
        showConnectionStatus('❌ Erro ao salvar timeline: ' + error.message, 'error')
      }
      saving.value = false
    }

    const loadTimelineConfig = async () => {
      try {
        console.log('📥 Carregando timeline...')
        const docRef = doc(db, 'settings', 'timeline')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          timelineItems.value = docSnap.data().timeline || timelineItems.value
          console.log('✅ Timeline carregada')
        }
      } catch (error) {
        console.error('❌ Erro ao carregar timeline:', error)
      }
    }

    const openTimelineModal = () => {
      showTimelineModal.value = true
      editingTimeline.value = false
      resetTimelineForm()
    }

    const closeTimelineModal = () => {
      showTimelineModal.value = false
      resetTimelineForm()
    }

    const resetTimelineForm = () => {
      timelineForm.value = {
        date: '',
        title: '',
        company: '',
        description: '',
        skills: []
      }
      timelineSkills.value = ''
    }

    const editTimeline = (index) => {
      editingTimeline.value = true
      selectedTimelineIndex.value = index
      timelineForm.value = { ...timelineItems.value[index] }
      timelineSkills.value = timelineForm.value.skills.join(', ')
      showTimelineModal.value = true
    }

    const saveTimeline = async () => {
      saving.value = true
      try {
        const timelineData = {
          ...timelineForm.value,
          skills: timelineSkills.value.split(',').map(skill => skill.trim()).filter(skill => skill)
        }
        
        if (editingTimeline.value) {
          timelineItems.value[selectedTimelineIndex.value] = timelineData
        } else {
          timelineItems.value.push(timelineData)
        }
        
        await saveTimelineConfig()
        closeTimelineModal()
      } catch (error) {
        console.error('❌ Erro ao salvar experiência:', error)
        showConnectionStatus('❌ Erro ao salvar experiência: ' + error.message, 'error')
      }
      saving.value = false
    }

    const deleteTimeline = (index) => {
      if (confirm('Tem certeza que deseja excluir esta experiência?')) {
        timelineItems.value.splice(index, 1)
        saveTimelineConfig()
      }
    }
    
    // Image Upload Methods
    const handleProfileImageUpload = async (event) => {
      const file = event.target.files[0]
      if (file) {
        const compressedBase64 = await compressImage(file)
        siteConfig.value.profileImage = compressedBase64
      }
    }
    
    const handleProjectImageUpload = async (event) => {
      const file = event.target.files[0]
      if (file) {
        const compressedBase64 = await compressImage(file)
        projectForm.value.image = compressedBase64
      }
    }
    
    const handleTechnologyIconUpload = async (event) => {
      const file = event.target.files[0]
      if (file) {
        const compressedBase64 = await compressImage(file)
        technologyForm.value.icon = compressedBase64
      }
    }
    
    const compressImage = async (file, maxSizeKB = 500) => {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        img.onload = () => {
          // Calculate new dimensions
          let { width, height } = img
          const maxDimension = 800
          
          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width
            width = maxDimension
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height
            height = maxDimension
          }
          
          canvas.width = width
          canvas.height = height
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height)
          
          let quality = 0.9
          let base64 = canvas.toDataURL('image/jpeg', quality)
          
          // Reduce quality until size is acceptable
          while (base64.length > maxSizeKB * 1024 * 1.37 && quality > 0.1) {
            quality -= 0.1
            base64 = canvas.toDataURL('image/jpeg', quality)
          }
          
          resolve(base64)
        }
        
        img.src = URL.createObjectURL(file)
      })
    }
    
    // Project Methods
    const loadProjects = async () => {
      try {
        console.log('📥 Carregando projetos...')
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        projects.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        console.log(`✅ ${projects.value.length} projetos carregados`)
      } catch (error) {
        console.error('❌ Erro ao carregar projetos:', error)
      }
    }
    
    const openProjectModal = () => {
      showProjectModal.value = true
      editingProject.value = false
      resetProjectForm()
    }
    
    const closeProjectModal = () => {
      showProjectModal.value = false
      resetProjectForm()
    }
    
    const resetProjectForm = () => {
      projectForm.value = {
        title: '',
        description: '',
        image: '',
        technologies: [],
        liveUrl: '',
        githubUrl: '',
        featured: false
      }
      projectTechnologies.value = ''
    }
    
    const editProject = (project) => {
      editingProject.value = true
      selectedProject.value = project
      projectForm.value = { ...project }
      projectTechnologies.value = project.technologies.join(', ')
      showProjectModal.value = true
    }
    
    const saveProject = async () => {
      if (!checkAuth()) return
      
      saving.value = true
      try {
        const projectData = {
          ...projectForm.value,
          technologies: projectTechnologies.value.split(',').map(tech => tech.trim()).filter(tech => tech),
          createdAt: new Date()
        }
        
        if (editingProject.value) {
          await updateDoc(doc(db, 'projects', selectedProject.value.id), projectData)
          showConnectionStatus('✅ Projeto atualizado com sucesso!', 'success')
        } else {
          await addDoc(collection(db, 'projects'), projectData)
          showConnectionStatus('✅ Projeto criado com sucesso!', 'success')
        }
        
        await loadProjects()
        closeProjectModal()
      } catch (error) {
        console.error('❌ Erro ao salvar projeto:', error)
        showConnectionStatus('❌ Erro ao salvar projeto: ' + error.message, 'error')
      }
      saving.value = false
    }
    
    const deleteProject = async (projectId) => {
      if (!checkAuth()) return
      
      if (confirm('Tem certeza que deseja excluir este projeto?')) {
        try {
          await deleteDoc(doc(db, 'projects', projectId))
          await loadProjects()
          showConnectionStatus('✅ Projeto excluído com sucesso!', 'success')
        } catch (error) {
          console.error('❌ Erro ao excluir projeto:', error)
          showConnectionStatus('❌ Erro ao excluir projeto: ' + error.message, 'error')
        }
      }
    }

    const viewProjectDetails = (project) => {
      selectedProject.value = project
      showProjectDetailsModal.value = true
    }

    const closeProjectDetailsModal = () => {
      showProjectDetailsModal.value = false
      selectedProject.value = {}
    }

    const editProjectFromModal = () => {
      closeProjectDetailsModal()
      editProject(selectedProject.value)
    }

    const deleteProjectFromModal = async () => {
      closeProjectDetailsModal()
      await deleteProject(selectedProject.value.id)
    }
    
    // Technology Methods
    const loadTechnologies = async () => {
      try {
        console.log('📥 Carregando tecnologias...')
        const querySnapshot = await getDocs(collection(db, 'technologies'))
        technologies.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        console.log(`✅ ${technologies.value.length} tecnologias carregadas`)
      } catch (error) {
        console.error('❌ Erro ao carregar tecnologias:', error)
      }
    }
    
    const openTechnologyModal = () => {
      showTechnologyModal.value = true
      editingTechnology.value = false
      resetTechnologyForm()
    }
    
    const closeTechnologyModal = () => {
      showTechnologyModal.value = false
      resetTechnologyForm()
    }
    
    const resetTechnologyForm = () => {
      technologyForm.value = {
        name: '',
        category: '',
        icon: ''
      }
    }
    
    const editTechnology = (technology) => {
      editingTechnology.value = true
      selectedTechnology.value = technology
      technologyForm.value = { ...technology }
      showTechnologyModal.value = true
    }
    
    const saveTechnology = async () => {
      if (!checkAuth()) return
      
      saving.value = true
      try {
        if (editingTechnology.value) {
          await updateDoc(doc(db, 'technologies', selectedTechnology.value.id), technologyForm.value)
          showConnectionStatus('✅ Tecnologia atualizada com sucesso!', 'success')
        } else {
          await addDoc(collection(db, 'technologies'), technologyForm.value)
          showConnectionStatus('✅ Tecnologia criada com sucesso!', 'success')
        }
        
        await loadTechnologies()
        closeTechnologyModal()
      } catch (error) {
        console.error('❌ Erro ao salvar tecnologia:', error)
        showConnectionStatus('❌ Erro ao salvar tecnologia: ' + error.message, 'error')
      }
      saving.value = false
    }
    
    const deleteTechnology = async (technologyId) => {
      if (!checkAuth()) return
      
      if (confirm('Tem certeza que deseja excluir esta tecnologia?')) {
        try {
          await deleteDoc(doc(db, 'technologies', technologyId))
          await loadTechnologies()
          showConnectionStatus('✅ Tecnologia excluída com sucesso!', 'success')
        } catch (error) {
          console.error('❌ Erro ao excluir tecnologia:', error)
          showConnectionStatus('❌ Erro ao excluir tecnologia: ' + error.message, 'error')
        }
      }
    }
    
    // Skill Methods
    const loadSkills = async () => {
      try {
        console.log('📥 Carregando habilidades...')
        const querySnapshot = await getDocs(collection(db, 'skills'))
        skills.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        console.log(`✅ ${skills.value.length} habilidades carregadas`)
      } catch (error) {
        console.error('❌ Erro ao carregar habilidades:', error)
      }
    }
    
    const openSkillModal = () => {
      showSkillModal.value = true
      editingSkill.value = false
      resetSkillForm()
    }
    
    const closeSkillModal = () => {
      showSkillModal.value = false
      resetSkillForm()
    }
    
    const resetSkillForm = () => {
      skillForm.value = {
        name: '',
        percentage: 0
      }
    }
    
    const editSkill = (skill) => {
      editingSkill.value = true
      selectedSkill.value = skill
      skillForm.value = { ...skill }
      showSkillModal.value = true
    }
    
    const saveSkill = async () => {
      if (!checkAuth()) return
      
      saving.value = true
      try {
        if (editingSkill.value) {
          await updateDoc(doc(db, 'skills', selectedSkill.value.id), skillForm.value)
          showConnectionStatus('✅ Habilidade atualizada com sucesso!', 'success')
        } else {
          await addDoc(collection(db, 'skills'), skillForm.value)
          showConnectionStatus('✅ Habilidade criada com sucesso!', 'success')
        }
        
        await loadSkills()
        closeSkillModal()
      } catch (error) {
        console.error('❌ Erro ao salvar habilidade:', error)
        showConnectionStatus('❌ Erro ao salvar habilidade: ' + error.message, 'error')
      }
      saving.value = false
    }
    
    const deleteSkill = async (skillId) => {
      if (!checkAuth()) return
      
      if (confirm('Tem certeza que deseja excluir esta habilidade?')) {
        try {
          await deleteDoc(doc(db, 'skills', skillId))
          await loadSkills()
          showConnectionStatus('✅ Habilidade excluída com sucesso!', 'success')
        } catch (error) {
          console.error('❌ Erro ao excluir habilidade:', error)
          showConnectionStatus('❌ Erro ao excluir habilidade: ' + error.message, 'error')
        }
      }
    }
    
    // Message Methods
    const loadMessages = async () => {
      if (!checkAuth()) return
      
      try {
        console.log('📥 Carregando mensagens...')
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        messages.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        console.log(`✅ ${messages.value.length} mensagens carregadas`)
      } catch (error) {
        console.error('❌ Erro ao carregar mensagens:', error)
        showConnectionStatus('❌ Erro ao carregar mensagens: ' + error.message, 'error')
      }
    }
    
    const deleteMessage = async (messageId) => {
      if (!checkAuth()) return
      
      if (confirm('Tem certeza que deseja excluir esta mensagem?')) {
        try {
          await deleteDoc(doc(db, 'messages', messageId))
          await loadMessages()
          showConnectionStatus('✅ Mensagem excluída com sucesso!', 'success')
        } catch (error) {
          console.error('❌ Erro ao excluir mensagem:', error)
          showConnectionStatus('❌ Erro ao excluir mensagem: ' + error.message, 'error')
        }
      }
    }
    
    const formatDate = (timestamp) => {
      if (!timestamp) return ''
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR')
    }

    const truncateText = (text, maxLength) => {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.slice(0, maxLength) + '...'
    }
    
    const logout = async () => {
      try {
        await signOut(auth)
        showConnectionStatus('✅ Logout realizado com sucesso!', 'success')
        router.push('/login')
      } catch (error) {
        console.error('❌ Erro no logout:', error)
        showConnectionStatus('❌ Erro no logout: ' + error.message, 'error')
      }
    }

    // Initialize data on mount
    onMounted(async () => {
      console.log('🚀 Admin montado, verificando autenticação...')
      
      if (!checkAuth()) return
      
      showConnectionStatus('🔄 Carregando dados...', 'info')
      
      try {
        await Promise.all([
          loadThemeColors(),
          loadThemeConfig(),
          loadSiteConfig(),
          loadHeroConfig(),
          loadStatsConfig(),
          loadTimelineConfig(),
          loadProjects(),
          loadTechnologies(),
          loadSkills(),
          loadMessages()
        ])
        
        applyTheme()
        
        setTimeout(() => {
          updatePreviewBackground()
        }, 100)
        
        showConnectionStatus('✅ Todos os dados carregados com sucesso!', 'success')
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error)
        showConnectionStatus('❌ Erro ao carregar alguns dados: ' + error.message, 'error')
      }
    })

    return {
      // Reactive data
      user,
      connectionStatus,
      activeTab,
      saving,
      tabs,
      themeColors,
      themeConfig,
      siteConfig,
      projects,
      technologies,
      skills,
      messages,
      heroConfig,
      statsConfig,
      timelineItems,
      
      // Modals
      showProjectModal,
      showProjectDetailsModal,
      showTechnologyModal,
      showSkillModal,
      showStatsModal,
      showTimelineModal,
      
      // Forms
      projectForm,
      projectTechnologies,
      technologyForm,
      skillForm,
      statsForm,
      timelineForm,
      timelineSkills,
      
      // Editing states
      editingProject,
      editingTechnology,
      editingSkill,
      editingStats,
      editingTimeline,
      selectedProject,
      
      // Methods
      testConnection,
      saveThemeColors,
      saveThemeConfig,
      applyTheme,
      updatePreviewBackground,
      saveSiteConfig,
      saveHeroConfig,
      addHeroMessage,
      removeHeroMessage,
      saveStatsConfig,
      openStatsModal,
      closeStatsModal,
      editStats,
      saveStats,
      deleteStats,
      saveTimelineConfig,
      openTimelineModal,
      closeTimelineModal,
      editTimeline,
      saveTimeline,
      deleteTimeline,
      handleProfileImageUpload,
      handleProjectImageUpload,
      handleTechnologyIconUpload,
      openProjectModal,
      closeProjectModal,
      editProject,
      saveProject,
      deleteProject,
      viewProjectDetails,
      closeProjectDetailsModal,
      editProjectFromModal,
      deleteProjectFromModal,
      openTechnologyModal,
      closeTechnologyModal,
      editTechnology,
      saveTechnology,
      deleteTechnology,
      openSkillModal,
      closeSkillModal,
      editSkill,
      saveSkill,
      deleteSkill,
      deleteMessage,
      formatDate,
      truncateText,
      logout
    }
  }
}
</script>

<style scoped>
/* Connection Status */
.connection-status {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideInRight 0.3s ease;
}

.connection-status.success {
  background: #10b981;
  color: white;
}

.connection-status.error {
  background: #ef4444;
  color: white;
}

.connection-status.info {
  background: #3b82f6;
  color: white;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.admin-container {
  min-height: 100vh;
  background: var(--primary-bg);
  color: var(--text-primary);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.admin-header h1 {
  margin: 0;
  color: var(--text-primary);
}

.admin-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-user-info span {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.admin-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  background: var(--secondary-bg);
  overflow-x: auto;
}

.admin-tab {
  padding: 1rem 2rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.admin-tab:hover {
  background: var(--card-bg);
  color: var(--text-primary);
}

.admin-tab.active {
  color: var(--accent-color);
  border-bottom-color: var(--accent-color);
  background: var(--card-bg);
}

.admin-content {
  padding: 2rem;
}

.admin-section h2 {
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.no-messages {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

/* Theme Section Styles */
.theme-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.theme-section h3 {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  border-bottom: 2px solid var(--accent-color);
  padding-bottom: 0.5rem;
}

.theme-modes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.theme-mode h4 {
  margin-bottom: 1rem;
  color: var(--accent-color);
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.color-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.color-input-group label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.color-input-group input[type="color"] {
  width: 100%;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
}

/* Hero configuration styles */
.hero-config-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.config-group {
  padding: 1rem;
  background: var(--secondary-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.config-group h5 {
  margin-bottom: 1rem;
  color: var(--accent-color);
  font-size: 1rem;
}

.slider-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.slider-input-group label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.slider-input-group input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--border-color);
  outline: none;
  cursor: pointer;
}

.slider-input-group input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent-color);
  cursor: pointer;
}

.hero-preview {
  margin-top: 2rem;
  padding: 1rem;
  background: var(--secondary-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.hero-preview h5 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.hero-preview-container {
  position: relative;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--primary-bg);
}

.hero-preview-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.hero-preview-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}

.hero-preview-content h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.hero-preview-content p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Form Styles */
.config-form, .project-form, .technology-form, .skill-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--text-secondary);
}

.admin-input, .admin-textarea, .admin-select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--card-bg);
  color: var(--text-primary);
  font-size: 1rem;
}

.admin-input:focus, .admin-textarea:focus, .admin-select:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.admin-textarea {
  resize: vertical;
  min-height: 100px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

/* Button Styles */
.admin-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.admin-btn-primary {
  background: var(--accent-color);
  color: white;
}

.admin-btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.admin-btn-secondary {
  background: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.admin-btn-secondary:hover {
  background: var(--border-color);
}

.admin-btn-danger {
  background: #ef4444;
  color: white;
}

.admin-btn-danger:hover {
  background: #dc2626;
}

.admin-btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.admin-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.admin-form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

/* Grid Layouts */
.projects-grid, .technologies-grid, .skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

/* Project Card Styles */
.admin-project-card {
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: all 0.3s ease;
}

.admin-project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.admin-project-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.admin-project-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: var(--secondary-bg);
}

.project-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--accent-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.admin-project-content {
  padding: 1.5rem;
}

.admin-project-title {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.admin-project-desc {
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.admin-project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tech-tag {
  background: var(--accent-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.tech-more {
  background: var(--border-color);
  color: var(--text-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
}

.admin-project-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.admin-action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.admin-action-view {
  background: var(--accent-color);
  color: white;
}

.admin-action-view:hover {
  background: var(--accent-hover);
}

.admin-action-edit {
  background: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.admin-action-edit:hover {
  background: var(--border-color);
}

.admin-action-delete {
  background: #ef4444;
  color: white;
}

.admin-action-delete:hover {
  background: #dc2626;
}

/* Technology Card Styles */
.technology-card {
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.technology-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.technology-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  border-radius: 12px;
  overflow: hidden;
  background: var(--secondary-bg);
}

.technology-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.technology-content h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.technology-content p {
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
}

.technology-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

/* Skill Card Styles */
.skill-card {
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.skill-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.skill-content h3 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.skill-level {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.skill-bar {
  flex: 1;
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: var(--accent-color);
  transition: width 0.3s ease;
}

.skill-percentage {
  font-weight: 500;
  color: var(--accent-color);
  min-width: 40px;
}

.skill-actions {
  display: flex;
  gap: 0.5rem;
}

/* Message Card Styles */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-card {
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  padding: 1.5rem;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.message-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.message-date {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.message-content {
  margin-bottom: 1rem;
}

.message-content p {
  margin: 0 0 0.5rem 0;
  color: var(--text-secondary);
}

.message-actions {
  display: flex;
  justify-content: flex-end;
}

/* Modal Styles */
.admin-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.admin-modal-content, .admin-project-modal-content {
  background: var(--card-bg);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.admin-project-modal-content {
  max-width: 800px;
}

.admin-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.admin-modal-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.admin-modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.admin-modal-close:hover {
  background: var(--border-color);
  color: var(--text-primary);
}

.admin-modal-body {
  padding: 1.5rem;
}

.admin-modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.admin-project-modal-image {
  position: relative;
  height: 300px;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  background: var(--secondary-bg);
}

.admin-project-modal-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.admin-modal-section {
  margin-bottom: 1.5rem;
}

.admin-modal-section h4 {
  margin: 0 0 0.75rem 0;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.admin-modal-section p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-links {
  display: flex;
  gap: 1rem;
}

/* Image Upload Styles */
.image-upload-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-preview {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Hero Config Styles */
.hero-config-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.hero-config-section h3 {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  border-bottom: 2px solid var(--accent-color);
  padding-bottom: 0.5rem;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.message-item {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

/* Stats Admin Styles */
.stats-admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.stats-admin-card {
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stats-admin-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.stats-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-color);
  border-radius: 50%;
  color: white;
}

.stats-content {
  flex: 1;
}

.stats-content h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.stats-content p {
  margin: 0 0 1rem 0;
  color: var(--text-secondary);
}

.stats-actions {
  display: flex;
  gap: 0.5rem;
}

/* Timeline Admin Styles */
.timeline-admin-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.timeline-admin-card {
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.timeline-admin-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.timeline-admin-date {
  color: var(--accent-color);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.timeline-admin-content h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 1.25rem;
}

.timeline-admin-company {
  color: var(--text-secondary);
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.timeline-admin-desc {
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

.timeline-admin-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.skill-tag {
  background: var(--accent-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
}

.skill-more {
  background: var(--border-color);
  color: var(--text-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
}

.timeline-admin-actions {
  display: flex;
  gap: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .admin-user-info {
    justify-content: center;
  }
  
  .admin-tabs {
    justify-content: flex-start;
  }
  
  .admin-content {
    padding: 1rem;
  }
  
  .theme-modes {
    grid-template-columns: 1fr;
  }
  
  .config-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-admin-grid {
    grid-template-columns: 1fr;
  }
  
  .message-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .projects-grid, .technologies-grid, .skills-grid {
    grid-template-columns: 1fr;
  }
  
  .admin-form-actions {
    flex-direction: column;
  }
  
  .connection-status {
    top: 10px;
    right: 10px;
    left: 10px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .admin-header h1 {
    font-size: 1.5rem;
  }
  
  .admin-tab {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
  
  .theme-section {
    padding: 1rem;
  }
  
  .admin-modal-overlay {
    padding: 0.5rem;
  }
  
  .admin-modal-content, .admin-project-modal-content {
    max-height: 95vh;
  }
  
  .admin-modal-header, .admin-modal-body, .admin-modal-footer {
    padding: 1rem;
  }
}
</style>
