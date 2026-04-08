<!--
INFO: https://blog.codepen.io/documentation/prefill-embeds/
https://vuejs.org/v2/api/#vm-scopedSlots
VB:
TODO: htmlencode op HTML-code toevoegen

Disable HTML entities: https://intellij-support.jetbrains.com/hc/en-us/community/posts/203374264-How-to-disable-visual-conversion-of-HTML-entities-
USE: <Pen :height="400" scss bootstrap jquery title="The new title">
Escape HTML: https://plugins.jetbrains.com/plugin/2162-string-manipulation
            String manipulation->escape/unescape->escape html
Open console gedeeltelijk: ?editors=1111
Open console volledig: ?editors=1112
-->
<template>
  <div class="codepen"
       data-editable="true"
       :data-height="height"
       data-theme-id="dark"
       :data-default-tab="show"
       :data-prefill=JSON.stringify(prefill)
  >
    <pre data-lang="html">
        <slot name="html"></slot>
    </pre>
    <pre :data-lang="styleType" data-options-autoprefixer="true">
        <slot name="style"></slot>
    </pre>
    <pre data-lang="js">
        <slot name="script"></slot>
    </pre>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$nextTick(() => {
      // Load CodePen embed script if not already present
      if (typeof window !== 'undefined' && !document.getElementById('codepen-embed-script')) {
        const script = document.createElement('script')
        script.id = 'codepen-embed-script'
        script.src = 'https://static.codepen.io/assets/embed/ei.js'
        script.async = true
        document.body.appendChild(script)
      } else {
        // If script is already loaded, trigger a refresh for the new content
        if (typeof window !== 'undefined' && typeof window.__CPEmbed === 'function') {
          window.__CPEmbed()
        }
      }
    })
  },
  props: {
    title: {
      type: String,
      default: 'Full Stack TMK'
    },
    height: {
      type: [Number, String],
      default: 400
    },
    show: {
      type: [String],
      default: 'html,result'
    },
    bootstrap: {
      type: Boolean,
      default: false
    },
    bootstrapgrid: {
      type: Boolean,
      default: false
    },
    fa6: {
      type: Boolean,
      default: false
    },
    jquery: {
      type: Boolean,
      default: false
    },
    minicss: {
      type: Boolean,
      default: false
    },
    scss: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {}
  },
  computed: {
    styleType: function () {
      return this.scss ? 'scss' : 'css'
    },
    prefill: function () {
      let scripts = [];
      let stylesheets = [];
      if (this.jquery) {
        scripts.push('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js')
      }
      if (this.bootstrap) {
        stylesheets.push('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.3/css/bootstrap.min.css');
        stylesheets.push('https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css');
        scripts.push('https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.min.js');
      }
      if (this.bootstrapgrid) {
        stylesheets.push('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.3/css/bootstrap-reboot.min.css');
        stylesheets.push('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.3/css/bootstrap-grid.min.css');
      }
      if (this.fa6) {
        stylesheets.push('https: //cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css');
      }
      if (this.minicss) {
        stylesheets.push('https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css');
      }
      return {
        title: this.title,
        description: '',
        head: "<meta name=&#x27;viewport&#x27; content=&#x27;width=device-width, initial-scale=1&#x27;>",
        scripts: scripts,
        stylesheets: stylesheets,
      };
    },
  },
  methods: {}
}
</script>

<style scoped>

</style>
