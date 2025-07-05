
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share } from "lucide-react";
import { toast } from "sonner";

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  productName: string;
}

const ImageZoomModal = ({ isOpen, onClose, imageUrl, productName }: ImageZoomModalProps) => {

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${productName.replace(/\s+/g, '_').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch (error) {
      console.error('Download failed:', error);
      toast.error("Failed to download image.");
      window.open(imageUrl, '_blank');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Check out this design: ${productName}`,
      text: `I found this cool design from Anchor Gym Wear: ${productName}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing:", error);
        toast.error("Could not share at this moment.");
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard!");
      } catch (err) {
        console.error('Failed to copy: ', err);
        toast.error("Could not copy link to clipboard.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none !rounded-lg overflow-hidden">
        <div className="relative">
            <img src={imageUrl} alt={`Zoomed view of ${productName}`} loading="lazy" className="w-full h-auto max-h-[90vh] object-contain rounded-lg" />
            <DialogFooter className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/30 backdrop-blur-sm p-2 rounded-lg">
                <Button variant="secondary" size="icon" onClick={handleDownload} title="Download Image">
                    <Download className="h-5 w-5" />
                    <span className="sr-only">Download Image</span>
                </Button>
                <Button variant="secondary" size="icon" onClick={handleShare} title="Share">
                    <Share className="h-5 w-5" />
                    <span className="sr-only">Share Image</span>
                </Button>
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageZoomModal;
