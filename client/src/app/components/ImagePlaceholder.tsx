"use client";

import { Image as ImageIcon } from "lucide-react";

type ImagePlaceholderProps = {
  size?: "sm" | "md" | "lg";
};

const ImagePlaceholder = ({ size = "md" }: ImagePlaceholderProps) => {
  const sizes = {
    sm: {
      container: "h-10 w-10",
      icon: "h-4 w-4",
    },
    md: {
      container: "h-16 w-16",
      icon: "h-6 w-6",
    },
    lg: {
      container: "h-24 w-24",
      icon: "h-8 w-8",
    },
  };

  return (
    <div className={`${sizes[size].container} flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md`}>
      <ImageIcon className={`${sizes[size].icon} text-gray-400 dark:text-gray-500`} />
    </div>
  );
};

export default ImagePlaceholder; 