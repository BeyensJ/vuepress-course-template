import { defineClientConfig } from 'vuepress/client'
import Pen from './components/Pen.vue'
import Caniuse from './components/Caniuse.vue'
import Sandbox from './components/Sandbox.vue'
import Stackblitz from './components/Stackblitz.vue'
import Video from './components/Video.vue'
import GeminiCourseChat from './components/GeminiCourseChat.vue'
import Quiz from './components/Quiz.vue'
import Flashcard from './components/Flashcard.vue'
import DownloadCard from './components/DownloadCard.vue'
import KeyTerm from './components/KeyTerm.vue'
import StepByStep from './components/StepByStep.vue'

import { nextTick } from 'vue'

export default defineClientConfig({
    enhance({ app, router, siteData }) {
        app.component('Pen', Pen)
        app.component('Caniuse', Caniuse)
        app.component('Sandbox', Sandbox)
        app.component('Stackblitz', Stackblitz)
        app.component('Video', Video)
        app.component('GeminiCourseChat', GeminiCourseChat)
        app.component('Quiz', Quiz)
        app.component('Flashcard', Flashcard)
        app.component('DownloadCard', DownloadCard)
        app.component('KeyTerm', KeyTerm)
        app.component('StepByStep', StepByStep)

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