// src/components/ReviewPromptModal.tsx

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// Assuming Order interface and type definitions are available
import { Order } from "@/utils/getOrderApi"; 

import { toast } from "react-toastify";
import { ReviewForm } from './ReviewForm';


// Helper type for a product to be reviewed
interface ProductToReview {
    id: string; // Product ID
    name: string;
    image: string;
    orderId: string; // Needed for the API submission
}

interface ReviewPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
}

// Placeholder for your actual API call
const submitReviewApi = async (reviewData: any) => {
    console.log("Submitting Review to API:", reviewData);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    return { success: true };
}


export function ReviewPromptModal({ isOpen, onClose, order }: ReviewPromptModalProps) {
    // State to hold the product the user is currently reviewing (switches to ReviewForm view)
    const [productToReview, setProductToReview] = useState<ProductToReview | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Prepare the product data structure for the review form (simplified for one product per order)
    const productForForm: ProductToReview = { 
        id: order.product.id,
        name: order.product.name,
        image: order.product.image,
        orderId: order.id
    };

    // Handler to submit the review data to your backend
    const handleReviewSubmit = async (reviewData: { rating: number; comment: string; productId: string; orderId: string; }) => {
        setIsSubmitting(true);
        try {
            await submitReviewApi(reviewData);
            toast.success(`Successfully reviewed "${productForForm.name}"!`);
            // Reset and close the modal
            setProductToReview(null); 
            onClose();
        } catch (error) {
            toast.error("Failed to submit review.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[450px]">
                {productToReview ? (
                    // ⭐️ VIEW 2: Show the Review Form
                    <ReviewForm 
                        product={productToReview} 
                        onSubmit={handleReviewSubmit}
                        onBack={() => setProductToReview(null)}
                        isSubmitting={isSubmitting}
                    />
                ) : (
                    // ⭐️ VIEW 1: Show the Product List Prompt
                    <>
                        <DialogHeader>
                            <DialogTitle>🎉 Order Confirmed! Time to Review</DialogTitle>
                            <DialogDescription>
                                We're glad your order **#{order.orderId}** arrived safely. Please share your thoughts on the product(s) below.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-3">
                            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={productForForm.image} 
                                        alt={productForForm.name} 
                                        className="object-cover w-12 h-12 rounded"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-800">{productForForm.name}</span>
                                        <span className="text-xs text-gray-500">x{order.quantity}</span>
                                    </div>
                                </div>
                                <Button 
                                    onClick={() => setProductToReview(productForForm)}
                                    size="sm"
                                >
                                    Write Review
                                </Button>
                            </div>
                        </div>
                        <Button variant="outline" onClick={onClose} className="w-full">
                            Skip for Now
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}