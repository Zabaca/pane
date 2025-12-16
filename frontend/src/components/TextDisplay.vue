<script setup lang="ts">
import { computed } from 'vue';
import MermaidDisplay from './MermaidDisplay.vue';

const props = defineProps<{
  text: string;
  state: string;
  contentType: 'text' | 'markdown';
}>();

const isEmpty = computed(() => !props.text);
const isMarkdown = computed(() => props.contentType === 'markdown');
const label = computed(() => isMarkdown.value ? 'Markdown Content' : 'Displayed Text');
</script>

<template>
  <div class="text-display" :class="{ empty: isEmpty, markdown: isMarkdown }">
    <div class="label">{{ label }}</div>
    <div class="content" :class="{ 'markdown-mode': isMarkdown }">
      <template v-if="!isEmpty">
        <!-- Markdown rendering -->
        <MermaidDisplay v-if="isMarkdown" :content="text" />
        <!-- Plain text (existing) -->
        <div v-else class="plain-text">{{ text }}</div>
      </template>
      <template v-else>
        <span class="placeholder">No content to display</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.text-display {
  background: #1a1a1a;
  border: 2px solid #333;
  border-radius: 12px;
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.text-display:not(.empty) {
  border-color: #4a9eff;
  box-shadow: 0 0 20px rgba(74, 158, 255, 0.1);
}

.text-display.markdown:not(.empty) {
  border-color: #9b59b6;
  box-shadow: 0 0 20px rgba(155, 89, 182, 0.1);
}

.label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #666;
  margin-bottom: 16px;
}

.content {
  flex: 1;
  font-size: 2rem;
  line-height: 1.4;
  word-wrap: break-word;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
}

/* Markdown mode adjusts layout */
.content.markdown-mode {
  font-size: 1rem;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  overflow: auto;
}

.plain-text {
  width: 100%;
}

.placeholder {
  color: #444;
  font-style: italic;
}

.empty .content {
  color: #444;
}
</style>
