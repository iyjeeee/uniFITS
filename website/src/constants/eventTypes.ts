// constants/eventTypes.ts -- Event types offered by the Events filter and the Add/Edit event forms
export const EVENT_TYPES = ['Fundraising', 'Sports', 'Civic', 'Training', 'General']
export const EVENT_TYPE_SELECT_OPTIONS = EVENT_TYPES.map((t) => ({ value: t, label: t }))   // for <Select options>
