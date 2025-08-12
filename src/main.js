import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ===== Font Awesome =====
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Ícones que você quer usar
import { faUser, faHome, faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope,
         faPhone,
         faLocationDot
 } from '@fortawesome/free-solid-svg-icons'

// Adiciona os ícones à biblioteca
library.add(
     faUser,
     faHome, 
     faCoffee, 
     faGithub, 
     faInstagram, 
     faEnvelope,
     faPhone,
     faLocationDot
    )

// Cria o app
const app = createApp(App)

// Registra o componente globalmente
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)
app.mount('#app')
