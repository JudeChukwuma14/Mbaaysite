import React, { useState } from "react";
import { X, Edit, Trash2, Play } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  productName: string;
  description: string;
  price: number;
  inventory: number;
  status: string;
  category: string;
  subCategory: string;
  subSubCategory: string;
  dateAdded: string;
  images: string[];
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
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  if (!product) return null;

  const [selectedMedia, setSelectedMedia] = useState<string | null>(
    product.images[0]
  );
  const [isVideoSelected, setIsVideoSelected] = useState<boolean>(false);

  const dummyVideoUrl =
    "https://static.videezy.com/system/resources/previews/000/005/529/original/Reaviling_Sjusj%C3%B8en_Ski_Senter.mp4";
  const dummyImages = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
  ];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const handleMediaSelect = (media: string, isVideo: boolean = false): void => {
    setSelectedMedia(media);
    setIsVideoSelected(isVideo);
  };

  const allImages: string[] = [
    ...product.images,
    ...dummyImages.slice(0, 4 - product.images.length),
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-white p-6 border-b flex items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            Product Details
          </DialogTitle>
          <div className="flex items-center gap-3">
            <motion.button className="p-2 hover:bg-gray-100 rounded-full">
              <Edit size={18} className="text-gray-600" />
            </motion.button>
            <motion.button className="p-2 hover:bg-gray-100 rounded-full">
              <Trash2 size={18} className="text-red-500" />
            </motion.button>
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={18} className="text-gray-600" />
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg relative overflow-hidden shadow-lg">
                {isVideoSelected ? (
                  <div className="w-full h-full">
                    <video
                      src={selectedMedia || dummyVideoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="perspective-1000 w-full h-full group">
                    <img
                      src={selectedMedia || allImages[0]}
                      alt={product.productName}
                      className="w-full h-full object-cover transition-all duration-500 
                               transform-style-3d hover:rotate-y-10 hover:scale-110 
                               group-hover:shadow-xl rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-5 gap-2">
                {allImages.map((image, index) => (
                  <div
                    key={`img-${index}`}
                    className={`aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer 
                              relative transition-all duration-300
                              ${
                                selectedMedia === image
                                  ? "ring-2 ring-blue-500"
                                  : "opacity-80"
                              }`}
                    onClick={() => handleMediaSelect(image)}
                  >
                    <div className="relative perspective-1000 w-full h-full group">
                      <img
                        src={image}
                        alt={`${product.productName} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 
                                  transform-style-3d group-hover:-translate-z-20 group-hover:rotate-y-15 
                                  group-hover:scale-110 group-hover:shadow-2xl rounded-md"
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement, Event>
                        ) => {
                          console.error(`Failed to load image: ${image}`);
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 rounded-md" />
                    </div>
                  </div>
                ))}
                <div
                  key="video"
                  className={`aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer relative 
                            transition-all duration-300 hover:scale-105
                            ${
                              isVideoSelected
                                ? "ring-2 ring-blue-500"
                                : "opacity-80"
                            }`}
                  onClick={() => handleMediaSelect(dummyVideoUrl, true)}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <Play className="text-white w-8 h-8" />
                  </div>
                  <img
                    src={allImages[0]}
                    alt={`${product.productName} video thumbnail`}
                    className="w-full h-full object-cover opacity-70"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-bold">{product.productName}</h1>
                  <Badge className={getStatusColor(product.status)}>
                    {product.status.charAt(0).toUpperCase() +
                      product.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-gray-700">{product.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-500">Price</h3>
                  <p className="text-xl font-bold">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Inventory</h3>
                  <p className="text-xl font-bold">{product.inventory}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-500">Category</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant="outline">{product.subCategory}</Badge>
                    <Badge variant="outline">{product.subSubCategory}</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-500">Added on</h3>
                  <p>{formatDate(product.dateAdded)}</p>
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
