/**
 * Phase 6: Field mask utilities for template literal types
 * Auto-formats user input based on template patterns
 */

export interface FieldMask {
	mask: string; // Display mask with placeholders (e.g., "user-___")
	format: (value: string) => string; // Format raw input to match pattern
	parse: (formattedValue: string) => string; // Extract raw value from formatted
	placeholder?: string; // Auto-generated placeholder
}

/**
 * Generate field mask from template literal pattern
 * Converts template patterns to input masks for auto-formatting
 */
export function generateFieldMask(templatePattern: string): FieldMask | null {
	// Track literal parts and placeholder parts
	const parts: Array<{ type: 'literal' | 'placeholder'; value: string; placeholderType?: string }> = [];
	
	let currentLiteral = '';
	let i = 0;
	
	while (i < templatePattern.length) {
		// Check for template placeholder
		if (templatePattern.startsWith('${', i)) {
			// Save any accumulated literal
			if (currentLiteral) {
				parts.push({ type: 'literal', value: currentLiteral });
				currentLiteral = '';
			}
			
			// Find end of placeholder
			const endIndex = templatePattern.indexOf('}', i);
			if (endIndex === -1) break;
			
			const placeholder = templatePattern.substring(i + 2, endIndex);
			parts.push({ 
				type: 'placeholder', 
				value: placeholder,
				placeholderType: placeholder 
			});
			
			i = endIndex + 1;
		} else {
			currentLiteral += templatePattern[i];
			i++;
		}
	}
	
	// Save any remaining literal
	if (currentLiteral) {
		parts.push({ type: 'literal', value: currentLiteral });
	}
	
	if (parts.length === 0) return null;
	
	// Generate mask string
	const maskChars: Record<string, string> = {
		'string': '_',
		'number': '#',
		'bigint': '#',
		'boolean': 'B',
	};
	
	let mask = '';
	let placeholder = '';
	
	for (const part of parts) {
		if (part.type === 'literal') {
			mask += part.value;
			placeholder += part.value;
		} else {
			const char = maskChars[part.value] || '_';
			// Use 3 characters for variable-length placeholders
			const length = part.value === 'string' ? 10 : 3;
			mask += char.repeat(length);
			
			// Generate helpful placeholder text
			switch (part.value) {
				case 'string':
					placeholder += 'text';
					break;
				case 'number':
				case 'bigint':
					placeholder += '123';
					break;
				case 'boolean':
					placeholder += 'true';
					break;
				default:
					placeholder += part.value;
			}
		}
	}
	
	return {
		mask,
		format: (value: string) => formatWithMask(value, parts),
		parse: (formattedValue: string) => parseFromMask(formattedValue, parts),
		placeholder,
	};
}

/**
 * Format raw value according to mask parts
 */
function formatWithMask(
	value: string,
	parts: Array<{ type: 'literal' | 'placeholder'; value: string; placeholderType?: string }>
): string {
	let result = '';
	let valueIndex = 0;
	
	for (const part of parts) {
		if (part.type === 'literal') {
			result += part.value;
		} else {
			// Extract characters for this placeholder
			const extracted = extractPlaceholderChars(
				value.substring(valueIndex),
				part.placeholderType || 'string'
			);
			
			result += extracted.chars;
			valueIndex += extracted.consumed;
			
			if (valueIndex >= value.length) break;
		}
	}
	
	return result;
}

/**
 * Extract characters matching the placeholder type
 */
function extractPlaceholderChars(
	value: string,
	placeholderType: string
): { chars: string; consumed: number } {
	let chars = '';
	let consumed = 0;
	
	for (let i = 0; i < value.length; i++) {
		const char = value[i];
		
		switch (placeholderType) {
			case 'number':
			case 'bigint':
				if (/\d/.test(char)) {
					chars += char;
					consumed++;
				} else {
					// Stop at first non-digit
					return { chars, consumed };
				}
				break;
			case 'boolean':
				// Accept 'true' or 'false'
				if (chars.length < 5 && /[truefals]/.test(char.toLowerCase())) {
					chars += char;
					consumed++;
				} else {
					return { chars, consumed };
				}
				break;
			case 'string':
			default:
				// Accept any character (except the next literal part if we knew it)
				chars += char;
				consumed++;
				break;
		}
	}
	
	return { chars, consumed };
}

/**
 * Parse formatted value back to raw value
 */
function parseFromMask(
	formattedValue: string,
	parts: Array<{ type: 'literal' | 'placeholder'; value: string; placeholderType?: string }>
): string {
	let result = '';
	let valueIndex = 0;
	
	for (const part of parts) {
		if (part.type === 'literal') {
			// Skip literal parts in the formatted value
			valueIndex += part.value.length;
		} else {
			// Extract value until next literal or end
			let extracted = '';
			while (valueIndex < formattedValue.length) {
				const char = formattedValue[valueIndex];
				
				// Check if this is the start of the next literal part
				const nextLiteralIndex = parts.indexOf(part) + 1;
				if (nextLiteralIndex < parts.length && parts[nextLiteralIndex].type === 'literal') {
					const nextLiteral = parts[nextLiteralIndex].value;
					if (formattedValue.substring(valueIndex).startsWith(nextLiteral)) {
						break;
					}
				}
				
				extracted += char;
				valueIndex++;
			}
			
			result += extracted;
		}
	}
	
	return result;
}

/**
 * Apply field mask to input element
 * Formats value as user types
 */
export function applyFieldMask(
	input: HTMLInputElement,
	mask: FieldMask,
	onChange?: (rawValue: string) => void
): () => void {
	const handleInput = () => {
		const cursorPosition = input.selectionStart || 0;
		const rawValue = mask.parse(input.value);
		const formattedValue = mask.format(rawValue);
		
		// Only update if value changed
		if (input.value !== formattedValue) {
			input.value = formattedValue;
			
			// Try to maintain cursor position
			// This is a simplified approach - real implementation would be more sophisticated
			const newPosition = Math.min(cursorPosition, formattedValue.length);
			input.setSelectionRange(newPosition, newPosition);
		}
		
		// Call onChange with raw value
		if (onChange) {
			onChange(rawValue);
		}
	};
	
	input.addEventListener('input', handleInput);
	
	// Return cleanup function
	return () => {
		input.removeEventListener('input', handleInput);
	};
}
