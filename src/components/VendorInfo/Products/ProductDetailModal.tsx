import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  X,
  Edit,
  Trash2,
  Play,
  Save,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getVendorProductById,
  updateVendorProduct,
  deleteVendorProduct,
} from "@/utils/VendorProductApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  category: string;
  sub_category: string;
  sub_category2: string;
  createdAt: string;
  images: string[];
  product_video?: string;
}

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, children }) => (
  <div
    className={`${
      open
        ? "fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        : "hidden"
    }`}
    role="dialog"
    aria-modal="true"
  >
    <div className="w-full max-w-[95%] sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
      {children}
    </div>
  </div>
);

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

const DialogContent: React.FC<DialogContentProps> = ({
  className,
  children,
}) => (
  <div
    className={`bg-white rounded-lg shadow-xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${
      className || ""
    }`}
  >
    {children}
  </div>
);

interface DialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

const DialogTitle: React.FC<DialogTitleProps> = ({ className, children }) => (
  <h2 className={`text-lg sm:text-xl font-semibold ${className || ""}`}>
    {children}
  </h2>
);

interface BadgeProps {
  className?: string;
  variant?: "default" | "secondary" | "outline";
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  children,
}) => {
  const variants: { [key: string]: string } = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium ${
        variants[variant] || variants.default
      } ${className || ""}`}
    >
      {children}
    </span>
  );
};

const Separator: React.FC = () => (
  <hr className="my-3 sm:my-4 border-gray-200" />
);

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  productId: any;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  productId,
}) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isVideoSelected, setIsVideoSelected] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});
  const [newImages, setNewImages] = useState<(File | null)[]>([]);
  const [newVideo, setNewVideo] = useState<File | null>(null);

  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);

  // LocalStorage keys
  const getLocalStorageImageKey = (id: string, index: number) =>
    `product_image_${id}_${index}`;
  const getLocalStorageVideoKey = (id: string) => `product_video_${id}`;

  const { data: vendor_products } = useQuery({
    queryKey: ["one_product", productId],
    queryFn: () => getVendorProductById(productId),
    enabled: !!productId,
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedProduct: Partial<Product>) => {
      const formData = new FormData();
      // Append text fields
      if (updatedProduct.name) formData.append("name", updatedProduct.name);
      if (updatedProduct.description)
        formData.append("description", updatedProduct.description);
      if (updatedProduct.price)
        formData.append("price", updatedProduct.price.toString());
      if (updatedProduct.inventory)
        formData.append("inventory", updatedProduct.inventory.toString());
      // Append new images
      newImages.forEach((image, index) => {
        if (image) {
          formData.append(`images[${index}]`, image);
        }
      });
      // Append new video
      if (newVideo) {
        formData.append("product_video", newVideo);
      }
      return updateVendorProduct(productId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["one_product", productId] });
      queryClient.invalidateQueries({ queryKey: ["vendor_products"] });
      toast.success("Product updated successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      toast.error("Failed to update product", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteVendorProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor_products"] });
      toast.success("Product deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      // Clear localStorage for this product
      clearProductFromLocalStorage();
      onClose();
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product", {
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  // Use vendor_products if available, otherwise fall back to product prop
  const productData = vendor_products || product;

  // Clear all localStorage items related to this product
  const clearProductFromLocalStorage = () => {
    if (productId) {
      // Clear images
      if (productData?.images) {
        productData.images.forEach((_: string, index: number) => {
          localStorage.removeItem(getLocalStorageImageKey(productId, index));
        });
      }
      // Clear video
      localStorage.removeItem(getLocalStorageVideoKey(productId));
    }
  };

  // Load images and video from localStorage
  useEffect(() => {
    if (productId && productData) {
      const updatedImages = [...(productData.images || [])];
      let hasLocalStorageImages = false;

      // Load images from localStorage
      productData.images?.forEach((_: string, index: number) => {
        const localStorageImage = localStorage.getItem(
          getLocalStorageImageKey(productId, index)
        );
        if (localStorageImage) {
          updatedImages[index] = localStorageImage;
          hasLocalStorageImages = true;
        }
      });

      // Load video from localStorage
      const localStorageVideo = localStorage.getItem(
        getLocalStorageVideoKey(productId)
      );

      // Update state with localStorage data if available
      if (hasLocalStorageImages || localStorageVideo) {
        setEditedProduct({
          ...productData,
          images: updatedImages,
          product_video: localStorageVideo || productData.product_video,
        });
      } else {
        setEditedProduct({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          inventory: productData.inventory,
          images: productData.images,
          product_video: productData.product_video,
        });
      }

      // Initialize newImages array
      setNewImages(new Array(productData.images?.length || 0).fill(null));

      // Set selected media
      if (updatedImages.length > 0) {
        setSelectedMedia(updatedImages[0]);
      }
    }
  }, [productId, productData]);

  if (!productData) return null;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const handleMediaSelect = (media: string, isVideo = false): void => {
    setSelectedMedia(media);
    setIsVideoSelected(isVideo);
  };

  // Get YouTube video ID for thumbnail
  const getYouTubeThumbnail = (url: string): string => {
    let videoId = "";
    if (url.includes("youtube.com")) {
      const params = new URL(url).searchParams;
      videoId = params.get("v") || "";
    } else if (url.includes("youtu.be")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    }
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : "/video-placeholder.jpg";
  };

  // Use editedProduct.images if available, otherwise fall back to productData.images
  const displayImages = editedProduct.images || productData.images || [];

  // Video handling
  const videoUrl = editedProduct.product_video || productData.product_video;
  const hasVideo = !!videoUrl;
  const isYouTube =
    hasVideo &&
    (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"));

  const embedUrl =
    hasVideo && isYouTube
      ? videoUrl
          .replace("watch?v=", "embed/")
          .replace("youtu.be/", "youtube.com/embed/")
      : videoUrl;

  const videoThumbnail =
    hasVideo && isYouTube
      ? getYouTubeThumbnail(videoUrl)
      : hasVideo
      ? "/video-placeholder.jpg"
      : null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]:
        name === "price" || name === "inventory"
          ? Number.parseFloat(value)
          : value,
    });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setEditedProduct({
      ...editedProduct,
      description: value,
    });
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);

      // Update the editedProduct images array
      const updatedImages = [...displayImages];
      updatedImages[index] = newImageUrl;
      setEditedProduct({ ...editedProduct, images: updatedImages });

      // Store the file for submission
      const updatedNewImages = [...newImages];
      updatedNewImages[index] = file;
      setNewImages(updatedNewImages);

      // Update selected media if the changed image is currently selected
      if (selectedMedia === displayImages[index]) {
        setSelectedMedia(newImageUrl);
      }

      // Store in localStorage
      if (productId) {
        localStorage.setItem(
          getLocalStorageImageKey(productId, index),
          newImageUrl
        );
      }
    }
  };

  const handleAddNewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);

      // Add to images array
      const updatedImages = [...displayImages, newImageUrl];
      setEditedProduct({ ...editedProduct, images: updatedImages });

      // Add to newImages array
      const updatedNewImages = [...newImages, file];
      setNewImages(updatedNewImages);

      // Select the new image
      setSelectedMedia(newImageUrl);

      // Store in localStorage
      if (productId) {
        localStorage.setItem(
          getLocalStorageImageKey(productId, updatedImages.length - 1),
          newImageUrl
        );
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...displayImages];
    updatedImages.splice(index, 1);
    setEditedProduct({ ...editedProduct, images: updatedImages });

    const updatedNewImages = [...newImages];
    updatedNewImages.splice(index, 1);
    setNewImages(updatedNewImages);

    // Remove from localStorage
    if (productId) {
      localStorage.removeItem(getLocalStorageImageKey(productId, index));
    }

    // Update selected media if needed
    if (selectedMedia === displayImages[index]) {
      setSelectedMedia(updatedImages[0] || null);
      setIsVideoSelected(false);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newVideoUrl = URL.createObjectURL(file);
      setEditedProduct({ ...editedProduct, product_video: newVideoUrl });
      setNewVideo(file);

      if (isVideoSelected) {
        setSelectedMedia(newVideoUrl);
      }

      // Store in localStorage
      if (productId) {
        localStorage.setItem(getLocalStorageVideoKey(productId), newVideoUrl);
      }
    }
  };

  const handleRemoveVideo = () => {
    setEditedProduct({ ...editedProduct, product_video: undefined });
    setNewVideo(null);
    setSelectedMedia(displayImages[0] || null);
    setIsVideoSelected(false);

    // Remove from localStorage
    if (productId) {
      localStorage.removeItem(getLocalStorageVideoKey(productId));
    }
  };

  const handleSave = () => {
    if (formRef.current?.checkValidity()) {
      updateMutation.mutate(editedProduct);
    } else {
      formRef.current?.reportValidity();
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0">
        <ToastContainer />
        <div className="sticky top-0 z-10 bg-white p-3 sm:p-4 md:p-6 border-b flex items-center justify-between">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">
            {isEditing ? "Edit Product" : "Product Details"}
          </DialogTitle>
          <div className="flex items-center gap-2 sm:gap-3">
            {isEditing ? (
              <motion.button
                onClick={handleSave}
                className="p-2 sm:p-3 hover:bg-green-100 rounded-full"
                whileHover={{ scale: 1.1 }}
                aria-label="Save"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-t-green-500 border-green-200 rounded-full animate-spin" />
                ) : (
                  <Save size={18} className="text-green-600" />
                )}
              </motion.button>
            ) : (
              <motion.button
                onClick={toggleEdit}
                className="p-2 sm:p-3 hover:bg-gray-100 rounded-full"
                whileHover={{ scale: 1.1 }}
                aria-label="Edit"
              >
                <Edit size={18} className="text-gray-600" />
              </motion.button>
            )}
            <motion.button
              onClick={handleDelete}
              className="p-2 sm:p-3 hover:bg-red-100 rounded-full"
              whileHover={{ scale: 1.1 }}
              aria-label="Delete"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-t-red-500 border-red-200 rounded-full animate-spin" />
              ) : (
                <Trash2 size={18} className="text-red-500" />
              )}
            </motion.button>
            <motion.button
              onClick={() => {
                if (isEditing) {
                  toggleEdit(); // Exit edit mode
                }
                onClose();
              }}
              className="p-2 sm:p-3 hover:bg-gray-100 rounded-full"
              whileHover={{ scale: 1.1 }}
              aria-label="Close"
            >
              <X size={18} className="text-gray-600" />
            </motion.button>
          </div>
        </div>

        <form
          ref={formRef}
          className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                {isVideoSelected && hasVideo ? (
                  isYouTube ? (
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Product Video"
                    />
                  ) : (
                    <video
                      src={videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Failed to load video", e);
                        e.currentTarget.poster = "/video-error.svg";
                      }}
                    />
                  )
                ) : displayImages.length > 0 ? (
                  <img
                    src={selectedMedia || displayImages[0]}
                    alt={productData.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ImageIcon className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                {displayImages.map((image: string, index: number) => (
                  <div
                    key={`img-${index}`}
                    className={`w-full aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer 
                      relative transition-all duration-300 ${
                        selectedMedia === image && !isVideoSelected
                          ? "ring-2 ring-blue-500"
                          : "opacity-80"
                      }`}
                    onClick={() => handleMediaSelect(image)}
                  >
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    {isEditing && (
                      <>
                        <label
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer hover:bg-opacity-50 transition-opacity"
                          title="Replace image"
                        >
                          <Upload className="text-white w-5 sm:w-6 h-5 sm:h-6" />
                          <motion.input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageChange(e, index)}
                          />
                        </label>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          title="Remove image"
                        >
                          <X size={14} />
                        </button>
                      </>
                    )}
                  </div>
                ))}

                {/* Video thumbnail - only show if video exists */}
                {hasVideo && (
                  <div
                    key="video"
                    className={`w-full aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer relative 
                      transition-all duration-300 hover:scale-105 ${
                        isVideoSelected ? "ring-2 ring-blue-500" : "opacity-80"
                      }`}
                    onClick={() => handleMediaSelect(videoUrl, true)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <Play className="text-white w-6 sm:w-8 h-6 sm:h-8" />
                    </div>
                    <img
                      src={videoThumbnail || "/video-placeholder.jpg"}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover opacity-70"
                      onError={(e) => {
                        e.currentTarget.src = "/video-placeholder.jpg";
                      }}
                    />
                    {isEditing && (
                      <>
                        <label
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer hover:bg-opacity-50 transition-opacity"
                          title="Replace video"
                        >
                          <Upload className="text-white w-5 sm:w-6 h-5 sm:h-6" />
                          <motion.input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={handleVideoChange}
                          />
                        </label>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveVideo();
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          title="Remove video"
                        >
                          <X size={14} />
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Add new image button (only in edit mode) */}
                {isEditing && (
                  <div className="w-full aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer relative">
                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors">
                      <Upload className="text-gray-400 w-8 h-8 mb-1" />
                      <span className="text-xs text-gray-500">Add Image</span>
                      <motion.input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAddNewImage}
                      />
                    </label>
                  </div>
                )}

                {/* Add video button (only in edit mode when no video exists) */}
                {isEditing && !hasVideo && (
                  <div className="w-full aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer relative">
                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors">
                      <Play className="text-gray-400 w-8 h-8 mb-1" />
                      <span className="text-xs text-gray-500">Add Video</span>
                      <motion.input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoChange}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm sm:text-base font-medium text-gray-700 mb-1"
                      >
                        Product Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editedProduct.name || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm sm:text-base font-medium text-gray-700 mb-1"
                      >
                        Description
                      </label>
                      <motion.textarea
                        id="description"
                        name="description"
                        placeholder="Product Description"
                        value={editedProduct.description || ""}
                        onChange={handleDescriptionChange}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base resize-none min-h-[100px] max-h-[200px]"
                        style={{ minHeight: "100px" }}
                        rows={4}
                      />
                      <div className="text-xs text-gray-500 mt-1 flex justify-between">
                        <span>
                          Characters: {(editedProduct.description || "").length}
                        </span>
                        <span>
                          Words:{" "}
                          {editedProduct.description?.trim()
                            ? editedProduct.description.trim().split(/\s+/)
                                .length
                            : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                      {productData.name}
                    </h1>
                    <p className="text-gray-700 text-sm sm:text-base">
                      {productData.description}
                    </p>
                  </>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <h3 className="font-medium text-gray-500 text-sm sm:text-base">
                    Price
                  </h3>
                  {isEditing ? (
                    <div className="mt-1">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          ₦
                        </span>
                        <motion.input
                          type="number"
                          id="price"
                          name="price"
                          value={editedProduct.price || ""}
                          onChange={handleInputChange}
                          className="w-full pl-7 p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-lg sm:text-xl font-bold">
                      ₦{productData.price?.toFixed(2)}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-500 text-sm sm:text-base">
                    Inventory
                  </h3>
                  {isEditing ? (
                    <div className="mt-1">
                      <motion.input
                        type="number"
                        id="inventory"
                        name="inventory"
                        value={editedProduct.inventory || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        min="0"
                        required
                      />
                    </div>
                  ) : (
                    <p className="text-lg sm:text-xl font-bold">
                      {productData.inventory}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="font-medium text-gray-500 text-sm sm:text-base">
                    Category
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant="secondary">{productData.category}</Badge>
                    <Badge variant="outline">{productData.sub_category}</Badge>
                    <Badge variant="outline">{productData.sub_category2}</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-500 text-sm sm:text-base">
                    Added on
                  </h3>
                  <p className="text-sm sm:text-base">
                    {formatDate(productData.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-[90%] sm:max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 text-red-600">
                <AlertTriangle size={20} className="sm:w-6 sm:h-6" />
                <h3 className="text-base sm:text-lg font-semibold">
                  Delete Product
                </h3>
              </div>

              <p className="mb-4 sm:mb-6 text-sm sm:text-base">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{productData.name}</span>? This
                action cannot be undone.
              </p>

              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md hover:bg-gray-50 min-w-[80px] text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 min-w-[80px] text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default ProductDetailModal;
