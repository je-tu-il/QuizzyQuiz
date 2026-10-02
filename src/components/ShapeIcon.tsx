import React from 'react';
import { Shape } from '../types';

interface ShapeIconProps {
  shape: Shape;
  className?: string;
}

export const ShapeIcon: React.FC<ShapeIconProps> = ({ shape, className = 'w-6 h-6' }) => {
  switch (shape) {
    case 'triangle':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <polygon points="12 2, 22 21, 2 21" />
        </svg>
      );
    case 'diamond':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <polygon points="12 2, 22 12, 12 22, 2 12" />
        </svg>
      );
    case 'circle':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
    case 'square':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      );
    default:
      return null;
  }
};

export const SHAPE_CONFIG: Record<
  Shape,
  {
    bg: string;
    bgHover: string;
    border: string;
    name: string;
  }
> = {
  triangle: {
    bg: 'bg-[#e21b3c]',
    bgHover: 'hover:bg-[#b81530]',
    border: 'border-b-4 border-[#9c1228]',
    name: 'Triangle',
  },
  diamond: {
    bg: 'bg-[#1368ce]',
    bgHover: 'hover:bg-[#0f54a8]',
    border: 'border-b-4 border-[#0c4285]',
    name: 'Losange',
  },
  circle: {
    bg: 'bg-[#d89e00]',
    bgHover: 'hover:bg-[#b08100]',
    border: 'border-b-4 border-[#8c6700]',
    name: 'Rond',
  },
  square: {
    bg: 'bg-[#26890c]',
    bgHover: 'hover:bg-[#1e6d09]',
    border: 'border-b-4 border-[#175407]',
    name: 'Carré',
  },
};
