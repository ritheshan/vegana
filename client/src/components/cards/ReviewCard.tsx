'use client';

import * as React from 'react';
import { Review } from '../../types';
import { Star } from 'lucide-react';

export interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-colors flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={review.authorAvatar}
            alt={review.authorName}
            className="w-10 h-10 rounded-full object-cover border border-slate-100"
          />
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">
              {review.authorName}
            </h4>
            <span className="text-xs text-slate-400 font-medium">
              Reviewed on {review.date}
            </span>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-0.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-amber-800">
            {review.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-slate-600 leading-relaxed font-normal">
        "{review.comment}"
      </p>
    </div>
  );
};
