# Quick Start Guide - Type-Driven Form Generator

**Branch**: `001-type-driven-form` | **Date**: 2025-11-12

## Installation

```bash
pnpm add react-ts-forms
```

**Requirements**:
- React 18+
- TypeScript 5.6+
- `experimentalDecorators: true` in `tsconfig.json`

## Vite Configuration

Add the Vite plugin to enable build-time type introspection:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { typeFormPlugin } from 'react-ts-forms/vite';

export default defineConfig({
  plugins: [
    react(),
    typeFormPlugin({
      include: ['src/**/*.tsx'],
      exclude: ['**/*.test.tsx']
    })
  ]
});
```

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "jsx": "react-jsx"
  }
}
```

---

## Basic Usage

### Example 1: Simple User Profile Form

Define a TypeScript interface for your data:

```typescript
// UserProfile.ts
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  newsletter: boolean;
}
```

Generate a form from the interface:

```typescript
// UserProfileForm.tsx
import { FormGenerator, generateSchema } from 'react-ts-forms';
import type { UserProfile } from './UserProfile';

// Generate schema at build-time
const userProfileSchema = generateSchema<UserProfile>();

export function UserProfileForm() {
  const handleSubmit = (values: UserProfile) => {
    console.log('Form submitted:', values);
    // values is strongly typed as UserProfile
  };

  return (
    <FormGenerator
      schema={userProfileSchema}
      onSubmit={handleSubmit}
      submitButtonText="Save Profile"
    />
  );
}
```

**Result**: A form with 5 fields:
- Text input for firstName
- Text input for lastName
- Text input for email
- Number input for age
- Checkbox for newsletter

---

## Customization with Decorators

### Example 2: Custom Labels and Validation

```typescript
import { Label, Placeholder, HelpText, Validate } from 'react-ts-forms';

class UserProfile {
  @Label('First Name')
  @Placeholder('Enter your first name')
  firstName: string;

  @Label('Last Name')
  @Placeholder('Enter your last name')
  lastName: string;

  @Label('Email Address')
  @Placeholder('you@example.com')
  @HelpText('We will never share your email')
  @Validate({ email: true }, 'Must be a valid email address')
  email: string;

  @Label('Age')
  @Validate({ min: 18 }, 'Must be at least 18 years old')
  age: number;

  @Label('Subscribe to newsletter')
  newsletter: boolean;
}
```

**Result**: Same form structure but with:
- Custom labels instead of field names
- Placeholder text in inputs
- Help text below email field
- Email validation on email field
- Minimum value validation on age field

---

## Complex Types

### Example 3: Nested Objects

```typescript
import { Label } from 'react-ts-forms';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

class UserProfile {
  @Label('Full Name')
  name: string;

  @Label('Email')
  email: string;

  // Nested object automatically creates grouped fields
  address: Address;
}
```

**Result**: Form with grouped address fields:
- Text input: Full Name
- Text input: Email
- Fieldset: Address
  - Text input: street
  - Text input: city
  - Text input: state
  - Text input: zipCode

---

### Example 4: Arrays with Add/Remove/Reorder

```typescript
import { Label, Placeholder } from 'react-ts-forms';

class UserProfile {
  @Label('Full Name')
  name: string;

  @Label('Email Addresses')
  @Placeholder('Enter email')
  emails: string[];

  @Label('Phone Numbers')
  phoneNumbers: string[];
}
```

**Result**: Form with array controls:
- Text input: Full Name
- Array field: Email Addresses
  - Text input: emails[0] with up/down/remove buttons
  - Text input: emails[1] with up/down/remove buttons
  - "Add Email Address" button at bottom
- Array field: Phone Numbers
  - Similar controls

**Usage**:
```typescript
const handleSubmit = (values: UserProfile) => {
  console.log(values.emails); // ['user@example.com', 'user2@example.com']
};

<FormGenerator
  schema={generateSchema<UserProfile>()}
  initialValues={{ emails: ['user@example.com'] }}
  onSubmit={handleSubmit}
/>
```

---

### Example 5: Enums and Union Types

```typescript
import { Label, UnionControl } from 'react-ts-forms';

enum AccountType {
  Free = 'free',
  Premium = 'premium',
  Enterprise = 'enterprise'
}

class UserProfile {
  @Label('Full Name')
  name: string;

  @Label('Account Type')
  accountType: AccountType; // Renders as select dropdown

  @Label('Contact Preference')
  @UnionControl('radio') // Force radio buttons instead of dropdown
  contactPreference: 'email' | 'phone' | 'sms';

  @Label('ID Number')
  // Union type: type selector dropdown, then appropriate input
  idNumber: string | number;
}
```

**Result**: 
- accountType: Select dropdown with options "Free", "Premium", "Enterprise"
- contactPreference: Radio button group with options "Email", "Phone", "SMS"
- idNumber: Dropdown to select "string" or "number", then text or number input appears

---

### Example 6: Recursive Types with Lazy Expansion

```typescript
import { Label } from 'react-ts-forms';

interface TreeNode {
  @Label('Node Name')
  name: string;

  @Label('Node Value')
  value: number;

  @Label('Child Nodes')
  children?: TreeNode[]; // Recursive reference
}
```

**Result**: Form with expand/collapse controls:
- Text input: Node Name
- Number input: Node Value
- Array field: Child Nodes
  - Initially collapsed (shows "Expand" button)
  - When expanded, shows nested TreeNode fields
  - Each nested level also has expand/collapse for its children

**Usage**:
```typescript
const handleSubmit = (values: TreeNode) => {
  // values structure matches TreeNode type with nested children
  console.log(values);
};
```

---

### Example 7: Date Fields

```typescript
import { Label } from 'react-ts-forms';

class UserProfile {
  @Label('Full Name')
  name: string;

  @Label('Date of Birth')
  birthDate: Date;

  @Label('Account Created')
  createdAt: Date;
}
```

**Result**: Date picker controls for `birthDate` and `createdAt` fields.

---

## Custom Components

### Example 8: Custom Input Control

```typescript
import { CustomControl, Label } from 'react-ts-forms';
import { RichTextEditor } from './RichTextEditor';

class BlogPost {
  @Label('Title')
  title: string;

  @Label('Content')
  @CustomControl(RichTextEditor)
  content: string;

  @Label('Published')
  published: boolean;
}
```

**Custom component implementation**:

```typescript
// RichTextEditor.tsx
import { FieldProps } from 'react-ts-forms';

export function RichTextEditor({ name, value, onChange, onBlur, errors, touched }: FieldProps) {
  return (
    <div>
      <div
        contentEditable
        onInput={(e) => onChange(e.currentTarget.textContent || '')}
        onBlur={onBlur}
        style={{ border: '1px solid #ccc', minHeight: '200px', padding: '8px' }}
      >
        {value}
      </div>
      {touched && errors?.map((error) => (
        <p key={error} style={{ color: 'red' }}>{error}</p>
      ))}
    </div>
  );
}
```

---

## Validation

### Example 9: Custom Validation Rules

```typescript
import { Label, Validate } from 'react-ts-forms';

class UserRegistration {
  @Label('Username')
  @Validate(
    (value) => value.length >= 3 && /^[a-zA-Z0-9_]+$/.test(value),
    'Username must be at least 3 characters and contain only letters, numbers, and underscores'
  )
  username: string;

  @Label('Password')
  @Validate({ minLength: 8 }, 'Password must be at least 8 characters')
  @Validate(
    (value) => /[A-Z]/.test(value) && /[0-9]/.test(value),
    'Password must contain at least one uppercase letter and one number'
  )
  password: string;

  @Label('Confirm Password')
  @Validate(
    (value, allValues) => value === allValues.password,
    'Passwords must match'
  )
  confirmPassword: string;

  @Label('Age')
  @Validate({ min: 13 }, 'Must be at least 13 years old')
  @Validate({ max: 120 }, 'Please enter a valid age')
  age: number;
}
```

**Validation timing**: Errors appear after user blurs each field (or on submit if never touched).

---

## Styling

### Example 10: Custom Styling with CSS Variables

```css
/* App.css */
:root {
  /* Override default form styles */
  --rtsf-form-padding: 2rem;
  --rtsf-field-margin-bottom: 1.5rem;
  
  /* Custom label styles */
  --rtsf-label-font-size: 1rem;
  --rtsf-label-font-weight: 600;
  --rtsf-label-color: #1f2937;
  
  /* Custom input styles */
  --rtsf-input-padding: 0.75rem 1rem;
  --rtsf-input-border: 2px solid #e5e7eb;
  --rtsf-input-border-radius: 0.5rem;
  
  /* Focus state */
  --rtsf-input-focus-border: 2px solid #3b82f6;
  
  /* Error state */
  --rtsf-input-error-border: 2px solid #ef4444;
  --rtsf-error-text-color: #ef4444;
}
```

Apply custom classes:

```typescript
<FormGenerator
  schema={schema}
  onSubmit={handleSubmit}
  className="custom-form"
  style={{ maxWidth: '600px', margin: '0 auto' }}
/>
```

---

## Controlled vs Uncontrolled

### Example 11: Controlled Form with External State

```typescript
import { useState } from 'react';
import { FormGenerator, generateSchema } from 'react-ts-forms';

interface FormData {
  name: string;
  email: string;
}

const schema = generateSchema<FormData>();

export function ControlledForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: ''
  });

  return (
    <div>
      <FormGenerator
        schema={schema}
        initialValues={formData}
        onChange={(values) => setFormData(values)}
        onSubmit={(values) => console.log('Final values:', values)}
      />
      
      <div>
        <h3>Live Preview</h3>
        <p>Name: {formData.name}</p>
        <p>Email: {formData.email}</p>
      </div>
    </div>
  );
}
```

---

## Advanced Features

### Example 12: Async Validation

```typescript
import { Validate, Label } from 'react-ts-forms';

// Simulated API call
const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  const response = await fetch(`/api/check-username?username=${username}`);
  const data = await response.json();
  return data.available;
};

class UserRegistration {
  @Label('Username')
  @Validate(
    async (value) => await checkUsernameAvailability(value),
    'Username is already taken'
  )
  username: string;

  @Label('Email')
  email: string;
}
```

**Behavior**: Shows loading indicator while async validation runs, then displays error if validation fails.

---

### Example 13: Conditional Validation

```typescript
import { Validate, Label } from 'react-ts-forms';

class ShippingForm {
  @Label('Same as billing address')
  sameAsBilling: boolean;

  @Label('Street Address')
  @Validate(
    (value, allValues) => allValues.sameAsBilling || value?.length > 0,
    'Street address is required'
  )
  street?: string;

  @Label('City')
  @Validate(
    (value, allValues) => allValues.sameAsBilling || value?.length > 0,
    'City is required'
  )
  city?: string;
}
```

**Behavior**: Street and city are only required if `sameAsBilling` is false.

---

## TypeScript Tips

### Type Inference

```typescript
// ✅ Good: Type inference works
const handleSubmit = (values: UserProfile) => {
  // values is strongly typed
  console.log(values.firstName); // ✅ TypeScript knows this exists
};

<FormGenerator
  schema={generateSchema<UserProfile>()}
  onSubmit={handleSubmit} // ✅ Type-safe callback
/>

// ❌ Bad: Loss of type safety
const handleSubmit = (values: any) => {
  console.log(values.firstNam); // ❌ Typo not caught
};
```

### Reusable Schemas

```typescript
// schemas.ts
import { generateSchema } from 'react-ts-forms';

export const userProfileSchema = generateSchema<UserProfile>();
export const addressSchema = generateSchema<Address>();
export const paymentSchema = generateSchema<PaymentInfo>();

// Usage in multiple components
import { userProfileSchema } from './schemas';

<FormGenerator schema={userProfileSchema} onSubmit={handleSubmit} />
```

---

## Next Steps

- **Storybook Documentation**: Run `pnpm storybook` to see interactive examples with all field types
- **API Reference**: See `/contracts/api-contracts.md` for complete API documentation
- **Contributing**: See `CONTRIBUTING.md` for development setup and contribution guidelines
- **Examples**: Check `/examples` directory for full application demos
