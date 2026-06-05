// jsdom does not implement ResizeObserver; mock it so Recharts renders without error.
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
