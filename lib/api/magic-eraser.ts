export interface MagicEraserRequest {
  image: string; // Base64 data URI of original image
  mask?: string; // Base64 data URI of painted mask canvas
  mode: 'magic-eraser' | 'remove-background';
  model?: 'local-inpainting' | 'replicate-lama' | 'huggingface-sd' | 'photoroom';
  apiKey?: string;
}

export interface MagicEraserResponse {
  success: boolean;
  resultImageUrl?: string;
  error?: string;
  processingTimeMs?: number;
}

/**
 * AI Magic Eraser & Background Remover API Integration
 */
export async function removeObjectOrBackground(
  request: MagicEraserRequest
): Promise<MagicEraserResponse> {
  const startTime = Date.now();

  // 1. If user provided a Replicate API key or model choice
  if (request.apiKey && request.model === 'replicate-lama') {
    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${request.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "cbf3f92795457d9f7831d3d639b7a40733857ab349bcbc765d75e01b34a652a6", // LaMa Inpainting model
          input: {
            image: request.image,
            mask: request.mask,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Replicate API error: ${response.statusText}`);
      }

      const prediction = await response.json();
      return {
        success: true,
        resultImageUrl: prediction.output || request.image,
        processingTimeMs: Date.now() - startTime,
      };
    } catch (err: any) {
      console.warn('Replicate API call failed, falling back to local engine:', err);
    }
  }

  // 2. Client-Side Content-Aware Fast Marching Boundary Propagation Inpainting
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) {
        resolve({ success: false, error: 'Failed to obtain 2D canvas context.' });
        return;
      }

      ctx.drawImage(img, 0, 0);
      const w = canvas.width;
      const h = canvas.height;

      if (request.mode === 'remove-background') {
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Multi-sample background color detection (4 corners)
        const corners = [
          0, // top-left
          (w - 1) * 4, // top-right
          (h - 1) * w * 4, // bottom-left
          ((h - 1) * w + (w - 1)) * 4 // bottom-right
        ];

        let bgR = 0, bgG = 0, bgB = 0;
        corners.forEach(idx => {
          bgR += data[idx];
          bgG += data[idx + 1];
          bgB += data[idx + 2];
        });
        bgR /= corners.length;
        bgG /= corners.length;
        bgB /= corners.length;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const diff = Math.sqrt(
            (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2
          );

          if (diff < 70) {
            // Smooth edge alpha feathering
            const alpha = Math.max(0, Math.min(255, (diff - 30) * 6.38));
            data[i + 3] = Math.round(alpha);
          }
        }
        ctx.putImageData(imgData, 0, 0);

        resolve({
          success: true,
          resultImageUrl: canvas.toDataURL('image/png'),
          processingTimeMs: Date.now() - startTime,
        });
        return;
      }

      if (request.mode === 'magic-eraser' && request.mask) {
        const maskImg = new Image();
        maskImg.onload = () => {
          const maskCanvas = document.createElement('canvas');
          maskCanvas.width = w;
          maskCanvas.height = h;
          const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
          if (!maskCtx) {
            resolve({ success: false, error: 'Failed to create mask context.' });
            return;
          }

          maskCtx.drawImage(maskImg, 0, 0, w, h);
          const maskPixels = maskCtx.getImageData(0, 0, w, h).data;
          const imgData = ctx.getImageData(0, 0, w, h);
          const pixels = imgData.data;

          // State map: 1 = KNOWN (unmasked), 0 = UNKNOWN (masked, needs inpainting)
          const known = new Uint8Array(w * h);
          const isOriginallyMasked = new Uint8Array(w * h);
          let remainingMasked = 0;

          for (let i = 0; i < w * h; i++) {
            const mIdx = i * 4;
            // High sensitivity to mask painted pixels
            const opacity = maskPixels[mIdx + 3];
            const isMask = opacity > 15 || maskPixels[mIdx] > 15;
            if (isMask) {
              known[i] = 0;
              isOriginallyMasked[i] = 1;
              remainingMasked++;
            } else {
              known[i] = 1;
              isOriginallyMasked[i] = 0;
            }
          }

          if (remainingMasked === 0) {
            // No mask drawn, return original image
            resolve({
              success: true,
              resultImageUrl: canvas.toDataURL('image/png'),
              processingTimeMs: Date.now() - startTime,
            });
            return;
          }

          // Multi-Pass Concentric Boundary Propagation Inpainting Engine
          const patchRadius = 6;
          let passes = 0;
          const maxPasses = Math.max(w, h);

          while (remainingMasked > 0 && passes < maxPasses) {
            passes++;
            const frontier: number[] = [];

            // Find all frontier pixels (unknown pixels adjacent to at least one known pixel)
            for (let y = 0; y < h; y++) {
              for (let x = 0; x < w; x++) {
                const idx = y * w + x;
                if (known[idx] === 0) {
                  // Check 4-neighbors
                  const hasKnownNeighbor =
                    (x > 0 && known[idx - 1] === 1) ||
                    (x < w - 1 && known[idx + 1] === 1) ||
                    (y > 0 && known[idx - w] === 1) ||
                    (y < h - 1 && known[idx + w] === 1);

                  if (hasKnownNeighbor) {
                    frontier.push(idx);
                  }
                }
              }
            }

            if (frontier.length === 0) break; // No reachable neighbors left

            // Buffer changes for current pass
            const updates: { idx: number; r: number; g: number; b: number }[] = [];

            for (let f = 0; f < frontier.length; f++) {
              const idx = frontier[f];
              const fx = idx % w;
              const fy = Math.floor(idx / w);

              let rSum = 0, gSum = 0, bSum = 0, wSum = 0;

              for (let dy = -patchRadius; dy <= patchRadius; dy++) {
                const ny = fy + dy;
                if (ny < 0 || ny >= h) continue;

                for (let dx = -patchRadius; dx <= patchRadius; dx++) {
                  const nx = fx + dx;
                  if (nx < 0 || nx >= w) continue;

                  const nIdx = ny * w + nx;
                  if (known[nIdx] === 1) {
                    const distSq = dx * dx + dy * dy;
                    if (distSq === 0) continue;
                    const weight = 1 / (Math.sqrt(distSq) + 0.1);
                    const p = nIdx * 4;

                    rSum += pixels[p] * weight;
                    gSum += pixels[p + 1] * weight;
                    bSum += pixels[p + 2] * weight;
                    wSum += weight;
                  }
                }
              }

              if (wSum > 0) {
                updates.push({
                  idx,
                  r: Math.round(rSum / wSum),
                  g: Math.round(gSum / wSum),
                  b: Math.round(bSum / wSum),
                });
              }
            }

            // Apply updates to pixels & known state
            for (let u = 0; u < updates.length; u++) {
              const item = updates[u];
              const p = item.idx * 4;
              pixels[p] = item.r;
              pixels[p + 1] = item.g;
              pixels[p + 2] = item.b;
              pixels[p + 3] = 255;
              known[item.idx] = 1;
              remainingMasked--;
            }

            // Safety check if no updates succeeded
            if (updates.length === 0) break;
          }

          // Light edge-smoothing pass over originally masked region for seamless blending
          const copyPixels = new Uint8ClampedArray(pixels);
          for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
              const idx = y * w + x;
              if (isOriginallyMasked[idx] === 1) {
                let rAcc = 0, gAcc = 0, bAcc = 0, count = 0;
                for (let dy = -1; dy <= 1; dy++) {
                  for (let dx = -1; dx <= 1; dx++) {
                    const p = ((y + dy) * w + (x + dx)) * 4;
                    rAcc += copyPixels[p];
                    gAcc += copyPixels[p + 1];
                    bAcc += copyPixels[p + 2];
                    count++;
                  }
                }
                const targetP = idx * 4;
                pixels[targetP] = Math.round(rAcc / count);
                pixels[targetP + 1] = Math.round(gAcc / count);
                pixels[targetP + 2] = Math.round(bAcc / count);
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);

          resolve({
            success: true,
            resultImageUrl: canvas.toDataURL('image/png'),
            processingTimeMs: Date.now() - startTime,
          });
        };

        maskImg.onerror = () => {
          resolve({ success: false, error: 'Failed to process mask canvas image.' });
        };
        maskImg.src = request.mask;
        return;
      }

      resolve({
        success: true,
        resultImageUrl: canvas.toDataURL('image/png'),
        processingTimeMs: Date.now() - startTime,
      });
    };

    img.onerror = () => {
      resolve({ success: false, error: 'Failed to load source image.' });
    };

    img.src = request.image;
  });
}
