import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChatWidget } from './components/ChatWidget';
import type { WidgetConfig } from './types';
import './styles.css';

// Global interface for window
interface ResolverChatGlobal {
  init: (config: WidgetConfig) => void;
  destroy: () => void;
}

declare global {
  interface Window {
    ResolverChat: ResolverChatGlobal;
  }
}

let root: ReturnType<typeof createRoot> | null = null;
let container: HTMLElement | null = null;

const init = (config: WidgetConfig) => {
  // Destroy existing instance if any
  destroy();

  // Create container
  container = document.createElement('div');
  container.id = 'resolver-chat-widget-root';
  document.body.appendChild(container);

  // Mount React app
  root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ChatWidget {...config} />
    </React.StrictMode>
  );
};

const destroy = () => {
  if (root) {
    root.unmount();
    root = null;
  }
  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
    container = null;
  }
};

// Expose to window
window.ResolverChat = {
  init,
  destroy,
};

// Auto-init if config is present in window
if ((window as any).RESOLVER_CHAT_CONFIG) {
  init((window as any).RESOLVER_CHAT_CONFIG);
}

export { ChatWidget, init, destroy };
export type { WidgetConfig, Message, QuickReply, Lead } from './types';
