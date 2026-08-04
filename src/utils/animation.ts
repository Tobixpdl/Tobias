export const smoothEase = (value: number) => Math.min(1, 1.001 - Math.pow(2, -10 * value));

export function refreshAfterAssets(callback: () => void) {
  let cancelled = false;
  let firstFrame = 0;
  let secondFrame = 0;
  const pendingImages = Array.from(document.images).filter((image) => !image.complete);

  const refresh = () => {
    if (!cancelled) callback();
  };

  const onImageReady = () => refresh();
  pendingImages.forEach((image) => {
    image.addEventListener("load", onImageReady, { once: true });
    image.addEventListener("error", onImageReady, { once: true });
  });

  document.fonts?.ready.then(refresh).catch(() => undefined);
  window.addEventListener("load", refresh, { once: true });
  firstFrame = window.requestAnimationFrame(() => {
    secondFrame = window.requestAnimationFrame(refresh);
  });

  return () => {
    cancelled = true;
    window.cancelAnimationFrame(firstFrame);
    window.cancelAnimationFrame(secondFrame);
    window.removeEventListener("load", refresh);
    pendingImages.forEach((image) => {
      image.removeEventListener("load", onImageReady);
      image.removeEventListener("error", onImageReady);
    });
  };
}
