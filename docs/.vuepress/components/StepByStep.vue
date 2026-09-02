<template>
  <div class="stepper-card">
    <div v-if="title" class="stepper-title">
      {{ title }}
    </div>

    <!-- Step Progress Header -->
    <div class="stepper-header">
      <div 
        v-for="(stepName, index) in steps" 
        :key="index"
        :class="['step-item', { active: currentStep === index + 1, completed: currentStep > index + 1 }]"
        @click="goToStep(index + 1)"
      >
        <div class="step-circle">
          <span v-if="currentStep > index + 1">✓</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="step-label">{{ stepName }}</div>
        <div v-if="index < steps.length - 1" class="step-connector"></div>
      </div>
    </div>

    <!-- Active Step Content Area -->
    <div class="stepper-content">
      <div class="step-badge-indicator">
        Step {{ currentStep }} of {{ steps.length }}: <strong>{{ steps[currentStep - 1] }}</strong>
      </div>
      <div class="step-body">
        <slot :name="`step-${currentStep}`"></slot>
      </div>
    </div>

    <!-- Stepper Footer Controls -->
    <div class="stepper-footer">
      <button 
        class="step-btn btn-prev" 
        :disabled="currentStep === 1"
        @click="prevStep"
      >
        ← Previous
      </button>

      <button 
        v-if="currentStep < steps.length"
        class="step-btn btn-next" 
        @click="nextStep"
      >
        Next →
      </button>
      <button 
        v-else 
        class="step-btn btn-complete"
        @click="resetStepper"
      >
        Complete & Restart
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  steps: { type: Array, required: true },
  title: { type: String, default: '' }
})

const currentStep = ref(1)

const goToStep = (stepNumber) => {
  if (stepNumber >= 1 && stepNumber <= props.steps.length) {
    currentStep.value = stepNumber
  }
}

const nextStep = () => {
  if (currentStep.value < props.steps.length) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const resetStepper = () => {
  currentStep.value = 1
}
</script>

<style scoped>
.stepper-card {
  border: 1px solid var(--border-color, var(--vp-c-border, #e2e8f0));
  border-radius: 10px;
  background: var(--bg-color-soft, var(--vp-c-bg-soft, #f8fafc));
  padding: 1.25rem;
  margin: 1.5rem 0;
  color: var(--text-color, var(--vp-c-text, #2c3e50));
}

.stepper-title {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color, var(--vp-c-text));
}

.stepper-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  position: relative;
  flex: 1;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-color-secondary, var(--vp-c-bg-elv, #cbd5e1));
  color: var(--text-color-subtle, var(--vp-c-text-subtle, #64748b));
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.step-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-color-subtle, var(--vp-c-text-subtle, #64748b));
  white-space: nowrap;
}

.step-connector {
  flex: 1;
  height: 2px;
  background: var(--border-color, var(--vp-c-border, #cbd5e1));
  margin: 0 0.5rem;
}

.step-item.active .step-circle {
  background: var(--theme-color, var(--vp-c-accent, #3b82f6));
  color: #ffffff;
  box-shadow: 0 0 0 4px rgba(62, 175, 124, 0.2);
}

.step-item.active .step-label {
  color: var(--theme-color, var(--vp-c-accent, #3b82f6));
  font-weight: 700;
}

.step-item.completed .step-circle {
  background: #22c55e;
  color: #ffffff;
}

.step-item.completed .step-label {
  color: var(--text-color, var(--vp-c-text, #166534));
}

.stepper-content {
  background: var(--bg-color, var(--vp-c-bg, #ffffff));
  border: 1px solid var(--border-color, var(--vp-c-border, #e2e8f0));
  border-radius: 8px;
  padding: 1.2rem;
  margin-bottom: 1.25rem;
}

.step-badge-indicator {
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--theme-color, var(--vp-c-accent, #3b82f6));
  margin-bottom: 0.75rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px dashed var(--border-color, var(--vp-c-border, #e2e8f0));
}

.step-body {
  line-height: 1.6;
}

.stepper-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-btn {
  border: none;
  padding: 0.5rem 1.1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-prev {
  background: var(--bg-color-secondary, var(--vp-c-bg-elv, #e2e8f0));
  color: var(--text-color, var(--vp-c-text, #334155));
}

.btn-prev:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-next {
  background: var(--theme-color, var(--vp-c-accent, #3b82f6));
  color: #ffffff;
}

.btn-next:hover {
  background: var(--theme-color-light, var(--vp-c-accent-hover, #2563eb));
}

.btn-complete {
  background: #22c55e;
  color: #ffffff;
}

.btn-complete:hover {
  background: #16a34a;
}
</style>
