/* Props passed to custom field components. */
import type { FieldDefinition } from './FormSchema';
import type { FormState } from './FormState';

export interface FieldProps<TValue = unknown> {
	/** Field definition object */
	definition: FieldDefinition;
	/** Current raw value for the field */
	value: TValue;
	/** Update value callback */
	onChange: (next: TValue) => void;
	/** Blur handler for touch tracking */
	onBlur: () => void;
	/** Whether field has been touched */
	touched: boolean;
	/** Validation errors (already filtered for this field) */
	errors: string[];
	/** Whether field is currently validating asynchronously */
	validating: boolean;
	/** Entire form state reference (read-only) */
	formState: FormState;
}
