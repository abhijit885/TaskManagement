import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name,params);
  } else {
    console.log('Navigation not ready yet, queuing:', name);
    pendingRoutes.push({ name, params });
  }
}

// Optional: queue pending navigations
const pendingRoutes: { name: string; params?: any }[] = [];

export function processPendingNavigation() {
  if (navigationRef.isReady() && pendingRoutes.length) {
    const next = pendingRoutes.shift();
    if (next) navigate(next.name, next.params);
  }
}
