<script setup lang="ts">
import { computed } from 'vue';
import { useWebSocket } from './composables/useWebSocket';
import TextDisplay from './components/TextDisplay.vue';
import StateIndicator from './components/StateIndicator.vue';
import ActionLog from './components/ActionLog.vue';
import UserContext from './components/UserContext.vue';

const { connected, state, actionLog, submitInput, cancelInput, submitMultiForm, toggleSidebar } = useWebSocket();

// Get sidebarVisible from WebSocket state
const sidebarVisible = computed(() => state.value.sidebarVisible ?? true);
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Pane</h1>
      <button
        class="sidebar-toggle"
        @click="toggleSidebar"
        :title="sidebarVisible ? 'Hide sidebar' : 'Show sidebar'"
      >
        {{ sidebarVisible ? '→' : '←' }}
      </button>
      <div class="connection-status" :class="{ connected }">
        {{ connected ? 'Connected' : 'Disconnected' }}
      </div>
    </header>

    <main class="main" :class="{ 'sidebar-hidden': !sidebarVisible }">
      <div class="display-section">
        <!-- Unified TextDisplay handles both content and input -->
        <TextDisplay
          :text="state.text"
          :state="state.currentState"
          :content-type="state.contentType"
          :input-request="state.inputRequest"
          @submit-input="submitInput"
          @cancel-input="cancelInput"
          @submit-multi-form="submitMultiForm"
        />
      </div>

      <div v-if="sidebarVisible" class="info-section">
        <UserContext :user-context="state.userContext" />
        <StateIndicator
          :current-state="state.currentState"
          :history-count="state.historyCount"
          :last-error="state.lastError"
          :available-actions="state.availableActions"
        />
        <ActionLog :entries="actionLog" />
      </div>
    </main>

    <footer class="footer">
      <p>Control this UI by asking Claude to use the agentic-ui tools</p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #333;
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 500;
  color: #fff;
  margin-right: auto;
}

.sidebar-toggle {
  padding: 8px 12px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  min-width: 40px;
}

.sidebar-toggle:hover {
  background: #333;
  border-color: #ff9f4a;
}

.sidebar-toggle:active {
  transform: scale(0.95);
}

.connection-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  background: #3d1515;
  color: #ff6b6b;
}

.connection-status.connected {
  background: #153d15;
  color: #6bff6b;
}

.main {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
}

.main.sidebar-hidden {
  grid-template-columns: 1fr;
}

.display-section {
  display: flex;
  flex-direction: column;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #333;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .main {
    grid-template-columns: 1fr;
  }
}
</style>
