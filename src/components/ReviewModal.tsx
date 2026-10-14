import React, { useState } from 'react';
import { Booking } from '../types';
import { useApp } from '../context/AppContext';
import { Star, X } from 'lucide-react';

interface ReviewModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ booking, onClose }) => {
  const { submitReview } = useApp();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError('Please provide a short description of your experience.');
      return;
    }
    submitReview(booking.id, rating, feedback.trim());
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-xl">
              ✓
            </div>
            <h3 className="text-lg font-bold text-slate-900">Thank you for your feedback!</h3>
            <p className="text-xs text-slate-500">
              Your rating helps maintain high service standards in the apartment community.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-xs font-mono text-slate-500">Ref: {booking.bookingReference}</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">Rate Your Service</h3>
              <p className="text-xs text-slate-600 mt-1">
                How was your experience with <strong>{booking.serviceName}</strong>
                {booking.providerName ? ` by ${booking.providerName}` : ''}?
              </p>
            </div>

            {/* Star selector */}
            <div className="flex flex-col items-center justify-center py-2 space-y-1">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200 fill-slate-50'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-medium text-slate-600">
                {rating === 5 && 'Outstanding service'}
                {rating === 4 && 'Very good experience'}
                {rating === 3 && 'Average service'}
                {rating === 2 && 'Below expectations'}
                {rating === 1 && 'Poor experience'}
              </span>
            </div>

            {/* Feedback text */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Resident Feedback
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => {
                  setFeedback(e.target.value);
                  setError('');
                }}
                placeholder="Share specific details about punctuality, quality, and professionalism..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none"
              />
              {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
