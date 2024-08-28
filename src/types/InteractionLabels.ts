export const InteractionLabels = ['click', 'input'] as const;

export type InteractionLabels = (typeof InteractionLabels)[number];
