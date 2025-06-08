import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import {
  ClipLoader,
  PulseLoader,
  BeatLoader,
  BounceLoader,
  FadeLoader,
  GridLoader,
  HashLoader,
  MoonLoader,
  PuffLoader,
  RingLoader,
  SyncLoader,
} from 'react-spinners';

export type LoaderType =
  | 'clip'
  | 'pulse'
  | 'beat'
  | 'bounce'
  | 'fade'
  | 'grid'
  | 'hash'
  | 'moon'
  | 'puff'
  | 'ring'
  | 'sync';

interface LoaderProps {
  loading: boolean;
  type?: LoaderType;
  size?: number;
  speedMultiplier?: number;
  color?: string;
  fullScreen?: boolean;
  text?: string;
  overlayTargetId?: string;
}

const Loader: React.FC<LoaderProps> = ({
  loading,
  type = 'clip',
  size = 50,
  speedMultiplier = 1,
  fullScreen = false,
  text,
  overlayTargetId = '',
}) => {
  const theme = useTheme();
  const targetElement = document.getElementById(overlayTargetId);

  if (!loading || !targetElement) return null;

  const rect = targetElement.getBoundingClientRect();

  const getLoaderComponent = () => {
    const primaryColor = theme.palette.primary.main;

    switch (type) {
      case 'clip':
        return (
          <ClipLoader
            color={primaryColor}
            size={size}
            speedMultiplier={speedMultiplier}
          />
        );
      case 'pulse':
        return (
          <PulseLoader
            color={primaryColor}
            size={size}
            speedMultiplier={speedMultiplier}
          />
        );
      case 'beat':
        return (
          <BeatLoader
            color={primaryColor}
            size={size}
            speedMultiplier={speedMultiplier}
          />
        );
      case 'bounce':
        return (
          <BounceLoader
            color={primaryColor}
            size={size}
            speedMultiplier={speedMultiplier}
          />
        );
      case 'fade':
        return (
          <FadeLoader
            color={primaryColor}
            height={size}
            width={size / 5}
            speedMultiplier={speedMultiplier}
          />
        );
      case 'grid':
        return (
          <GridLoader
            color={primaryColor}
            size={size}
            speedMultiplier={speedMultiplier}
          />
        );
      case 'hash':
        return (
          <HashLoader
            color={primaryColor}
            size={size}
            speedMultiplier={speedMultiplier}
          />
        );
      case 'moon':
        return (
          <MoonLoader
            color={primaryColor}
            size={size}
            speedMultiplier={speedMultiplier}
          />
        );
      case 'puff':
        return (
          <PuffLoader
            color={primaryColor}
            size={size}
            speedMultiplier={speedMultiplier}
          />
        );
      case 'ring':
        return (
          <RingLoader
            color={primaryColor}
            size={size}
            speedMultiplier={speedMultiplier}
          />
        );
      case 'sync':
        return (
          <SyncLoader
            color={primaryColor}
            size={size}
            speedMultiplier={speedMultiplier}
          />
        );
      default:
        return (
          <ClipLoader
            color={primaryColor}
            size={size}
            speedMultiplier={speedMultiplier}
          />
        );
    }
  };

  const loaderContainerStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.8)'
        : 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999,
  };

  const loaderStyles = {
    position: 'absolute',
    top: rect.top + window.scrollY + 'px',
    left: rect.left + window.scrollX + 'px',
    width: rect.width,
    height: rect.height,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(2px)',
    zIndex: 9999,
    borderRadius: theme.shape.borderRadius,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.8)'
        : 'rgba(255, 255, 255, 0.8)',
  };

  return fullScreen ? (
    <Box sx={loaderContainerStyles}>
      {getLoaderComponent()}
      {text && (
        <Typography component={'p'} color="primary" sx={{ mt: 2 }}>
          {text}
        </Typography>
      )}
    </Box>
  ) : (
    <Box sx={loaderStyles}>
      {getLoaderComponent()}
      {text && (
        <Typography component={'p'} color="primary" sx={{ mt: 2 }}>
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;
