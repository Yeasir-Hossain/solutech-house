/** Shared contract for the 3-step valuation form and the lead API. */

export const PROPERTY_TYPES = {
  apartment: 'Apartment',
  'bungalow-detached': 'Bungalow (Detached)',
  'bungalow-semi': 'Bungalow (Semi)',
  'bungalow-endterr': 'Bungalow (End Terrace)',
  'house-terrace': 'House (Terrace)',
  'house-endterrace': 'House (End Terrace)',
  'house-detached': 'House (Detached)',
  'house-semi': 'House (Semi Detached)',
  other: 'Other',
} as const;

export type PropertyType = keyof typeof PROPERTY_TYPES;

export const BEDROOM_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8+'] as const;

export interface LeadPayload {
  postcode: string;
  address: string;
  property_type: string;
  bedrooms: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  /** Honeypot — real users leave this empty. */
  company: string;
  /** Seconds between form render and submit; bots are far too fast. */
  elapsed: number;
}

export interface LeadResponse {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
}

export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Shared field validation so client and server never disagree. */
export function validateLead(input: Partial<LeadPayload>): Record<string, string> {
  const errors: Record<string, string> = {};
  const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

  if (!text(input.postcode)) errors.postcode = 'Please enter your postcode.';
  if (!(text(input.property_type) in PROPERTY_TYPES)) {
    errors.property_type = 'Please choose a property type.';
  }
  if (!text(input.bedrooms)) errors.bedrooms = 'Please select the number of bedrooms.';
  if (!text(input.first_name)) errors.first_name = 'Please enter your first name.';
  if (!text(input.last_name)) errors.last_name = 'Please enter your last name.';
  if (!text(input.phone)) errors.phone = 'Please enter a phone number.';

  const email = text(input.email);
  if (email && !EMAIL_RE.test(email)) errors.email = 'That email address doesn’t look right.';

  return errors;
}
