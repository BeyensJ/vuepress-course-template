<template>
  <div class="flashcard-container" @click="isFlipped = !isFlipped">
    <div class="flashcard-inner" :class="{ 'is-flipped': isFlipped }">
      <!-- Front side -->
      <div class="flashcard-side flashcard-front">
        <div v-if="category" class="flashcard-category">{{ category }}</div>
        <div class="flashcard-term">
          <slot name="front">{{ term }}</slot>
        </div>
        <div class="flashcard-hint-text">Click to flip</div>
      </div>
      
      <!-- Back side -->
      <div class="flashcard-side flashcard-back">
        <div class="flashcard-content">
          <slot name="back"></slot>
          <slot v-if="!$slots.back"></slot>
        </div>
        <div class="flashcard-hint-text">Click to flip back</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  term: { type: String, default: '' },
  category: { type: String, default: '' }
})

const isFlipped = ref(false)
</script>

<style scoped>
.flashcard-container {
  perspective: 1000px;
  margin: 1.5rem 0;
  cursor: pointer;
  width: 100%;
  max-width: 500px;
  min-height: 180px;
}

.flashcard-inner {
  position: relative;
  width: 100%;
  min-height: 180px;
  text-align: center;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.flashcard-inner.is-flipped {
  transform: rotateY(180deg);
}

.flashcard-side {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 180px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid var(--border-color, var(--vp-c-border, #e2e8f0));
}

.flashcard-front {
  background: linear-gradient(135deg, var(--bg-color-soft, var(--vp-c-bg-soft, #ffffff)), var(--bg-color-secondary, var(--vp-c-bg-elv, #f1f5f9)));
  color: var(--text-color, var(--vp-c-text, #1e293b));
}

.flashcard-back {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  color: #f8fafc;
  transform: rotateY(180deg);
}

.flashcard-category {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--theme-color, var(--vp-c-accent, #3b82f6));
  margin-bottom: 0.5rem;
}

.flashcard-term {
  font-size: 1.3rem;
  font-weight: 700;
}

.flashcard-content {
  font-size: 1rem;
  line-height: 1.5;
}

.flashcard-hint-text {
  position: absolute;
  bottom: 0.6rem;
  font-size: 0.75rem;
  opacity: 0.6;
}
</style>
