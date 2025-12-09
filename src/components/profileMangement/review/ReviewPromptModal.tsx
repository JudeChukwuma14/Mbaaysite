// src/components/ReviewPromptModal.tsx

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Package, CheckCircle, ThumbsUp, ChevronLeft, Sparkles, X, Camera, AlertCircle } from "lucide-react";
import { Order } from "@/utils/getOrderApi";
import { toast } from "react-toastify";
import { ReviewForm } from './ReviewForm';
import { submitReviewApi } from '@/utils/reviewApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

// Helper type for a product to be reviewed
interface ProductToReview {
  id: string;
  name: string;
  image: string;
  orderId: string;
  productId: string;
  price: number;
  quantity: number;
}

interface ReviewPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export function ReviewPromptModal({ isOpen, onClose, order }: ReviewPromptModalProps) {
  const [productToReview, setProductToReview] = useState<ProductToReview | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState<string[]>([]);
  const [skipForNow, setSkipForNow] = useState(false);
  
  const user = useSelector((state: RootState) => state.user);
  const vendor = useSelector((state: RootState) => state.vendor);
  const role = user.token ? "user" : vendor.token ? "vendor" : null;
  const token = role === "user" ? user.token : role === "vendor" ? vendor.token : null;

  // Calculate review progress
  const reviewProgress = order.items.length > 0 
    ? Math.round((reviewedProducts.length / order.items.length) * 100) 
    : 0;

  // Reset state when modal closes

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setProductToReview(null);
        setReviewedProducts([]);
        setSkipForNow(false);
      }, 300);
    }
  }, [isOpen]);

  // Handler to submit the review data
const handleReviewSubmit = async (reviewData: { 
  rating: number; 
  title: string;
  comment: string; 
  productId: string; 
  orderId: string;
  images?: File[];
}) => {
  if (!productToReview || !token) {
    toast.error("Unable to submit review. Please try again.");
    return;
  }

  setIsSubmitting(true);
  try {
    let imageUrls: string[] = [];
    
    // Convert images to base64 if provided
    if (reviewData.images && reviewData.images.length > 0) {
      console.log('Converting images to base64...');
      
      const base64Promises = reviewData.images.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });
      
      imageUrls = await Promise.all(base64Promises);
      console.log('Converted images to base64:', imageUrls.length);
    }

    // Prepare review data for API
    const apiData = {
      productId: reviewData.productId,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      images: imageUrls,
    };

    console.log('Submitting review data:', {
      ...apiData,
      imagesCount: apiData.images.length,
      userId: user.user?._id // Add user ID to logs
    });

    // Get user ID from Redux state
    const userId = user.user?._id;
    
    if (!userId) {
      throw new Error("User ID not found. Please log in again.");
    }

    // Call the review API with user ID
    const result = await submitReviewApi(apiData, token, userId);

    if (result.success) {
      // Mark this product as reviewed
      setReviewedProducts(prev => [...prev, productToReview.productId]);
      
      // Success message based on whether images were included
      const hasImages = reviewData.images && reviewData.images.length > 0;
      const successMessage = hasImages
        ? `Thanks for reviewing "${productToReview.name}" with photos!`
        : `Thanks for reviewing "${productToReview.name}"!`;
      
      toast.success(
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>, 
        { 
          autoClose: 3000,
          icon: <CheckCircle className="text-green-500" />
        }
      );

      // Check if all products have been reviewed
      const totalReviewed = reviewedProducts.length + 1;
      if (totalReviewed >= order.items.length) {
        setTimeout(() => {
          toast.success(
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>You've reviewed all products! Thank you for your feedback.</span>
            </div>,
            { 
              autoClose: 3500,
              icon: <Sparkles className="text-yellow-500" />
            }
          );
          onClose();
        }, 1500);
      }
      
      // Go back to product list
      setProductToReview(null);
    } else {
      throw new Error(result.message || "Failed to submit review");
    }
  } catch (error: any) {
    console.error("Review submission error:", error);
    toast.error(
      <div className="flex items-start gap-2">
        <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Failed to submit review</p>
          <p className="text-sm opacity-90">{error.message || "Please try again"}</p>
        </div>
      </div>,
      { autoClose: 5000 }
    );
  } finally {
    setIsSubmitting(false);
  }
};
  // Skip review for now
  const handleSkip = () => {
    setSkipForNow(true);
    
    if (reviewedProducts.length > 0) {
      toast.info(
        `You've reviewed ${reviewedProducts.length} of ${order.items.length} products.`,
        { autoClose: 3000 }
      );
    } else {
      toast.info(
        "You can always review products later from your order history.",
        { autoClose: 3000 }
      );
    }
    
    setTimeout(() => {
      onClose();
    }, 500);
  };

  // Get current date for display
  const deliveryDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Format price with Nigerian Naira
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !skipForNow) {
        handleSkip();
      }
    }}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto p-0">
        {productToReview ? (
          // ⭐️ VIEW 2: Review Form
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setProductToReview(null)}
                  className="gap-2 text-gray-600 hover:text-gray-900 -ml-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Products
                </Button>
              </div>
              <Badge variant="outline" className="px-3 py-1">
                Step 2 of 2
              </Badge>
            </div>
            
            <ReviewForm
              product={productToReview}
              onSubmit={handleReviewSubmit}
              onBack={() => setProductToReview(null)}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : (
          // ⭐️ VIEW 1: Product List Prompt
          <>
            <div className="p-6 pb-0">
              <DialogHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <DialogTitle className="text-2xl">Your Order Has Arrived! 🎉</DialogTitle>
                  </div>
                  <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-700 border-green-200">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                
                <DialogDescription className="text-base text-gray-700 space-y-2">
                  <p className="font-medium">
                    We hope you're enjoying your new purchase!
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>Delivered on {deliveryDate}</span>
                  </div>
                  <p className="text-sm text-gray-600 pt-2">
                    Share your experience to help other shoppers and earn community points!
                  </p>
                </DialogDescription>

                {/* Review Progress */}
                {reviewedProducts.length > 0 && (
                  <div className="pt-2 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-700">
                        Your Review Progress
                      </div>
                      <div className="text-sm font-semibold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        {reviewedProducts.length}/{order.items.length} Completed
                      </div>
                    </div>
                    <Progress value={reviewProgress} className="h-2.5" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Start</span>
                      <span>
                        {reviewedProducts.length === order.items.length 
                          ? "All done! 🎊" 
                          : `${order.items.length - reviewedProducts.length} remaining`}
                      </span>
                      <span>Finish</span>
                    </div>
                  </div>
                )}
              </DialogHeader>
            </div>

            {/* Order Summary Card */}
            <div className="px-6">
              <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Order #{order.orderId.slice(-8)}</p>
                      <p className="text-xs text-gray-500">
                        Total: <span className="font-semibold">{formatPrice(order.totalPrice)}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Camera className="w-4 h-4" />
                        <span>Photos encouraged!</span>
                      </div>
                      <p className="text-xs text-gray-500">Add images to your reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products List */}
            <div className="p-6 pt-4 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Package className="w-4 h-4" />
                <span>Products to Review</span>
                {reviewedProducts.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {order.items.length - reviewedProducts.length} remaining
                  </Badge>
                )}
              </div>

              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
                {order.items.map((item) => {
                  const isReviewed = reviewedProducts.includes(item.productId || item.id);
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`flex items-center justify-between p-4 border rounded-xl transition-all duration-200 ${
                        isReviewed 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                          : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover w-16 h-16 rounded-lg border shadow-sm"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/64";
                            }}
                          />
                          {isReviewed && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-md">
                              <CheckCircle className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 truncate text-sm">
                              {item.name}
                            </h4>
                            {isReviewed && (
                              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                Reviewed
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                            <span className="font-medium">Qty: {item.quantity}</span>
                            <span className="text-gray-400">•</span>
                            <span className="font-semibold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            {!isReviewed && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="flex items-center gap-1 text-amber-600 font-medium">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span>Click to review</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => setProductToReview({
                          id: item.id,
                          name: item.name,
                          image: item.image,
                          orderId: order.id,
                          productId: item.productId || item.id,
                          price: item.price,
                          quantity: item.quantity
                        })}
                        size="sm"
                        disabled={isReviewed}
                        variant={isReviewed ? "outline" : "default"}
                        className={`whitespace-nowrap font-medium transition-all ${
                          isReviewed 
                            ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100' 
                            : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-sm'
                        }`}
                      >
                        {isReviewed ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Done
                          </>
                        ) : (
                          <>
                            <Star className="w-4 h-4 mr-2" />
                            Review
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="px-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-800">Why Your Review Matters</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                        <span>Helps other customers make informed decisions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt=1.5 flex-shrink-0" />
                        <span>Provides valuable feedback to our vendors</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt=1.5 flex-shrink-0" />
                        <span>Earn loyalty points for detailed reviews</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-6 pt-4 border-t">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="text-center sm:text-left text-sm text-gray-600 flex-1">
                  <p>
                    <span className="font-medium text-gray-800">Your privacy:</span> Reviews are anonymous to vendors
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    className="px-6"
                  >
                    {reviewedProducts.length > 0 ? 'Continue Later' : 'Skip All'}
                  </Button>
                  {reviewedProducts.length > 0 && (
                    <Button
                      variant="default"
                      onClick={onClose}
                      className="px-6 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black"
                    >
                      Done Reviewing
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}