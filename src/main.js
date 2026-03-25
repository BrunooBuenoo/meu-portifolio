import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles.css'

// ===== Font Awesome =====
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Ícones que você quer usar
import { faUser, faHome, faCoffee, faEnvelope, faPhone, faLocationDot, faSun, faMoon, faCertificate, faBriefcase, faFilePdf } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons'

// Adiciona os ícones à biblioteca
library.add(
     faUser,
     faHome, 
     faCoffee, 
     faGithub, 
     faInstagram, 
     faLinkedin,
     faEnvelope,
     faPhone,
     faLocationDot,
     faSun,
     faMoon,
     faCertificate,
     faBriefcase,
     faFilePdf
    )

// Cria o app
const app = createApp(App)

// Registra o componente globalmente
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)
app.mount('#app')
