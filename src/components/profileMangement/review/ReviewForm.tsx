// src/components/ReviewForm.tsx

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, ArrowLeft } from 'lucide-react';

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
            alert("Please select a star rating.");
            return;
        }
        onSubmit({ 
            rating, 
            comment, 
            productId: product.id, 
            orderId: product.orderId 
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 mb-6">
                <Button type="button" variant="ghost" size="icon" onClick={onBack} className="-ml-3">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold">Review: {product.name}</h2>
            </div>
            
            {/* Star Rating Input */}
            <div className="flex justify-center my-4 space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-10 h-10 cursor-pointer transition-colors ${
                            star <= (hoverRating || rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                        }`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                    />
                ))}
            </div>
            <div className='text-center mb-4 text-sm text-gray-600'>
                Your Rating: <span className='font-bold text-gray-800'>{rating || "0"} / 5</span>
            </div>
            
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="comment">Tell us about your experience</Label>
                    <Textarea
                        id="comment"
                        placeholder="Share your detailed feedback about the product..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                    />
                </div>
            </div>
            
            <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={rating === 0 || isSubmitting}
            >
                {isSubmitting ? (
                    <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 border-2 rounded-full border-t-white animate-spin" />
                        Submitting...
                    </div>
                ) : (
                    "Submit Review"
                )}
            </Button>
        </form>
    );
}