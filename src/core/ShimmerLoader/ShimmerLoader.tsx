import React from 'react';

import Skeleton from '@mui/material/Skeleton';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

// Define Loader types
type LoaderType = 'circular' | 'linear' | 'skeleton';

// Define Skeleton variants
type SkeletonVariant = 'text' | 'rectangular' | 'circular';

// Loader Props
interface LoaderProps {
  type?: LoaderType; // Type of loader (default: circular)
  size?: number; // Size (for CircularProgress)
  color?: 'primary' | 'secondary' | 'inherit'; // MUI color options
  variant?: SkeletonVariant; // Variant for Skeleton
  width?: number | string; // Width for Skeleton
  height?: number | string; // Height for Skeleton
}

const ShimmerLoader: React.FC<LoaderProps> = ({
  type = 'circular',
  size = 40,
  color = 'primary',
  variant = 'text',
  width = '100%',
  height = 20,
}) => {
  if (type === 'circular') {
    return <CircularProgress size={size} color={color} />;
  }

  if (type === 'linear') {
    return <LinearProgress color={color} />;
  }

  if (type === 'skeleton') {
    return <Skeleton variant={variant} width={width} height={height} />;
  }

  return null;
};

export default ShimmerLoader;
