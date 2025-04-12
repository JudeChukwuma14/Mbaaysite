import React, { useState } from "react";
import { X, Edit, Trash2, Play } from "lucide-react";
import { motion } from "framer-motion";
import { getVendorProductById } from "@/utils/VendorProductApi";
import { useQuery } from "@tanstack/react-query";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  status: string;
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
    <div className="bg-white rounded-lg shadow-xl">{children}</div>
  </div>
);

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

const DialogContent: React.FC<DialogContentProps> = ({
  className,
  children,
}) => <div className={`bg-white ${className || ""}`}>{children}</div>;

interface DialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

const DialogTitle: React.FC<DialogTitleProps> = ({ className, children }) => (
  <h2 className={`text-lg font-semibold ${className || ""}`}>{children}</h2>
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
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        variants[variant] || variants.default
      } ${className || ""}`}
    >
      {children}
    </span>
  );
};

const Separator: React.FC = () => <hr className="my-4 border-gray-200" />;

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

  const dummyVideoUrl =
    "https://static.videezy.com/system/resources/previews/000/005/529/original/Reaviling_Sjusj%C3%B8en_Ski_Senter.mp4";
  const dummyImages = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
  ];

  const { data: vendor_products } = useQuery({
    queryKey: ["one_product", productId],
    queryFn: () => getVendorProductById(productId),
    enabled: !!productId,
  });

  // Use vendor_products if available, otherwise fall back to product prop
  const productData = vendor_products || product;

  // Initialize selectedMedia with the first image after productData is available
  React.useEffect(() => {
    if (productData?.images?.length) {
      setSelectedMedia(productData.images[0]);
    }
  }, [productData]);

  if (!productData) return null;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const handleMediaSelect = (media: string, isVideo: boolean = false): void => {
    setSelectedMedia(media);
    setIsVideoSelected(isVideo);
  };

  const allImages: string[] = [
    ...(productData.images || []),
    ...dummyImages.slice(0, 4 - (productData.images?.length || 0)),
  ];

  const videoUrl = productData.product_video || dummyVideoUrl;
  const isYouTube =
    videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  const embedUrl = isYouTube
    ? videoUrl
        .replace("watch?v=", "embed/")
        .replace("youtu.be/", "youtube.com/embed/")
    : videoUrl;

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

  const videoThumbnail = isYouTube
    ? getYouTubeThumbnail(videoUrl)
    : "/video-placeholder.jpg"; // Use a placeholder for non-YouTube videos

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-white p-4 sm:p-6 border-b flex items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            Product Details
          </DialogTitle>
          <div className="flex items-center gap-3">
            <motion.button
              className="p-2 hover:bg-gray-100 rounded-full"
              whileHover={{ scale: 1.1 }}
              aria-label="Edit"
            >
              <Edit size={18} className="text-gray-600" />
            </motion.button>
            <motion.button
              className="p-2 hover:bg-gray-100 rounded-full"
              whileHover={{ scale: 1.1 }}
              aria-label="Delete"
            >
              <Trash2 size={18} className="text-red-500" />
            </motion.button>
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              whileHover={{ scale: 1.1 }}
              aria-label="Close"
            >
              <X size={18} className="text-gray-600" />
            </motion.button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                {isVideoSelected ? (
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
                      src={embedUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Failed to load video", e);
                        e.currentTarget.poster = "/video-error.svg";
                      }}
                    />
                  )
                ) : (
                  <img
                    src={selectedMedia || allImages[0]}
                    alt={productData.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {allImages.map((image, index) => (
                  <div
                    key={`img-${index}`}
                    className={`aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer 
                    relative transition-all duration-300 ${
                      selectedMedia === image
                        ? "ring-2 ring-blue-500"
                        : "opacity-80"
                    }`}
                    onClick={() => handleMediaSelect(image)}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                ))}

                <div
                  key="video"
                  className={`aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer relative 
                    transition-all duration-300 hover:scale-105 ${
                      isVideoSelected ? "ring-2 ring-blue-500" : "opacity-80"
                    }`}
                  onClick={() => handleMediaSelect(videoUrl, true)}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <Play className="text-white w-8 h-8" />
                  </div>
                  <img
                    src={videoThumbnail}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover opacity-70"
                    onError={(e) => {
                      e.currentTarget.src = "/video-placeholder.jpg";
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">{productData.name}</h1>
                <p className="text-gray-700">{productData.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-500">Price</h3>
                  <p className="text-xl font-bold">
                    ${productData.price?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Inventory</h3>
                  <p className="text-xl font-bold">{productData.inventory}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-500">Category</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant="secondary">{productData.category}</Badge>
                    <Badge variant="outline">{productData.sub_category}</Badge>
                    <Badge variant="outline">{productData.sub_category2}</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-500">Added on</h3>
                  <p>{formatDate(productData.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
