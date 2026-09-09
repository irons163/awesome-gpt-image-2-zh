export const IMAGE_MODELS = [
  { id: 'gpt-image-2', label: 'GPT-Image-2' },
  { id: 'gpt-image-2.5', label: 'ChatGPT Images 2.5' },
  { id: 'gpt-image-2.5-flare', label: 'GPT-Image-2.5 Flare' },
  { id: 'gpt-image-2.5-sunburst', label: 'GPT-Image-2.5 Sunburst' },
];
export const imageModel = item => item.model || 'gpt-image-2';
export const imageModelLabel = item => IMAGE_MODELS.find(model => model.id === imageModel(item))?.label || imageModel(item);
