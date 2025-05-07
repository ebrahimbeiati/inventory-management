"use client";

import { Star, StarHalf } from 'lucide-react';

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const Rating = ({ 
  rating, 
  maxRating = 5, 
  size = 'md', 
  color = 'text-yellow-400',
  className = '' 
}: RatingProps) => {
  // Ensure rating is between 0 and maxRating
  const validRating = Math.max(0, Math.min(rating, maxRating));
  
  // Calculate number of full and half stars
  const fullStars = Math.floor(validRating);
  const hasHalfStar = validRating % 1 >= 0.5;
  
  // Determine star size based on the prop
  const starSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size];
  
  return (
    <div className={`flex items-center ${className}`}>
      {/* Render full stars */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star 
          key={`full-${index}`} 
          className={`${starSize} ${color} fill-current`} 
        />
      ))}
      
      {/* Render half star if needed */}
      {hasHalfStar && (
        <StarHalf 
          className={`${starSize} ${color}`} 
        />
      )}
      
      {/* Render empty stars */}
      {Array.from({ length: maxRating - fullStars - (hasHalfStar ? 1 : 0) }).map((_, index) => (
        <Star 
          key={`empty-${index}`} 
          className={`${starSize} text-gray-300 dark:text-gray-600`} 
        />
      ))}
    </div>
  );
};

export default Rating; 