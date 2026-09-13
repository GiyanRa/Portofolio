import sys
import glob
try:
    from PIL import Image
    
    for img_path in glob.glob('src/imports/*.png'):
        img = Image.open(img_path)
        width, height = img.size
        # Crop the bottom 45 pixels to remove the watermark
        cropped_img = img.crop((0, 0, width, height - 45))
        cropped_img.save(img_path)
        print(f"Successfully cropped {img_path}")
except Exception as e:
    print(f"Error: {e}")
