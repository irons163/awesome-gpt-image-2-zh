export const IMAGE_MODELS = [
  { id: 'gpt-image-2', label: 'GPT-Image-2' },
  { id: 'gpt-image-2.5', label: 'GPT-Image-2.5' },
  { id: 'gpt-image-2.5-flare', label: 'GPT-Image-2.5 Flare' },
  { id: 'gpt-image-2.5-sunburst', label: 'GPT-Image-2.5 Sunburst' },
];
export const imageModel = item => item.model || 'gpt-image-2';
export const imageModelLabel = item => IMAGE_MODELS.find(model => model.id === imageModel(item))?.label || imageModel(item);

// Each case keeps its identity and prompt while switching its displayed image.
export function galleryImageForModel(item, selectedModel) {
  const variants = (item.imageVariants || []).filter(variant => variant.image && variant.status === 'published');
  const newer = variants.find(variant => /^gpt-image-2\.5(?:-|$)/.test(variant.model));
  const chosen = selectedModel === 'All' ? newer
    : selectedModel === 'gpt-image-2.5' ? newer
    : variants.find(variant => variant.model === selectedModel);
  if (chosen) return { ...item, ...chosen, id: item.id, promptSourceUrl: item.sourceUrl, sourceLabel: 'GPT-Image-2.5', sourceUrl: '' };
  if (selectedModel === 'All' || selectedModel === imageModel(item) || (selectedModel === 'gpt-image-2.5' && /^gpt-image-2\.5(?:-|$)/.test(imageModel(item)))) return item;
  return null;
}
