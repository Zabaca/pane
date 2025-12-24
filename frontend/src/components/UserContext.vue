<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  userContext: Record<string, unknown>;
}>();

const isCollapsed = ref(false);

// Filter out transient/internal keys
const displayContext = computed(() => {
  const transientKeys = ['tweetApproval', 'tweetDecision'];
  return Object.entries(props.userContext)
    .filter(([key]) => !transientKeys.includes(key))
    .map(([key, value]) => ({
      key,
      displayKey: formatKey(key),
      value: formatValue(value),
    }));
});

const hasContext = computed(() => displayContext.value.length > 0);

// Convert camelCase to Title Case
function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

// Format value for display
function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
}
</script>

<template>
  <div class="user-context">
    <div class="header" @click="toggleCollapse">
      <div class="title">
        <span class="icon">👤</span>
        User Context
      </div>
      <div class="toggle">
        <span v-if="hasContext" class="count">{{ displayContext.length }}</span>
        <span class="arrow" :class="{ collapsed: isCollapsed }">▼</span>
      </div>
    </div>

    <div v-if="!isCollapsed" class="content">
      <div v-if="hasContext" class="context-list">
        <div v-for="item in displayContext" :key="item.key" class="context-item">
          <span class="context-key">{{ item.displayKey }}</span>
          <span class="context-value">{{ item.value }}</span>
        </div>
      </div>
      <div v-else class="empty-state">
        No user context collected yet.
        <br />
        <span class="hint">Use show_input_form with a key to collect data.</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-context {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.header:hover {
  background: #222;
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
}

.icon {
  font-size: 1rem;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.count {
  background: #4a9eff;
  color: #000;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.arrow {
  color: #666;
  font-size: 0.7rem;
  transition: transform 0.2s;
}

.arrow.collapsed {
  transform: rotate(-90deg);
}

.content {
  border-top: 1px solid #333;
  padding: 16px 20px;
}

.context-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.context-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.context-key {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #666;
}

.context-value {
  font-size: 0.9rem;
  color: #fff;
  background: #222;
  padding: 8px 12px;
  border-radius: 6px;
  word-break: break-word;
}

.empty-state {
  text-align: center;
  color: #666;
  font-size: 0.85rem;
  padding: 10px 0;
}

.hint {
  font-size: 0.75rem;
  color: #555;
  font-style: italic;
}
</style>
