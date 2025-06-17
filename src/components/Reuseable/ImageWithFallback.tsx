import React from "react";

interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = "/placeholder.jpg",
  onError,
  ...props
}) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackSrc;
    if (onError) onError(e);
  };

  return <img src={src} alt={alt} onError={handleError} {...props} />;
};

export default ImageWithFallback;