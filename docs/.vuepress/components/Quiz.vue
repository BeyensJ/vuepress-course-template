<template>
  <div class="quiz-container">
    <div class="quiz-header">
      <span class="quiz-question">{{ question }}</span>
    </div>
    
    <div class="quiz-options">
      <button 
        v-for="(option, index) in options" 
        :key="index"
        :class="['quiz-option-btn', getOptionClass(index)]"
        :disabled="selectedIndex !== null"
        @click="selectOption(index)"
      >
        <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
        <span class="option-text">{{ option }}</span>
      </button>
    </div>

    <transition name="fade">
      <div v-if="selectedIndex !== null" :class="['quiz-feedback', isCorrect ? 'correct' : 'incorrect']">
        <div class="feedback-title">
          {{ isCorrect ? 'Correct!' : 'Incorrect' }}
        </div>
        <div v-if="explanation" class="explanation-text">
          {{ explanation }}
        </div>
        <button class="reset-btn" @click="resetQuiz">Try Again</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  question: { type: String, required: true },
  options: { type: Array, required: true },
  correctIndex: { type: Number, required: true },
  explanation: { type: String, default: '' }
})

const selectedIndex = ref(null)
const isCorrect = computed(() => selectedIndex.value === props.correctIndex)

const selectOption = (index) => {
  selectedIndex.value = index
}

const resetQuiz = () => {
  selectedIndex.value = null
}

const getOptionClass = (index) => {
  if (selectedIndex.value === null) return ''
  if (index === props.correctIndex) return 'correct-option'
  if (index === selectedIndex.value) return 'wrong-option'
  return 'dimmed-option'
}
</script>

<style scoped>
.quiz-container {
  background: var(--bg-color-soft, var(--vp-c-bg-soft, #f8fafc));
  border: 1px solid var(--border-color, var(--vp-c-border, #e2e8f0));
  border-radius: 8px;
  padding: 1.25rem;
  margin: 1.5rem 0;
  color: var(--text-color, var(--vp-c-text, #2c3e50));
}

.quiz-header {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-weight: 600;
  font-size: 1.05rem;
  margin-bottom: 1rem;
}

.quiz-question {
  flex: 1;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quiz-option-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
  padding: 0.65rem 1rem;
  background: var(--bg-color, var(--vp-c-bg, #ffffff));
  border: 1px solid var(--border-color, var(--vp-c-border, #cbd5e1));
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--text-color, var(--vp-c-text, #2c3e50));
  transition: all 0.2s ease;
}

.quiz-option-btn:hover:not(:disabled) {
  border-color: var(--theme-color, var(--vp-c-accent, #3b82f6));
  background: var(--bg-color-secondary, var(--vp-c-bg-elv, #eff6ff));
  transform: translateX(2px);
}

.option-label {
  font-weight: 700;
  color: var(--theme-color, var(--vp-c-accent, #3b82f6));
  min-width: 1.2rem;
}

.correct-option {
  background: #dcfce7 !important;
  border-color: #22c55e !important;
  color: #166534 !important;
  font-weight: 600;
}

.wrong-option {
  background: #fee2e2 !important;
  border-color: #ef4444 !important;
  color: #991b1b !important;
}

.dimmed-option {
  opacity: 0.5;
}

.quiz-feedback {
  margin-top: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
}

.quiz-feedback.correct {
  background: #f0fdf4;
  border: 1px solid #86efac;
  color: #166534;
}

.quiz-feedback.incorrect {
  background: #fef2f2;
  border: 1px solid #fca5a5;
  color: #991b1b;
}

.feedback-title {
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.explanation-text {
  margin-bottom: 0.6rem;
  line-height: 1.5;
}

.reset-btn {
  background: transparent;
  border: 1px solid currentColor;
  color: inherit;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  font-weight: 600;
}

.reset-btn:hover {
  opacity: 0.8;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
