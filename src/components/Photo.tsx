import { useEffect, useRef, useState } from "react";
import type { Photo as PhotoData } from "../data/images";

type Props = {
  photo: PhotoData;
  width?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

// Image with a branded fallback, so a missing or blocked photo never leaves a broken box.
export default function Photo({
  photo,
  width = 1200,
  className = "",
  priority = false,
  sizes = "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
}: Props) {
  const [failed, setFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    // A prerendered image can fail before hydration attaches React's onError.
    const image = imageRef.current;
    if (image?.complete && image.currentSrc && image.naturalWidth === 0)
      setFailed(true);
  }, []);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`Image unavailable: ${photo.alt}`}
        className={`bg-gradient-to-br from-teal-600 via-ink-700 to-ink ${className}`}
        style={{
          backgroundImage:
            "radial-gradient(circle at 75% 30%, rgba(247,147,30,.55), transparent 38%), linear-gradient(135deg, #0E6F73, #071E24)",
        }}
      />
    );
  }

  return (
    <img
      ref={imageRef}
      src={photo.src(width)}
      srcSet={
        photo.src(480) === photo.src(1600)
          ? undefined
          : `${photo.src(480)} 480w, ${photo.src(960)} 960w, ${photo.src(1600)} 1600w`
      }
      sizes={sizes}
      {...{ fetchpriority: priority ? "high" : "auto" }}
      alt={photo.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      style={{ objectPosition: photo.position, objectFit: photo.contain ? "contain" : undefined }}
      className={`object-cover ${className}`}
    />
  );
}
