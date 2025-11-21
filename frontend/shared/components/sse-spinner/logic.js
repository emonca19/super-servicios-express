// Helpers for sse-spinner

export function spinnerClass(size = 'md') {
  switch (size) {
    case 'sm': return 'w-4 h-4';
    case 'lg': return 'w-8 h-8';
    default: return 'w-6 h-6';
  }
}
