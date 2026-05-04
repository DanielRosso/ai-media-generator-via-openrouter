export const IMAGE_MODELS = {
  FLUX_2_PRO: "black-forest-labs/flux.2-pro",
  GPT_5_4_IMAGE_2: "openai/gpt-5.4-image-2"
} as const;

export type ImageModel = (typeof IMAGE_MODELS)[keyof typeof IMAGE_MODELS];

export const VIDEO_MODELS = {
  SEEDANCE_2_0: "bytedance/seedance-2.0",
  KLING_V3_0_PRO: "kwaivgi/kling-v3.0-pro",
} as const;

export type VideoModel = (typeof VIDEO_MODELS)[keyof typeof VIDEO_MODELS];

export const DEFAULT_IMAGE_MODEL: ImageModel = IMAGE_MODELS.FLUX_2_PRO;
export const DEFAULT_VIDEO_MODEL: VideoModel = VIDEO_MODELS.SEEDANCE_2_0;
