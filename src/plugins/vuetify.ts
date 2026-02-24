// src/plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VApp, VCard, VCardTitle, VCardText, VBtn, VContainer, VRow, VCol } from 'vuetify/components'

export default createVuetify({
  components: {
    ...components,
    VApp,
    VCard,
    VCardTitle,
    VCardText,
    VBtn,
    VContainer,
    VRow,
    VCol,
  },
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#455245',    
          secondary: '#d6d6c6',  
          surface: '#f5f5f0',
          accent: '#a35657',     
          error: '#c96061',      
          info: '#5c6b5c',       
          success: '#586958',    
          warning: '#bfb585',
          body1: '#2b332b',
        },
      },
    },
  },
})