export const InteractionLabels = ['click', 'scroll', 'input'] as const;

export type InteractionLabels = (typeof InteractionLabels)[number];
