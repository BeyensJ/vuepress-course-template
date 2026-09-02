<template>
  <span 
    class="keyterm-wrapper"
    @mouseenter="showPopover = true"
    @mouseleave="showPopover = false"
    @click="togglePopover"
  >
    <span class="keyterm-text">
      <slot>{{ term }}</slot>
    </span>
    
    <transition name="popover-fade">
      <div v-if="showPopover" class="keyterm-popover" @click.stop>
        <div class="popover-header">
          <span class="popover-title">{{ term }}</span>
        </div>
        <div class="popover-body">
          <slot name="definition">{{ definition }}</slot>
        </div>
        <div v-if="link" class="popover-footer">
          <a :href="link" target="_blank" rel="noopener noreferrer" class="popover-link">
            Learn more ↗
          </a>
        </div>
      </div>
    </transition>
  </span>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  term: { type: String, required: true },
  definition: { type: String, default: '' },
  link: { type: String, default: '' }
})

const showPopover = ref(false)

const togglePopover = () => {
  showPopover.value = !showPopover.value
}
</script>

<style scoped>
.keyterm-wrapper {
  position: relative;
  display: inline-block;
  cursor: help;
}

.keyterm-text {
  border-bottom: 2px dotted var(--theme-color, var(--vp-c-accent, #3b82f6));
  color: var(--text-color, inherit);
  font-weight: 600;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.keyterm-wrapper:hover .keyterm-text {
  color: var(--theme-color, var(--vp-c-accent, #3b82f6));
  border-bottom-style: solid;
}

.keyterm-popover {
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  width: 260px;
  background: var(--bg-color-secondary, var(--vp-c-bg-elv, #1e1e2e));
  color: var(--text-color, var(--vp-c-text, #cdd6f4));
  border: 1px solid var(--border-color, var(--vp-c-border, #45475a));
  border-radius: 8px;
  padding: 0.85rem 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  z-index: 100;
  font-size: 0.88rem;
  line-height: 1.45;
  text-align: left;
}

.keyterm-popover::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: var(--bg-color-secondary, var(--vp-c-bg-elv, #1e1e2e)) transparent transparent transparent;
}

.popover-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 700;
  color: var(--theme-color, var(--vp-c-accent, #3eaf7c));
  margin-bottom: 0.4rem;
  border-bottom: 1px solid var(--border-color, var(--vp-c-border, #313244));
  padding-bottom: 0.3rem;
}

.popover-title {
  font-size: 0.92rem;
}

.popover-body {
  color: var(--text-color-subtle, var(--vp-c-text-subtle, #bac2de));
}

.popover-footer {
  margin-top: 0.5rem;
  padding-top: 0.4rem;
  border-top: 1px dashed var(--border-color, var(--vp-c-border, #313244));
}

.popover-link {
  color: var(--theme-color, var(--vp-c-accent, #3b82f6)) !important;
  text-decoration: none !important;
  font-weight: 600;
  font-size: 0.8rem;
}

.popover-link:hover {
  text-decoration: underline !important;
}

.popover-fade-enter-active,
.popover-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.popover-fade-enter-from,
.popover-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 5px);
}
</style>
