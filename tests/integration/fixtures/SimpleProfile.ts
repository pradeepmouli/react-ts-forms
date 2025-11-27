export type MailingAddress = {
	street: string;
	city: string;
	zipCode: number;
};

export class NotificationPreferences {
	marketingEmails!: boolean;
	smsAlerts?: boolean;
}

export interface SimpleProfile {
	readonly id: number;
	firstName: string;
	email: string;
	age?: number;
	isActive: boolean;
	address: MailingAddress;
	preferences: NotificationPreferences;
}
