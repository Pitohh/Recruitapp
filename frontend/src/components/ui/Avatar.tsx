import React from 'react';
import { cn } from '../../utils/cn';
import { User } from 'lucide-react';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  fallback?: React.ReactNode;
}

export const Avatar = ({
  className,
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  ...props
}: AvatarProps) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const fallbackIconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className={cn('relative rounded-full overflow-hidden bg-gray-200', sizeClasses[size], className)}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
      ) : fallback ? (
        fallback
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
          <User className={fallbackIconSizes[size]} />
        </div>
      )}
    </div>
  );
};