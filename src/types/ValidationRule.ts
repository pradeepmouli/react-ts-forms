/* Validation rule types based on data-model.md */

export type ValidationType =
	| 'required'
	| 'min'
	| 'max'
	| 'minLength'
	| 'maxLength'
	| 'pattern'
	| 'email'
	| 'url'
	| 'custom';

export type ValidationTiming = 'change' | 'blur' | 'submit';

export interface ValidationRule {
	/** Validation rule type */
	type: ValidationType;
	/** Error message to display when validation fails */
	message: string;
	/** Threshold value for min/max/minLength/maxLength */
	value?: number;
	/** Regex pattern for pattern validator */
	pattern?: RegExp;
	/** Custom validator function (sync or async) */
	validator?: (value: unknown, allValues: Record<string, unknown>) => boolean | Promise<boolean>;
	/** Whether validator runs asynchronously */
	async?: boolean;
	/** When to run this validator (defaults to 'blur') */
	timing?: ValidationTiming;
}
