<template>
  <div class="gemini-course-chat">
    <div class="chat-container">
      
      <!-- Key Status Bar -->
      <div class="key-status-bar" :class="{ 'key-missing': !hasApiKey }">
        <div class="key-status-info">
          <span class="key-status-badge" :class="hasApiKey ? 'badge-active' : 'badge-warning'">
            {{ hasApiKey ? '🔑 Active Key' : '⚠️ Action Required' }}
          </span>
          <span class="key-text">
            <template v-if="hasApiKey">
              Gemini API: <code>{{ maskedKey }}</code>
            </template>
            <template v-else>
              A free Gemini API key is required to ask questions.
            </template>
          </span>
        </div>
        <button type="button" @click="toggleKeyModal" class="btn-key-toggle">
          {{ hasApiKey ? '⚙️ Change Key' : '🔑 Set Up Key' }}
        </button>
      </div>

      <!-- Floating Modal Dialog for API Key Setup -->
      <div v-if="showKeyModal" class="modal-backdrop" @click.self="showKeyModal = false">
        <div class="modal-dialog key-config-card">
          <button type="button" class="modal-close-btn" @click="showKeyModal = false" title="Close setup modal">✕</button>
          
          <div class="key-config-header">
            <div class="key-title-group">
              <h3>🔑 Get Your Free Gemini API Key</h3>
              <span class="badge-free">100% Free</span>
            </div>
          </div>

          <p class="key-config-intro">
            This AI chatbot uses Google Gemini. It takes only <strong>1 minute</strong> to create your personal free key with your Google account.
          </p>

          <div class="key-steps">
            <div class="step">
              <div class="step-header">
                <span class="step-num">1</span>
                <strong>Open AI Studio</strong>
              </div>
              <p>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">aistudio.google.com ↗</a> and sign in with Google.</p>
            </div>

            <div class="step">
              <div class="step-header">
                <span class="step-num">2</span>
                <strong>Create Key</strong>
              </div>
              <p>Click the <strong>"Create API key"</strong> button.</p>
            </div>

            <div class="step">
              <div class="step-header">
                <span class="step-num">3</span>
                <strong>Set up key</strong>
              </div>
              <p>Give your key <strong>a name</strong> and link it to a <strong>new or existing project</strong>.</p>
            </div>

            <div class="step">
              <div class="step-header">
                <span class="step-num">4</span>
                <strong>Generate Key</strong>
              </div>
              <p>Click <strong>"Create API key"</strong> to generate your key.</p>
            </div>

            <div class="step">
              <div class="step-header">
                <span class="step-num">5</span>
                <strong>Paste Below</strong>
              </div>
              <p>Copy your key and save it below.</p>
            </div>
          </div>

          <form @submit.prevent="saveApiKey" class="key-input-form">
            <div class="input-group">
              <input 
                :type="showKeyText ? 'text' : 'password'" 
                v-model="inputApiKey" 
                placeholder="Paste your API key here"
                autocomplete="off"
                class="key-input-field"
              />
              <button type="button" @click="showKeyText = !showKeyText" class="btn-show-hide" title="Toggle visibility">
                {{ showKeyText ? '🙈 Hide' : '👁️ Show' }}
              </button>
            </div>
            <div class="key-form-actions">
              <button type="submit" class="btn-save-key" :disabled="!inputApiKey.trim()">
                💾 Save API Key
              </button>
              <button v-if="userApiKey" type="button" @click="clearApiKey" class="btn-delete-key">
                🗑️ Clear Key
              </button>
              <button type="button" @click="showKeyModal = false" class="btn-cancel-modal">
                Cancel
              </button>
            </div>
          </form>

          <div v-if="keySuccessMessage" class="key-success">{{ keySuccessMessage }}</div>
          <div v-if="keyError" class="key-error">{{ keyError }}</div>

          <div class="key-privacy-notice">
            🔒 <strong>Privacy Note:</strong> Your API key is stored only in your local browser storage (LocalStorage) and connects directly to Google. It is never sent to our servers.
          </div>
        </div>
      </div>

      <!-- Model Selection Bar -->
      <div class="model-selection-bar">
        <div class="model-select-left">
          <label for="gemini-model-select" class="model-select-label">
            <span class="model-brain-icon">🧠</span>
            <strong>AI Model:</strong>
          </label>
          <div class="select-wrapper">
            <select 
              id="gemini-model-select" 
              v-model="selectedModel" 
              class="model-dropdown"
              :disabled="loading"
            >
              <option 
                v-for="m in availableModels" 
                :key="m.id" 
                :value="m.id" 
                :disabled="isModelDisabled(m.id)"
              >
                {{ m.name }} — {{ m.rpm }} | {{ m.rpd }} {{ isModelDisabled(m.id) ? `⛔ (Unavailable - ${remainingSeconds[m.id]}s left)` : '' }}
              </option>
            </select>
          </div>
        </div>

        <button type="button" @click="showQuotaModal = true" class="btn-view-quotas">
          📊 View Model Quotas & Status
        </button>
      </div>

      <div v-if="modelSwitchNotification" class="notification-banner">
        ⚡ {{ modelSwitchNotification }}
      </div>

      <!-- Floating Modal for Model Quotas & Availability -->
      <div v-if="showQuotaModal" class="modal-backdrop" @click.self="showQuotaModal = false">
        <div class="modal-dialog quota-modal-dialog">
          <button type="button" class="modal-close-btn" @click="showQuotaModal = false" title="Close modal">✕</button>
          
          <div class="quota-modal-header">
            <h3>📊 Gemini Models, Rate Limits & Quotas</h3>
            <p class="quota-modal-intro">Choose an AI model for your questions. If a model encounters a rate limit or unavailability, it will temporarily pause and auto-switch to keep your session active.</p>
          </div>

          <div class="quota-cards-grid">
            <div 
              v-for="m in availableModels" 
              :key="m.id" 
              class="quota-card"
              :class="{ 
                'card-selected': selectedModel === m.id, 
                'card-disabled': isModelDisabled(m.id) 
              }"
            >
              <div class="quota-card-top">
                <div class="quota-card-title-group">
                  <strong>{{ m.name }}</strong>
                  <span class="quota-status-tag" :class="isModelDisabled(m.id) ? 'tag-cooldown' : (selectedModel === m.id ? 'tag-selected' : 'tag-available')">
                    {{ isModelDisabled(m.id) ? `⛔ Cooldown (${remainingSeconds[m.id]}s)` : (selectedModel === m.id ? '✓ Selected' : m.badge) }}
                  </span>
                </div>
                <p class="quota-card-desc">{{ m.description }}</p>
              </div>

              <div class="quota-metrics-list">
                <div class="metric-item">
                  <span class="metric-label">Rate Limit:</span>
                  <span class="metric-val">{{ m.rpm }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Daily Limit:</span>
                  <span class="metric-val">{{ m.rpd }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Context Limit:</span>
                  <span class="metric-val">{{ m.tpm }}</span>
                </div>
              </div>

              <button 
                type="button" 
                @click="selectModelFromCard(m.id)" 
                :disabled="isModelDisabled(m.id) || selectedModel === m.id" 
                class="btn-card-select"
              >
                {{ isModelDisabled(m.id) ? `Disabled (${remainingSeconds[m.id]}s left)` : (selectedModel === m.id ? 'Currently Selected' : 'Use This Model') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Question Input Box -->
      <div class="input-area">
        <textarea 
          v-model="question" 
          placeholder="Ask any question about this course... (Press Ctrl+Enter to send)"
          @keydown.ctrl.enter="askQuestion()"
          @keydown.meta.enter="askQuestion()"
          :disabled="loading"
          class="chat-textarea"
        ></textarea>
        <div class="input-actions">
          <span class="input-hint">Ctrl + Enter to send</span>
          <button @click="askQuestion()" :disabled="loading || !String(question || '').trim()" class="btn-ask">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? botName + ' is thinking...' : 'Ask ' + botName }}
          </button>
        </div>
      </div>

      <div v-if="error" class="error-banner">{{ error }}</div>
      
      <!-- Current Answer -->
      <div v-if="answer" class="answer-card">
        <div class="answer-header">
          <span class="bot-avatar">🤖</span>
          <strong class="bot-title">{{ botName }} Response</strong>
        </div>
        <div class="answer-body vp-doc" v-html="formattedAnswer"></div>
      </div>

      <!-- History Section -->
      <div v-if="history.length > 0" class="history-section">
        <div class="history-header">
          <h3>Previous Questions</h3>
          <span class="history-count">{{ history.length }} {{ history.length === 1 ? 'question' : 'questions' }}</span>
        </div>
        <details v-for="item in history" :key="item.id" class="history-details" :open="item.id === recentId">
          <summary class="history-summary">
            <span class="history-question-text">💬 {{ item.question }}</span>
            <div class="history-actions">
              <span class="history-date">{{ formatDate(item.timestamp) }}</span>
              <button @click.prevent="deleteHistory(item.id)" class="btn-icon" title="Delete question">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </summary>
          <div class="history-answer vp-doc" v-html="renderMarkdown(item.answer)"></div>
        </details>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { marked } from 'marked';

const props = defineProps({
  botName: {
    type: String,
    default: 'CourseBot'
  },
  systemPrompt: {
    type: String,
    default: ''
  },
  model: {
    type: String,
    default: 'gemini-3.6-flash'
  }
});

const defaultApiKey = typeof __GEMINI_API_KEY__ !== 'undefined' ? __GEMINI_API_KEY__ : '';
const userApiKey = ref('');
const inputApiKey = ref('');
const showKeyModal = ref(false);
const showQuotaModal = ref(false);
const showKeyText = ref(false);
const keySuccessMessage = ref('');
const keyError = ref('');

const availableModels = ref([
  { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash', badge: 'Recommended', description: 'Latest generation, fast & accurate', rpm: '5 RPM', rpd: '20 RPD', tpm: '250K TPM' },
  { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash', badge: 'Latest', description: 'High performance flash model', rpm: '5 RPM', rpd: '20 RPD', tpm: '250K TPM' },
  { id: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash Lite', badge: 'High Quota', description: 'Fast response with 500 daily requests', rpm: '15 RPM', rpd: '500 RPD', tpm: '250K TPM' },
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', badge: 'High Quota', description: 'Lightweight model with 500 daily requests', rpm: '15 RPM', rpd: '500 RPD', tpm: '250K TPM' },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', badge: 'Standard', description: 'General purpose text model', rpm: '5 RPM', rpd: '20 RPD', tpm: '250K TPM' },
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash', badge: 'General', description: 'Standard flash text model', rpm: '5 RPM', rpd: '20 RPD', tpm: '250K TPM' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', badge: 'Standard', description: 'Stable text model', rpm: '5 RPM', rpd: '20 RPD', tpm: '250K TPM' },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', badge: 'Lightweight', description: 'Fast 10 RPM text model', rpm: '10 RPM', rpd: '20 RPD', tpm: '250K TPM' }
]);

const selectedModel = ref('gemini-3.6-flash');
const modelCooldowns = ref({});
const remainingSeconds = ref({});
const modelSwitchNotification = ref('');

const question = ref('');
const answer = ref('');
const loading = ref(false);
const error = ref('');
const history = ref([]);
const recentId = ref(null);

let cooldownTimer = null;

const updateCooldowns = () => {
  const now = Date.now();
  const newRemaining = {};
  let changed = false;

  for (const [mId, unavailUntil] of Object.entries(modelCooldowns.value)) {
    if (unavailUntil > now) {
      newRemaining[mId] = Math.ceil((unavailUntil - now) / 1000);
    } else {
      delete modelCooldowns.value[mId];
      changed = true;
    }
  }
  remainingSeconds.value = newRemaining;

  if (changed && typeof window !== 'undefined') {
    localStorage.setItem('gemini_model_cooldowns', JSON.stringify(modelCooldowns.value));
  }
};

const isModelDisabled = (modelId) => {
  const unavailUntil = modelCooldowns.value[modelId];
  return Boolean(unavailUntil && unavailUntil > Date.now());
};

const markModelUnavailable = (modelId, cooldownSecs = 60) => {
  const unavailUntil = Date.now() + (cooldownSecs * 1000);
  modelCooldowns.value[modelId] = unavailUntil;
  if (typeof window !== 'undefined') {
    localStorage.setItem('gemini_model_cooldowns', JSON.stringify(modelCooldowns.value));
  }
  updateCooldowns();

  if (selectedModel.value === modelId) {
    // Prioritize high-quota models (500 RPD) when switching
    const priorityOrder = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.5-flash', 'gemini-3-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
    
    let nextAvailable = availableModels.value.find(m => priorityOrder.includes(m.id) && !isModelDisabled(m.id));
    if (!nextAvailable) {
      nextAvailable = availableModels.value.find(m => !isModelDisabled(m.id));
    }
    
    if (nextAvailable) {
      const prevModelObj = availableModels.value.find(m => m.id === modelId);
      const prevModelName = prevModelObj ? prevModelObj.name : modelId;
      selectedModel.value = nextAvailable.id;
      modelSwitchNotification.value = `Rate limit on "${prevModelName}". Auto-switched to "${nextAvailable.name}" (${nextAvailable.rpd}) and re-sent your question!`;
      setTimeout(() => {
        modelSwitchNotification.value = '';
      }, 8000);
    }
  }
};

const selectModelFromCard = (modelId) => {
  if (!isModelDisabled(modelId)) {
    selectedModel.value = modelId;
    showQuotaModal.value = false;
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      const sanitized = savedKey.trim().replace(/^["']|["']$/g, '');
      userApiKey.value = sanitized;
      inputApiKey.value = sanitized;
    } else {
      showKeyModal.value = true;
    }

    const savedModel = localStorage.getItem('gemini_selected_model');
    if (savedModel && availableModels.value.some(m => m.id === savedModel)) {
      selectedModel.value = savedModel;
    } else if (props.model) {
      selectedModel.value = props.model;
    }

    const savedCooldowns = localStorage.getItem('gemini_model_cooldowns');
    if (savedCooldowns) {
      try {
        modelCooldowns.value = JSON.parse(savedCooldowns);
      } catch (e) {}
    }

    updateCooldowns();
    cooldownTimer = setInterval(updateCooldowns, 1000);
    
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (showKeyModal.value) showKeyModal.value = false;
        if (showQuotaModal.value) showQuotaModal.value = false;
      }
    });

    const savedHistory = localStorage.getItem('ask_mini_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        history.value = parsed.map(item => {
          if (item.messages && item.messages.length >= 2) {
            return {
              id: item.id,
              question: item.messages[0].text,
              answer: item.messages[Math.max(1, item.messages.length - 1)].text,
              timestamp: item.timestamp
            };
          }
          return item;
        });
      } catch (e) {
        console.error('Error loading history', e);
      }
    }
  }
});

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
});

watch(history, (newHistory) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ask_mini_history', JSON.stringify(newHistory));
  }
}, { deep: true });

watch(selectedModel, (newModel) => {
  if (typeof window !== 'undefined' && newModel) {
    localStorage.setItem('gemini_selected_model', newModel);
  }
});

const effectiveApiKey = computed(() => {
  const key = userApiKey.value || defaultApiKey;
  return (key || '').trim().replace(/^["']|["']$/g, '');
});

const hasApiKey = computed(() => {
  return Boolean(effectiveApiKey.value);
});

const maskedKey = computed(() => {
  if (userApiKey.value) {
    const key = userApiKey.value.trim();
    if (key.length <= 8) return '••••' + key.slice(-4);
    return key.slice(0, 4) + '••••' + key.slice(-4);
  }
  if (defaultApiKey) {
    return 'Default Key';
  }
  return '';
});

const validModelName = computed(() => {
  const m = (selectedModel.value || props.model || '').trim();
  if (isModelDisabled(m)) {
    const next = availableModels.value.find(item => !isModelDisabled(item.id));
    if (next) return next.id;
  }
  return m || 'gemini-3.6-flash';
});

const toggleKeyModal = () => {
  showKeyModal.value = !showKeyModal.value;
  keyError.value = '';
  keySuccessMessage.value = '';
};

const saveApiKey = () => {
  keyError.value = '';
  keySuccessMessage.value = '';
  let trimmed = inputApiKey.value.trim().replace(/^["']|["']$/g, '');
  if (!trimmed) {
    keyError.value = 'Please enter a valid API key.';
    return;
  }
  inputApiKey.value = trimmed;
  userApiKey.value = trimmed;
  if (typeof window !== 'undefined') {
    localStorage.setItem('gemini_api_key', trimmed);
  }
  keySuccessMessage.value = '✓ API key saved successfully in your browser!';
  setTimeout(() => {
    showKeyModal.value = false;
    keySuccessMessage.value = '';
  }, 1500);
};

const clearApiKey = () => {
  userApiKey.value = '';
  inputApiKey.value = '';
  keyError.value = '';
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gemini_api_key');
  }
  keySuccessMessage.value = 'Key cleared.';
  setTimeout(() => {
    keySuccessMessage.value = '';
  }, 1500);
};

const renderMarkdown = (text) => {
  if (!text) return '';
  return marked.parse(text);
};

const formattedAnswer = computed(() => renderMarkdown(answer.value));

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const deleteHistory = (id) => {
  history.value = history.value.filter(item => item.id !== id);
};

const askQuestion = async (overridePrompt = null, attemptCount = 0) => {
  const promptStr = typeof overridePrompt === 'string' ? overridePrompt : (question.value || '');
  const currentQuestionText = String(promptStr).trim();
  if (!currentQuestionText) return;
  
  if (!hasApiKey.value) {
    showKeyModal.value = true;
    error.value = 'Please set up your Gemini API key first to ask questions.';
    return;
  }

  loading.value = true;
  error.value = '';
  answer.value = '';
  if (typeof overridePrompt !== 'string') {
    question.value = '';
  }
  
  try {
    let contextText = '';
    try {
      const txtRes = await fetch('/llms-full.txt');
      if (txtRes.ok) {
        contextText = await txtRes.text();
      } else {
        const fallbackRes = await fetch('/llms.txt');
        if (fallbackRes.ok) {
          contextText = await fallbackRes.text();
        }
      }
    } catch (e) {
      console.warn('Could not fetch documentation context, continuing without it.', e);
    }

    const basePrompt = props.systemPrompt || `You are "${props.botName}", a helpful AI assistant. Provide a clear, concise, and accurate answer in English based exclusively on the course documentation below.`;

    const systemPrompt = contextText 
      ? `${basePrompt}\n\nDocumentation text:\n${contextText.substring(0, 1000000)}`
      : basePrompt;

    const apiKeyToUse = effectiveApiKey.value;
    const modelToUse = validModelName.value;

    const requestBody = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: currentQuestionText }] }],
      generationConfig: { temperature: 0.3 }
    };

    // Attempt Streaming Request
    let streamSuccess = false;
    try {
      const streamRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:streamGenerateContent?alt=sse&key=${apiKeyToUse}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (streamRes.ok && streamRes.body) {
        const reader = streamRes.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        
        loading.value = false;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) {
            buffer += decoder.decode(value, { stream: true });
            let boundary = buffer.indexOf('\n');
            while (boundary !== -1) {
              const line = buffer.slice(0, boundary).trim();
              buffer = buffer.slice(boundary + 1);
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();
                if (dataStr && dataStr !== '[DONE]') {
                  try {
                    const data = JSON.parse(dataStr);
                    const textPart = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (textPart) {
                      answer.value += textPart;
                      streamSuccess = true;
                    }
                  } catch (e) {
                    console.error('Error parsing SSE data', e);
                  }
                }
              }
              boundary = buffer.indexOf('\n');
            }
          }
        }

        if (buffer.trim().startsWith('data: ')) {
          const dataStr = buffer.trim().slice(6).trim();
          if (dataStr && dataStr !== '[DONE]') {
            try {
              const data = JSON.parse(dataStr);
              const textPart = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (textPart) {
                answer.value += textPart;
                streamSuccess = true;
              }
            } catch (e) {}
          }
        }
      } else if (!streamRes.ok) {
        const errData = await streamRes.json().catch(() => ({}));
        const apiErrMsg = errData.error?.message || `HTTP ${streamRes.status}`;
        
        if (streamRes.status === 429 || streamRes.status === 503 || apiErrMsg.toLowerCase().includes('quota') || apiErrMsg.toLowerCase().includes('rate limit') || apiErrMsg.toLowerCase().includes('resource_exhausted') || apiErrMsg.toLowerCase().includes('unavailable')) {
          markModelUnavailable(modelToUse, 60);
          if (attemptCount < 2) {
            return askQuestion(currentQuestionText, attemptCount + 1);
          }
          throw new Error(`Model "${modelToUse}" is temporarily rate-limited. Auto-switched to "${selectedModel.value}".`);
        }

        if (streamRes.status === 400 || streamRes.status === 401 || streamRes.status === 403 || apiErrMsg.toLowerCase().includes('key')) {
          showKeyModal.value = true;
          throw new Error(`API key error: ${apiErrMsg}. Please check if your Gemini API key is valid.`);
        }
        throw new Error(`Google Gemini API error: ${apiErrMsg}`);
      }
    } catch (streamErr) {
      if (streamErr.message && (streamErr.message.includes('API key error') || streamErr.message.includes('rate-limited'))) throw streamErr;
      console.warn('Streaming failed, falling back to standard generateContent:', streamErr);
    }

    // Fallback to Non-Streaming Request if streaming produced no text
    if (!streamSuccess || !answer.value.trim()) {
      loading.value = true;
      const syncRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${apiKeyToUse}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!syncRes.ok) {
        const errData = await syncRes.json().catch(() => ({}));
        const apiErrMsg = errData.error?.message || `HTTP ${syncRes.status}`;
        
        if (syncRes.status === 429 || syncRes.status === 503 || apiErrMsg.toLowerCase().includes('quota') || apiErrMsg.toLowerCase().includes('rate limit') || apiErrMsg.toLowerCase().includes('resource_exhausted') || apiErrMsg.toLowerCase().includes('unavailable')) {
          markModelUnavailable(modelToUse, 60);
          if (attemptCount < 2) {
            return askQuestion(currentQuestionText, attemptCount + 1);
          }
          throw new Error(`Model "${modelToUse}" is temporarily rate-limited. Auto-switched to "${selectedModel.value}".`);
        }

        if (syncRes.status === 400 || syncRes.status === 401 || syncRes.status === 403 || apiErrMsg.toLowerCase().includes('key')) {
          showKeyModal.value = true;
          throw new Error(`API key error: ${apiErrMsg}. Please check if your Gemini API key is valid.`);
        }
        throw new Error(`Google Gemini API error: ${apiErrMsg}`);
      }

      const syncData = await syncRes.json();
      const textPart = syncData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textPart) {
        answer.value = textPart;
      } else {
        const blockReason = syncData.candidates?.[0]?.finishReason || syncData.promptFeedback?.blockReason;
        if (blockReason) {
          throw new Error(`Response blocked by Gemini safety filter (${blockReason}).`);
        }
        throw new Error('No content returned by Google Gemini API.');
      }
    }
    
    if (answer.value.trim()) {
      const newId = Date.now();
      history.value.unshift({
        id: newId,
        question: currentQuestionText,
        answer: answer.value,
        timestamp: newId
      });
      recentId.value = newId;
    }

  } catch (err) {
    console.error('Chat error:', err);
    error.value = err.message;
    question.value = currentQuestionText;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.gemini-course-chat {
  margin: 2rem 0;
  font-family: inherit;
}

.chat-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--vp-c-bg-alt, #f8fafc);
  border: 1px solid var(--vp-c-border, #e2e8f0);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

/* Key status bar */
.key-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-border, #e2e8f0);
  font-size: 0.88rem;
  transition: all 0.2s ease;
}

.key-status-bar.key-missing {
  border-color: rgba(245, 158, 11, 0.4);
  background: rgba(254, 243, 199, 0.35);
}

.key-status-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--vp-c-text-1);
}

.key-status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.badge-active {
  background: #def7ec;
  color: #03543f;
}

.badge-warning {
  background: #fef3c7;
  color: #92400e;
}

.key-status-bar code {
  background: var(--vp-c-bg-alt, #f1f5f9);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.82rem;
  font-family: monospace;
}

.btn-key-toggle {
  background: var(--vp-c-accent, #3eaf7c);
  color: white;
  border: none;
  padding: 0.45rem 0.9rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-key-toggle:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

/* Model Selection Toolbar */
.model-selection-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-border, #e2e8f0);
}

.model-select-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.model-select-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.model-brain-icon {
  font-size: 1.1rem;
}

.select-wrapper {
  position: relative;
}

.model-dropdown {
  padding: 0.45rem 2rem 0.45rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border, #cbd5e1);
  background: var(--vp-c-bg-alt, #f8fafc);
  color: var(--vp-c-text-1);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.6rem center;
  transition: border-color 0.2s;
}

.model-dropdown:focus {
  outline: none;
  border-color: var(--vp-c-accent, #3eaf7c);
}

.btn-view-quotas {
  background: transparent;
  color: var(--vp-c-accent, #3eaf7c);
  border: 1px solid var(--vp-c-accent, #3eaf7c);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-view-quotas:hover {
  background: rgba(62, 175, 124, 0.08);
}

.notification-banner {
  background: #eff6ff;
  color: #1e40af;
  border: 1px solid #bfdbfe;
  padding: 0.65rem 0.9rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  animation: fadeIn 0.2s ease-out;
}

/* Quotas Modal Dialog */
.quota-modal-dialog {
  max-width: 850px;
}

.quota-modal-header {
  margin-bottom: 1rem;
}

.quota-modal-header h3 {
  margin: 0 0 0.4rem 0;
  font-size: 1.2rem;
  color: var(--vp-c-text-1);
}

.quota-modal-intro {
  margin: 0;
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
  line-height: 1.45;
}

.quota-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.85rem;
  margin-top: 0.75rem;
}

.quota-card {
  background: var(--vp-c-bg-alt, #f8fafc);
  border: 1px solid var(--vp-c-border, #e2e8f0);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.85rem;
  transition: all 0.2s ease;
}

.quota-card.card-selected {
  border-color: var(--vp-c-accent, #3eaf7c);
  border-width: 2px;
  background: var(--vp-c-bg, #ffffff);
  box-shadow: 0 4px 12px rgba(62, 175, 124, 0.12);
}

.quota-card.card-disabled {
  opacity: 0.75;
  background: #fff1f2;
  border-color: #fecdd3;
}

.quota-card-top {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.quota-card-title-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.quota-card-title-group strong {
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.quota-status-tag {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.18rem 0.5rem;
  border-radius: 9999px;
  text-transform: uppercase;
}

.tag-selected {
  background: #def7ec;
  color: #03543f;
}

.tag-available {
  background: #e0f2fe;
  color: #0369a1;
}

.tag-cooldown {
  background: #ffe4e6;
  color: #9f1239;
}

.quota-card-desc {
  margin: 0;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.35;
}

.quota-metrics-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  background: var(--vp-c-bg, #ffffff);
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border, #e2e8f0);
}

.metric-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.metric-label {
  color: var(--vp-c-text-2);
}

.metric-val {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.btn-card-select {
  width: 100%;
  padding: 0.55rem;
  border-radius: 6px;
  border: none;
  background: var(--vp-c-accent, #3eaf7c);
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-card-select:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-card-select:disabled {
  background: var(--vp-c-bg-mute, #cbd5e1);
  color: var(--vp-c-text-2, #64748b);
  cursor: not-allowed;
}

.quota-card.card-disabled .btn-card-select:disabled {
  background: #fda4af;
  color: #881337;
}

/* Floating Modal Backdrop & Dialog */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
  animation: fadeIn 0.2s ease-out;
}

.modal-dialog {
  background: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-border, #e2e8f0);
  border-radius: 12px;
  padding: 1.75rem;
  max-width: 680px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.2s ease-out;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: var(--vp-c-text-2, #64748b);
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  background: var(--vp-c-bg-mute, #f1f5f9);
  color: var(--vp-c-text-1, #0f172a);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.key-config-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.key-title-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.key-title-group h3 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.badge-free {
  background: #def7ec;
  color: #03543f;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  text-transform: uppercase;
}

.key-config-intro {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

/* 5 Steps Guide - Grid Layout */
.key-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 0.75rem;
}

.step {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  background: var(--vp-c-bg-alt, #f8fafc);
  padding: 0.85rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border, #e2e8f0);
}

.step-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.step-num {
  background: var(--vp-c-accent, #3eaf7c);
  color: white;
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.step-header strong {
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.step p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

.step p a {
  color: var(--vp-c-accent, #3eaf7c);
  font-weight: 600;
  text-decoration: underline;
}

/* Key Form */
.key-input-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.key-input-field {
  flex: 1;
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--vp-c-border, #cbd5e1);
  border-radius: 6px;
  font-size: 0.9rem;
  background: var(--vp-c-bg, #ffffff);
  color: var(--vp-c-text-1);
  transition: border-color 0.2s;
}

.key-input-field:focus {
  outline: none;
  border-color: var(--vp-c-accent, #3eaf7c);
}

.btn-show-hide {
  background: var(--vp-c-bg-alt, #f1f5f9);
  border: 1px solid var(--vp-c-border, #cbd5e1);
  color: var(--vp-c-text-1);
  padding: 0.65rem 0.85rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-show-hide:hover {
  background: var(--vp-c-bg-mute, #e2e8f0);
}

.key-form-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-save-key {
  background: var(--vp-c-accent, #3eaf7c);
  color: white;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-save-key:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
}

.btn-save-key:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-delete-key {
  background: transparent;
  color: #ef4444;
  border: 1px solid #fca5a5;
  padding: 0.65rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.88rem;
  transition: all 0.2s;
}

.btn-delete-key:hover {
  background: #fef2f2;
}

.btn-cancel-modal {
  background: transparent;
  color: var(--vp-c-text-2, #64748b);
  border: 1px solid var(--vp-c-border, #cbd5e1);
  padding: 0.65rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.88rem;
  margin-left: auto;
  transition: background 0.2s;
}

.btn-cancel-modal:hover {
  background: var(--vp-c-bg-mute, #f1f5f9);
}

.key-success {
  color: #047857;
  background: #ecfdf5;
  padding: 0.55rem 0.85rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.key-error {
  color: #dc2626;
  background: #fef2f2;
  padding: 0.55rem 0.85rem;
  border-radius: 6px;
  font-size: 0.85rem;
}

.key-privacy-notice {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  line-height: 1.45;
  border-top: 1px dashed var(--vp-c-border, #e2e8f0);
  padding-top: 0.6rem;
}

/* Main Input Area */
.input-area {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.chat-textarea {
  width: 100%;
  min-height: 110px;
  padding: 0.85rem 1rem;
  border: 1px solid var(--vp-c-border, #cbd5e1);
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;
  background: var(--vp-c-bg, #ffffff);
  color: var(--vp-c-text-1);
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.chat-textarea:focus {
  outline: none;
  border-color: var(--vp-c-accent, #3eaf7c);
  box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.15);
}

.input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.input-hint {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.btn-ask {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  background: var(--vp-c-accent, #3eaf7c);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: opacity 0.2s, transform 0.1s, box-shadow 0.2s;
  box-shadow: 0 2px 6px rgba(62, 175, 124, 0.25);
}

.btn-ask:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
}

.btn-ask:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

/* Spinner */
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-banner {
  color: var(--vp-c-danger, #ef4444);
  font-weight: 500;
  font-size: 0.9rem;
  padding: 0.85rem 1rem;
  background: var(--vp-c-danger-soft, #fef2f2);
  border-radius: 8px;
  border: 1px solid var(--vp-c-danger, #ef4444);
}

/* Answer Card */
.answer-card {
  background: var(--vp-c-bg, #ffffff);
  border-radius: 10px;
  border: 1px solid var(--vp-c-border, #e2e8f0);
  border-left: 4px solid var(--vp-c-accent, #3eaf7c);
  padding: 1.25rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.answer-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--vp-c-border, #f1f5f9);
}

.bot-avatar {
  font-size: 1.2rem;
}

.bot-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.answer-body {
  line-height: 1.65;
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
}

/* History Section */
.history-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.history-header h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.history-count {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-mute, #e2e8f0);
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
}

.history-details {
  background: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-border, #e2e8f0);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.history-details[open] {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.history-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  font-size: 0.9rem;
  list-style: none;
  background: var(--vp-c-bg-alt, #f8fafc);
  transition: background-color 0.2s;
}

.history-summary::-webkit-details-marker {
  display: none;
}

.history-summary:hover {
  background: var(--vp-c-bg-mute, #f1f5f9);
}

.history-question-text {
  flex: 1;
  padding-right: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--vp-c-text-1);
}

.history-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.history-date {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  font-weight: normal;
}

.btn-icon {
  background: transparent;
  color: var(--vp-c-text-2);
  padding: 0.3rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s;
}

.btn-icon:hover {
  background: #fee2e2;
  color: #ef4444;
}

.history-answer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--vp-c-border, #e2e8f0);
  font-size: 0.92rem;
  background: var(--vp-c-bg, #ffffff);
  color: var(--vp-c-text-1);
  line-height: 1.6;
}
</style>
