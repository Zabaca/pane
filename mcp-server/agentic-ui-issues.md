# Agentic UI - Issues Log

Tracking issues encountered while using Claude Code with Agentic UI as the primary communication interface.

## Session: 2025-12-24

### Issue #1: Single Input Limitation
**Status:** ✅ RESOLVED (2025-12-24)
**Description:** The current `show_input_form` only stores the LAST user input in `userInput` state. There's no way to:
- Collect multiple inputs sequentially and store them
- Define custom keys for where input values should be stored
- Build up a user context over time

**Current Behavior:**
```javascript
userInput: "Something...." // Only last value
```

**Desired Behavior:**
```javascript
userContext: {
  userName: "James",
  userRole: "Developer",
  preferredLanguage: "TypeScript"
}
```

**Proposed Solution:** Add `userContext` state object and allow `show_input_form` to specify a `key` parameter for storing the response.

---

### Issue #2: No Multi-Field Forms
**Status:** Active - Needs Enhancement
**Description:** Can only ask one question at a time. No ability to present multiple form fields in a single view.

**Desired Behavior:** Support for multi-field forms:
```javascript
show_multi_form({
  fields: [
    { key: "name", label: "Your Name", type: "text" },
    { key: "role", label: "Your Role", type: "text" },
    { key: "experience", label: "Years of Experience", type: "number" }
  ]
})
```

---

### Issue #3: No Combined Display + Input
**Status:** ✅ RESOLVED (2025-12-24)
**Priority:** High
**Description:** Currently, displaying content (`set_markdown`) and requesting input (`show_input_form`) are mutually exclusive. Cannot show contextual information while also asking for user input.

**Solution Implemented:**
- Added `content` parameter to `show_input_form` tool
- Integrated input form directly into `TextDisplay` component
- When `show_input_form` is called with `content`, the markdown displays in the main area with input form below

**Usage:**
```javascript
show_input_form({
  content: "## Here's what I found...\n\n- Option A\n- Option B",
  prompt: "Which option do you prefer?",
  key: "userChoice"
})
```

This allows Claude to present information AND gather feedback in a single unified view.

---

### Issue #4: No Auto-Trigger from UI Responses
**Status:** Active - Architectural Limitation
**Priority:** Medium
**Description:** When user submits input in Agentic UI, Claude cannot automatically be notified/triggered. User must switch back to Claude Code terminal to continue the conversation.

**Current Flow:**
1. Claude shows input form in Agentic UI
2. User submits response in Agentic UI
3. User must manually go back to Claude Code and say something
4. Claude then calls `get_user_input` to retrieve the value

**Ideal Flow:**
1. Claude shows input form in Agentic UI
2. User submits response in Agentic UI
3. Claude automatically receives the input and continues

**Technical Challenge:** MCP is pull-based (Claude calls tools), not push-based (tools can't notify Claude). This is a fundamental limitation of the MCP protocol.

**Potential Workarounds:**
- Polling: Claude periodically checks for input (wasteful)
- Webhooks: If Claude Code supported incoming webhooks
- User instruction: Tell user to press Enter in Claude Code after submitting
- Future MCP enhancement: Server-sent events or notifications

**Note:** Deferring this until after user context implementation is complete.

---

### Issue #5: No State Persistence
**Status:** ✅ RESOLVED (2025-12-24)
**Priority:** High
**Description:** All state (userContext, text, history) is stored in memory only. When the MCP server restarts (e.g., `/mcp` reconnect), all data is lost.

**Solution Implemented:** File-based JSON persistence with Option B (full state restoration)

**Implementation Details:**
- State file: `.agentic-ui-state.json` in mcp-server directory
- Uses `import.meta.url` for ESM-compatible path resolution
- Persists on every state change via XState subscription

**Persisted State (Option B):**
```typescript
interface PersistedState {
  text: string;
  contentType: 'text' | 'markdown';
  history: HistoryEntry[];
  userContext: Record<string, unknown>;
  inputRequest: InputRequest | null;  // Full input form state
  inputStatus: InputStatus;            // pending/submitted/etc.
}
```

**On Restore:**
1. Load all state including `inputRequest`
2. If `inputRequest` exists → start in `waitingForInput` state
3. Generate new `requestId` (old one is stale)
4. User sees content + input form, can continue exactly where left off

**Result:**
- ✅ `userContext` persists
- ✅ `text` persists
- ✅ `history` persists
- ✅ `inputRequest` persists (Option B)
- ✅ Full state restoration across MCP restarts

---

## Notes

- All communication with user now happening through Agentic UI canvas
- MCP server located at: `packages/mcp-agentic-ui/mcp-server/`

## Implementation Priority

1. ~~**Issue #1** - User context with keyed storage~~ ✅ DONE
2. ~~**Issue #3** - Combined display + input~~ ✅ DONE
3. ~~**Issue #5** - State persistence (Option B - full restoration)~~ ✅ DONE
4. **Issue #2** - Multi-field forms
5. **Issue #4** - Auto-trigger (requires workaround research)
