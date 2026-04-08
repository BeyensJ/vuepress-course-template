import { defineClientConfig } from 'vuepress/client'
import Pen from './components/Pen.vue'
import Caniuse from './components/Caniuse.vue'
import Sandbox from './components/Sandbox.vue'
import Stackblitz from './components/Stackblitz.vue'
import Video from './components/Video.vue'

import { nextTick } from 'vue'

export default defineClientConfig({
    enhance({ app, router, siteData }) {
        app.component('Pen', Pen)
        app.component('Caniuse', Caniuse)
        app.component('Sandbox', Sandbox)
        app.component('Stackblitz', Stackblitz)
        app.component('Video', Video)

        // Refresh CodePen embeds over page navigation
        router.afterEach(() => {
          nextTick(() => {
            if (typeof window !== 'undefined' && typeof window.__CPEmbed === 'function') {
              window.__CPEmbed()
            }
          })
        })
    },
    setup() {
      // Load CodePen embed script once on the client side
      if (typeof window !== 'undefined' && !document.getElementById('codepen-embed-script')) {
        const script = document.createElement('script')
        script.id = 'codepen-embed-script'
        script.src = 'https://static.codepen.io/assets/embed/ei.js'
        script.async = true
        document.body.appendChild(script)
      }
    }
})