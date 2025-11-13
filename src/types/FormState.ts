/* Runtime form state tracking shape. */

export interface FormState<T = Record<string, unknown>> {
	values: T;
	errors: Record<string, string[]>;
	touched: Set<string>;
	validating: Set<string>;
	submitted: boolean;
	submitting: boolean;
	isValid: boolean;
	isDirty: boolean;
	expandedArrayItems: Record<string, Set<number>>;
	expandedRecursiveFields: Set<string>;
	selectedUnionVariants: Record<string, string>;
}
