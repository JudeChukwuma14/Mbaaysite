// src/components/ReviewForm.tsx

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, ArrowLeft, Image as ImageIcon, X, Upload, Camera } from 'lucide-react';
import { toast } from 'react-toastify';

interface ProductData {
    id: string; // For display purposes
    name: string;
    image: string;
    orderId: string;
    productId: string; // For API submission
}

interface ReviewFormProps {
    product: ProductData;
    onSubmit: (reviewData: { 
        rating: number; 
        title: string;
        comment: string; 
        productId: string; 
        orderId: string;
        images?: File[]; // Changed back to optional
    }) => void;
    onBack: () => void;
    isSubmitting: boolean;
}

export function ReviewForm({ product, onSubmit, onBack, isSubmitting }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isTouched, setIsTouched] = useState({
        rating: false,
        title: false,
        comment: false
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Rating labels
    const ratingLabels = [
        "Very Poor",
        "Poor",
        "Average",
        "Good",
        "Excellent"
    ];

    // Validation
    const isValidRating = rating > 0;
    const isValidTitle = title.trim().length >= 3;
    const isValidComment = comment.trim().length >= 10;
    const isFormValid = isValidRating && isValidTitle && isValidComment;

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: File[] = [];
        const newPreviews: string[] = [];

        // Limit to 5 images
        const remainingSlots = 5 - images.length;
        const filesToProcess = Array.from(files).slice(0, remainingSlots);

        filesToProcess.forEach(file => {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error(`Image ${file.name} is too large. Max size is 5MB.`);
                return;
            }

            if (!file.type.startsWith('image/')) {
                toast.error(`File ${file.name} is not an image.`);
                return;
            }

            newImages.push(file);
            const preview = URL.createObjectURL(file);
            newPreviews.push(preview);
        });

        if (newImages.length > 0) {
            setImages(prev => [...prev, ...newImages]);
            setImagePreviews(prev => [...prev, ...newPreviews]);
            toast.success(`Added ${newImages.length} image${newImages.length > 1 ? 's' : ''}`);
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        // Revoke object URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviews[index]);
        
        const newImages = [...images];
        const newPreviews = [...imagePreviews];
        
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Mark all fields as touched
        setIsTouched({
            rating: true,
            title: true,
            comment: true
        });

        if (!isFormValid) {
            return;
        }
        
        onSubmit({
            rating,
            title: title.trim(),
            comment: comment.trim(),
            productId: product.productId,
            orderId: product.orderId,
            images: images.length > 0 ? images : undefined
        });
    };

    // Cleanup image URLs on unmount
    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Info */}
            <div className="flex items-center gap-4 p-4 border rounded-xl bg-gradient-to-r from-orange-50 to-amber-50">
                <div className="relative">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="object-cover w-20 h-20 rounded-xl border-2 border-white shadow-sm"
                            onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/80";
                            }}
                        />
                    ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-200 rounded-xl border-2 border-white shadow-sm flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-orange-600" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Share your experience with this product</p>
                </div>
            </div>

            {/* Star Rating Input */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                        How would you rate this product? <span className="text-red-500">*</span>
                    </Label>
                    {isTouched.rating && !isValidRating && (
                        <span className="text-sm text-red-500">Required</span>
                    )}
                </div>

                <div className="flex flex-col items-center space-y-3">
                    <div className="flex justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => {
                                    setRating(star);
                                    setIsTouched(prev => ({ ...prev, rating: true }));
                                }}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-1 transition-all hover:scale-110 active:scale-95"
                                aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                            >
                                <Star
                                    className={`w-14 h-14 transition-all duration-200 ${star <= (hoverRating || rating)
                                        ? 'text-yellow-500 fill-yellow-500 drop-shadow-lg'
                                        : 'text-gray-300 fill-gray-100'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">
                            {rating || 0} / 5
                        </div>
                        {rating > 0 && (
                            <div className="text-base font-medium text-gray-700 mt-1 bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-1 rounded-full">
                                {ratingLabels[rating - 1]}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Title Input */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label htmlFor="title" className="text-base font-semibold">
                        Review Title <span className="text-red-500">*</span>
                    </Label>
                    {isTouched.title && !isValidTitle && (
                        <span className="text-sm text-red-500">Minimum 3 characters</span>
                    )}
                </div>
                <Input
                    id="title"
                    placeholder="Summarize your experience in a few words..."
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setIsTouched(prev => ({ ...prev, title: true }));
                    }}
                    maxLength={100}
                    required
                    className={`text-base ${isTouched.title && !isValidTitle ? 'border-red-300 focus:ring-red-200' : ''}`}
                />
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Give your review a clear title</span>
                    <span>{title.length}/100</span>
                </div>
            </div>

            {/* Comment Input */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label htmlFor="comment" className="text-base font-semibold">
                        Detailed Review <span className="text-red-500">*</span>
                    </Label>
                    {isTouched.comment && !isValidComment && (
                        <span className="text-sm text-red-500">Minimum 10 characters</span>
                    )}
                </div>
                <Textarea
                    id="comment"
                    placeholder="Share your experience in detail... What did you like or dislike? How does it compare to your expectations? Include details about quality, appearance, and functionality."
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value);
                        setIsTouched(prev => ({ ...prev, comment: true }));
                    }}
                    rows={6}
                    className={`resize-none text-base ${isTouched.comment && !isValidComment ? 'border-red-300 focus:ring-red-200' : ''}`}
                    required
                />
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Be detailed and honest for other shoppers</span>
                    <span>{comment.length}/500</span>
                </div>
            </div>

            {/* Image Upload - NOW OPTIONAL */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                        Product Photos (Optional)
                    </Label>
                    <span className="text-sm text-gray-500">
                        {images.length}/5
                    </span>
                </div>
                
                <div className="space-y-4">
                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 
                                                 opacity-100 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-red-600"
                                        aria-label="Remove image"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                    {index === 0 && images.length > 1 && (
                                        <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                            Main
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload Button */}
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                                  ${images.length >= 5 
                                    ? 'opacity-60 cursor-not-allowed bg-gray-100' 
                                    : 'border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100 hover:shadow-sm'
                                  }`}
                    >
                        <Upload className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                        <p className="font-medium text-gray-700">
                            {images.length >= 5 
                                ? 'Maximum 5 images reached'
                                : images.length === 0
                                    ? 'Add photos to your review (optional)'
                                    : `Add more photos (${images.length}/5)`
                            }
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Photos help other shoppers see the product in real life
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG, WebP up to 5MB each
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelect}
                            className="hidden"
                            disabled={images.length >= 5}
                        />
                    </div>

                    {/* Image Tips */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                            <Camera className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-blue-800 mb-1">Photo Tips (Optional)</p>
                                <ul className="space-y-1 text-sm text-blue-700">
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                        <span>Show product from different angles</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                        <span>Include close-ups of details or materials</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                        <span>Show product in use or in context</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                        <span>Well-lit photos work best</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Tips */}
            {/* <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                        <AlertCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-green-800 text-lg mb-2">Writing a Great Review</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-700">
                            <div className="space-y-1">
                                <p className="font-semibold">✅ Include:</p>
                                <ul className="space-y-1">
                                    <li>• Product quality and materials</li>
                                    <li>• Size/fit accuracy</li>
                                    <li>• Color comparison to photos</li>
                                    <li>• Packaging condition</li>
                                </ul>
                            </div>
                            <div className="space-y-1">
                                <p className="font-semibold">✅ Helpful extras:</p>
                                <ul className="space-y-1">
                                    <li>• Photos showing product details</li>
                                    <li>• How you're using the product</li>
                                    <li>• Comparison to expectations</li>
                                    <li>• Recommendations for others</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="flex-1 text-base h-12"
                    disabled={isSubmitting}
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to List
                </Button>
                <Button
                    type="submit"
                    className={`flex-1 text-base h-12 font-semibold transition-all ${
                        isFormValid 
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl' 
                            : 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-80'
                    }`}
                    disabled={!isFormValid || isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 mr-3 border-2 border-white rounded-full animate-spin border-t-transparent" />
                            Submitting Review...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <Star className="w-5 h-5 mr-2" />
                            Submit Review
                        </div>
                    )}
                </Button>
            </div>

            {/* Required Fields Note */}
            <div className="text-center text-sm text-gray-500 pt-2">
                <p>Fields marked with <span className="text-red-500">*</span> are required</p>
                <p className="text-xs mt-1">Photos are optional but highly encouraged</p>
            </div>
        </form>
    );
}