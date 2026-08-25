/**
 * Real client quotes only. Leave empty until you have permissioned testimonials.
 * The UI omits this section when the list is empty.
 */
export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
};

export const testimonials: Testimonial[] = [];
