import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProfilePhotoUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  className?: string;
}

export const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  currentImage,
  onImageChange,
  className
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    setUploading(true);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Simulate upload delay for smooth animation
    setTimeout(() => {
      onImageChange(url);
      setUploading(false);
    }, 1500);
  }, [onImageChange]);

  const removeImage = useCallback(() => {
    setPreviewUrl(null);
    onImageChange('');
  }, [onImageChange]);

  const imageUrl = previewUrl || currentImage;

  return (
    <div className={cn("relative", className)}>
      <motion.div
        layout
        className="relative group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className={cn(
            "relative w-32 h-32 rounded-full border-2 border-dashed border-border overflow-hidden transition-all duration-300",
            dragActive && "border-primary bg-primary/5",
            imageUrl && "border-solid border-primary/20"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          animate={{
            borderColor: dragActive ? "hsl(221 83% 53%)" : "hsl(215 28% 17%)"
          }}
        >
          <AnimatePresence mode="wait">
            {imageUrl ? (
              <motion.div
                key="image"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative w-full h-full"
              >
                <img
                  src={imageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 transition-opacity duration-300"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeImage}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>

                {uploading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/70 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
                    />
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center justify-center w-full h-full text-muted-foreground cursor-pointer"
              >
                <motion.div
                  animate={dragActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Camera className="w-8 h-8 mb-2" />
                </motion.div>
                <p className="text-xs text-center">
                  {dragActive ? "Drop photo" : "Add photo"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </motion.div>

        {/* Upload success indicator */}
        <AnimatePresence>
          {previewUrl && !uploading && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center border-2 border-background"
            >
              <Check className="w-4 h-4 text-success-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Upload info */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-muted-foreground text-center mt-3"
      >
        Drop image here or click to browse
      </motion.p>
    </div>
  );
};