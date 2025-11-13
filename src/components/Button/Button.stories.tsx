import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
	title: 'Components/Button',
	component: Button,
	args: {
		children: 'Click me'
	}
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
	args: { variant: 'primary' }
};

export const Loading: Story = {
	args: { loading: true }
};
