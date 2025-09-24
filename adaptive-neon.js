// Detect weak GPU / low performance devices
function isLowPerformanceGPU() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return true; // No WebGL = low performance
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
  const lowEndKeywords = ['Intel', 'Mali', 'Apple GPU', 'Mesa'];
  return lowEndKeywords.some(keyword => renderer.includes(keyword));
}

// Disable neon effects for low-performance GPUs
if (isLowPerformanceGPU()) {
  document.querySelectorAll('.neon-btn, .nav-link, .affiliate-btn, .card, .affiliate-card, .video-grid iframe')
    .forEach(el => {
      el.style.animation = 'none';
      el.style.boxShadow = 'none';
      el.style.transition = 'none';
    });
}
