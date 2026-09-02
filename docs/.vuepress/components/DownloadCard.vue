<template>
  <div class="download-card">
    <div v-if="icon" class="card-icon">
      <span>{{ icon }}</span>
    </div>
    <div class="card-info">
      <div class="card-title">{{ title }}</div>
      <div v-if="description" class="card-description">{{ description }}</div>
      <div v-if="fileSize || filename" class="card-meta">
        <span v-if="filename" class="meta-filename">{{ filename }}</span>
        <span v-if="fileSize" class="meta-size">{{ fileSize }}</span>
      </div>
    </div>
    <a :href="url" :download="filename || true" class="download-btn" target="_blank" rel="noopener noreferrer">
      <span>Download</span>
    </a>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  url: { type: String, required: true },
  filename: { type: String, default: '' },
  fileSize: { type: String, default: '' },
  icon: { type: String, default: '' }
})
</script>

<style scoped>
.download-card {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: var(--bg-color-soft, var(--vp-c-bg-soft, #f8fafc));
  border: 1px solid var(--border-color, var(--vp-c-border, #e2e8f0));
  border-radius: 10px;
  padding: 1.1rem 1.25rem;
  margin: 1.25rem 0;
  transition: all 0.25s ease;
  color: var(--text-color, var(--vp-c-text, #1e293b));
}

.download-card:hover {
  border-color: var(--theme-color, var(--vp-c-accent, #3b82f6));
  box-shadow: 0 4px 12px rgba(62, 175, 124, 0.15);
  transform: translateY(-2px);
}

.card-icon {
  font-size: 1.5rem;
  line-height: 1;
  background: var(--bg-color-secondary, var(--vp-c-bg-elv, #eff6ff));
  padding: 0.75rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-info {
  flex: 1;
}

.card-title {
  font-weight: 700;
  font-size: 1.05rem;
  margin-bottom: 0.25rem;
}

.card-description {
  font-size: 0.9rem;
  color: var(--text-color-subtle, var(--vp-c-text-subtle, #64748b));
  margin-bottom: 0.4rem;
  line-height: 1.4;
}

.card-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--text-color-subtle, var(--vp-c-text-subtle, #94a3b8));
}

.download-btn {
  background: var(--theme-color, var(--vp-c-accent, #3b82f6));
  color: #ffffff !important;
  text-decoration: none !important;
  padding: 0.55rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  white-space: nowrap;
  transition: background 0.2s ease;
}

.download-btn:hover {
  background: var(--theme-color-light, var(--vp-c-accent-hover, #2563eb));
}
</style>
