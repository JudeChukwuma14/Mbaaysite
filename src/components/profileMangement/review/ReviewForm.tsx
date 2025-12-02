// src/components/ReviewForm.tsx

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';

interface ProductData {
    id: string;
    name: string;
    image: string;
    orderId: string;
    
}

interface ReviewFormProps {
    product: ProductData;
    onSubmit: (reviewData: { rating: number; comment: string; productId: string; orderId: string; }) => void;
    onBack: () => void;
    isSubmitting: boolean;
}

export function ReviewForm({ product, onSubmit, onBack, isSubmitting }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a star rating.");
            return;
        }
        if (comment.trim().length < 10) {
            toast.error("Please write a review with at least 10 characters.");
            return;
        }
        onSubmit({
            rating,
            comment: comment.trim(),
            productId: product.id, // Use id as productId
            orderId: product.orderId
        });
    };

    // Rating labels
    const ratingLabels = [
        "Very Poor",
        "Poor",
        "Average",
        "Good",
        "Excellent"
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Info */}
            <div className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50">
                <div className="relative">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="object-cover w-16 h-16 rounded-lg"
                            onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/64";
                            }}
                        />
                    ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-500">Product ID: {product.id.slice(-8)}</p>
                </div>
            </div>

            {/* Star Rating Input */}
            <div className="space-y-3">
                <Label className="text-base font-medium text-center">
                    How would you rate this product? <span className="text-red-500">*</span>
                </Label>

                <div className="flex flex-col items-center space-y-2">
                    <div className="flex justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-1 transition-transform hover:scale-110"
                                aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                            >
                                <Star
                                    className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating)
                                            ? 'text-yellow-500 fill-yellow-500'
                                            : 'text-gray-300 fill-gray-100'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                            {rating || 0} / 5
                        </div>
                        {rating > 0 && (
                            <div className="text-sm font-medium text-gray-600 mt-1">
                                {ratingLabels[rating - 1]}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Comment Input */}
            <div className="space-y-3">
                <Label htmlFor="comment" className="text-base font-medium">
                    Share your experience <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    id="comment"
                    placeholder="What did you like or dislike about this product? Your detailed feedback helps other shoppers..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                    className="resize-none"
                    required
                />
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Minimum 10 characters</span>
                    <span>{comment.length} characters</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="flex-1"
                    disabled={isSubmitting}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    disabled={rating === 0 || comment.trim().length < 10 || isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <div className="w-4 h-4 mr-2 border-2 border-white rounded-full animate-spin border-t-transparent" />
                            Submitting...
                        </div>
                    ) : (
                        "Submit Review"
                    )}
                </Button>
            </div>


        </form>
    );
}