// Temporary React type shim until dependencies installed.
// Provides minimal surface used in foundational type definitions.

declare namespace React {
	interface CSSProperties {
		[key: string]: any;
	}
	type ComponentType<P = any> = (props: P) => any;
}
