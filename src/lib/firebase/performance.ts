import { getPerformance } from 'firebase/performance';
import type { FirebaseApp } from 'firebase/app';

export function initializePerformance(app: FirebaseApp) {
  if (typeof window !== 'undefined') {
    const perf = getPerformance(app);
    
    // Configurar observadores personalizados para métricas web vitals
    if ('PerformanceObserver' in window) {
      // Observar FID (First Input Delay)
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // Type assertion para PerformanceEventTiming
          const eventEntry = entry as PerformanceEventTiming;
          if (eventEntry.processingStart) {
            const metric = {
              name: 'FID',
              value: eventEntry.processingStart - eventEntry.startTime,
              rating: eventEntry.duration < 100 ? 'good' : eventEntry.duration < 300 ? 'needs-improvement' : 'poor'
            };
            console.log('FID Metric:', metric);
          }
        }
      });
      
      fidObserver.observe({ type: 'first-input', buffered: true });

      // Observar LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        const metric = {
          name: 'LCP',
          value: lastEntry.startTime,
          rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs-improvement' : 'poor'
        };
        console.log('LCP Metric:', metric);
      });
      
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    }

    return perf;
  }
  return null;
} 