import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShimmerLoader from './ShimmerLoader';

describe('ShimmerLoader', () => {
  // Test default behavior
  describe('default rendering', () => {
    it('should render CircularProgress by default', () => {
      render(<ShimmerLoader />);
      const circularLoader = document.querySelector(
        '.MuiCircularProgress-root'
      );
      expect(circularLoader).toBeInTheDocument();
    });

    it('should have proper aria role by default', () => {
      render(<ShimmerLoader />);
      const circularLoader = document.querySelector(
        '.MuiCircularProgress-root'
      );
      expect(circularLoader).toHaveAttribute('role', 'progressbar');
    });
  });

  // Test different loader types
  describe('loader types', () => {
    it('should render CircularProgress when type is circular', () => {
      render(<ShimmerLoader type="circular" />);
      const circularLoader = document.querySelector(
        '.MuiCircularProgress-root'
      );
      expect(circularLoader).toBeInTheDocument();
    });

    it('should render LinearProgress when type is linear', () => {
      render(<ShimmerLoader type="linear" />);
      const linearLoader = document.querySelector('.MuiLinearProgress-root');
      expect(linearLoader).toBeInTheDocument();
    });

    it('should render Skeleton when type is skeleton', () => {
      render(<ShimmerLoader type="skeleton" />);
      const skeletonLoader = document.querySelector('.MuiSkeleton-root');
      expect(skeletonLoader).toBeInTheDocument();
    });

    it('should handle type changes dynamically', () => {
      const { rerender } = render(<ShimmerLoader type="circular" />);
      expect(
        document.querySelector('.MuiCircularProgress-root')
      ).toBeInTheDocument();

      rerender(<ShimmerLoader type="linear" />);
      expect(
        document.querySelector('.MuiLinearProgress-root')
      ).toBeInTheDocument();
    });
  });

  // Test customization for CircularProgress
  describe('CircularProgress customization', () => {
    it('should apply custom size to CircularProgress', () => {
      const customSize = 60;
      render(<ShimmerLoader type="circular" size={customSize} />);
      const circularLoader = document.querySelector(
        '.MuiCircularProgress-root'
      );
      expect(circularLoader).toHaveStyle(`width: ${customSize}px`);
      expect(circularLoader).toHaveStyle(`height: ${customSize}px`);
    });

    it('should apply custom color to CircularProgress', () => {
      render(<ShimmerLoader type="circular" color="secondary" />);
      const circularLoader = document.querySelector(
        '.MuiCircularProgress-colorSecondary'
      );
      expect(circularLoader).toBeInTheDocument();
    });

    it('should handle extreme size values', () => {
      render(<ShimmerLoader type="circular" size={1000} />);
      const circularLoader = document.querySelector(
        '.MuiCircularProgress-root'
      );
      expect(circularLoader).toHaveStyle('width: 1000px');
    });
  });

  // Test customization for LinearProgress
  describe('LinearProgress customization', () => {
    it('should apply custom color to LinearProgress', () => {
      render(<ShimmerLoader type="linear" color="secondary" />);
      const linearLoader = document.querySelector(
        '.MuiLinearProgress-colorSecondary'
      );
      expect(linearLoader).toBeInTheDocument();
    });

    it('should handle animation properly', () => {
      jest.useFakeTimers();
      render(<ShimmerLoader type="linear" />);
      const linearLoader = document.querySelector('.MuiLinearProgress-root');

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(linearLoader).toBeInTheDocument();
      jest.useRealTimers();
    });
  });

  // Test customization for Skeleton
  describe('Skeleton customization', () => {
    it('should apply text variant to Skeleton', () => {
      render(<ShimmerLoader type="skeleton" variant="text" />);
      const skeletonLoader = document.querySelector('.MuiSkeleton-text');
      expect(skeletonLoader).toBeInTheDocument();
    });

    it('should apply rectangular variant to Skeleton', () => {
      render(<ShimmerLoader type="skeleton" variant="rectangular" />);
      const skeletonLoader = document.querySelector('.MuiSkeleton-rectangular');
      expect(skeletonLoader).toBeInTheDocument();
    });

    it('should apply circular variant to Skeleton', () => {
      render(<ShimmerLoader type="skeleton" variant="circular" />);
      const skeletonLoader = document.querySelector('.MuiSkeleton-circular');
      expect(skeletonLoader).toBeInTheDocument();
    });

    it('should apply custom width to Skeleton', () => {
      const customWidth = '75%';
      render(<ShimmerLoader type="skeleton" width={customWidth} />);
      const skeletonLoader = document.querySelector('.MuiSkeleton-root');
      expect(skeletonLoader).toHaveStyle(`width: ${customWidth}`);
    });

    it('should apply custom height to Skeleton', () => {
      const customHeight = 40;
      render(<ShimmerLoader type="skeleton" height={customHeight} />);
      const skeletonLoader = document.querySelector('.MuiSkeleton-root');
      expect(skeletonLoader).toHaveStyle(`height: ${customHeight}px`);
    });

    it('should handle multiple skeleton instances', () => {
      const { container } = render(
        <>
          <ShimmerLoader type="skeleton" variant="text" />
          <ShimmerLoader type="skeleton" variant="rectangular" />
        </>
      );
      expect(container.querySelectorAll('.MuiSkeleton-root')).toHaveLength(2);
    });
  });

  // Test error handling and edge cases
  describe('error handling and edge cases', () => {
    it('should return null for invalid type', () => {
      // @ts-expect-error Testing invalid type
      const { container } = render(<ShimmerLoader type="invalid" />);
      expect(container.firstChild).toBeNull();
    });

    it('should handle undefined props gracefully', () => {
      const { container } = render(
        <ShimmerLoader type="circular" size={undefined} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle component unmounting', () => {
      const { unmount } = render(<ShimmerLoader />);
      unmount();
      expect(
        document.querySelector('.MuiCircularProgress-root')
      ).not.toBeInTheDocument();
    });
  });

  // Test performance
  describe('performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<ShimmerLoader type="circular" />);
      const initialNode = document.querySelector('.MuiCircularProgress-root');

      rerender(<ShimmerLoader type="circular" />);
      const rerenderedNode = document.querySelector(
        '.MuiCircularProgress-root'
      );

      expect(initialNode).toBe(rerenderedNode);
    });
  });

  // Test accessibility
  describe('accessibility', () => {
    it('should have appropriate ARIA attributes for circular loader', () => {
      render(<ShimmerLoader type="circular" />);
      const loader = document.querySelector('.MuiCircularProgress-root');
      expect(loader).toHaveAttribute('role', 'progressbar');
    });

    it('should have appropriate ARIA attributes for linear loader', () => {
      render(<ShimmerLoader type="linear" />);
      const loader = document.querySelector('.MuiLinearProgress-root');
      expect(loader).toHaveAttribute('role', 'progressbar');
    });
  });
});
