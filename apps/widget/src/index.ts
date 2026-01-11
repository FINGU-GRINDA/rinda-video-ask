import { RindaAskWidget } from './widget'
import { WidgetConfig } from './types'

// Auto-initialize if script tag has data attributes
function autoInit() {
  const script = document.currentScript as HTMLScriptElement | null
  if (!script) return

  const projectId = script.dataset.projectId
  if (!projectId) return

  const config: Partial<WidgetConfig> = {
    projectId,
    apiUrl: script.dataset.apiUrl || 'https://api.rindaask.com',
  }

  // Parse optional config from data attributes
  if (script.dataset.position) {
    config.position = script.dataset.position as WidgetConfig['position']
  }
  if (script.dataset.theme) {
    config.theme = script.dataset.theme as WidgetConfig['theme']
  }
  if (script.dataset.primaryColor) {
    config.primaryColor = script.dataset.primaryColor
  }
  if (script.dataset.language) {
    config.language = script.dataset.language
  }

  // Initialize widget
  window.RindaAsk = new RindaAskWidget(config as WidgetConfig)
}

// Export for manual initialization
declare global {
  interface Window {
    RindaAsk: RindaAskWidget
    RindaAskWidget: typeof RindaAskWidget
  }
}

window.RindaAskWidget = RindaAskWidget

// Auto-init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit)
} else {
  autoInit()
}

export { RindaAskWidget }
export type { WidgetConfig }
