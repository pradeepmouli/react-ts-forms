import * as React from 'react';

/**
 * AppProviders: central place to add global providers for stories/apps.
 * Add Theme, i18n, Router, QueryClient, etc. here in future.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
