// utils/qrCodeGenerator.ts
import QRCode from 'qrcode';

interface QRCodeOptions {
  claimCode: string;
  logoUrl?: string;
  qrSize?: number;
  logoSize?: number;
}

/**
 * Generates a QR code with a centered logo overlay
 * @param options - Configuration options for QR code generation
 * @returns Promise that resolves when download is complete
 */
export const generateQRCodeWithLogo = async ({
  claimCode,
  logoUrl = '/snap.svg',
  qrSize = 600,
  logoSize = 120,
}: QRCodeOptions): Promise<void> => {
  try {
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(claimCode, {
      width: qrSize,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H', // High error correction to allow for logo overlay
    });

    // Create canvas to add logo
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Set canvas size
    canvas.width = qrSize;
    canvas.height = qrSize;

    // Draw QR code
    const qrImage = new Image();
    
    await new Promise<void>((resolve, reject) => {
      qrImage.onload = () => {
        ctx.drawImage(qrImage, 0, 0);

        // Draw white background rounded rectangle for logo
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const borderRadius = 12;
        const borderWidth = 3;
        const rectWidth = logoSize + (15 * 2);
        const rectHeight = logoSize + 2;
        const rectX = centerX - (rectWidth / 2);
        const rectY = centerY - (rectHeight / 2);
        
        // Draw border
        ctx.strokeStyle = '#0066FF'; // SNAP blue color
        ctx.lineWidth = borderWidth;
        ctx.beginPath();
        ctx.roundRect(rectX, rectY, rectWidth, rectHeight, borderRadius);
        ctx.stroke();
        
        // Draw white background fill
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(rectX, rectY, rectWidth, rectHeight, borderRadius);
        ctx.fill();

        // Draw logo image
        const logoImage = new Image();
        logoImage.crossOrigin = 'anonymous';
        
        logoImage.onload = () => {
          // Calculate aspect ratio to prevent stretching
          const imgWidth = logoImage.width;
          const imgHeight = logoImage.height;
          const aspectRatio = imgWidth / imgHeight;
          
          let drawWidth = logoSize;
          let drawHeight = logoSize;
          
          // Maintain aspect ratio - fit within the logoSize box
          if (aspectRatio > 1) {
            // Wider than tall
            drawHeight = logoSize / aspectRatio;
          } else if (aspectRatio < 1) {
            // Taller than wide
            drawWidth = logoSize * aspectRatio;
          }
          
          // Center the logo within the available space
          const logoX = centerX - (drawWidth / 2);
          const logoY = centerY - (drawHeight / 2);
          
          // Draw the logo with maintained aspect ratio
          ctx.drawImage(logoImage, logoX, logoY, drawWidth, drawHeight);

          // Download the final image
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `qr-${claimCode}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              resolve();
            } else {
              reject(new Error('Failed to create blob'));
            }
          });
        };
        
        logoImage.onerror = () => {
          reject(new Error('Failed to load logo image'));
        };
        
        logoImage.src = logoUrl;
      };
      
      qrImage.onerror = () => {
        reject(new Error('Failed to load QR code image'));
      };
      
      qrImage.src = qrDataUrl;
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

/**
 * Generates a simple QR code without logo (fallback)
 * @param claimCode - The claim code to encode
 * @returns Promise that resolves when download is complete
 */
export const generateSimpleQRCode = async (claimCode: string): Promise<void> => {
  try {
    const qrDataUrl = await QRCode.toDataURL(claimCode, {
      width: 600,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qr-${claimCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating simple QR code:', error);
    throw error;
  }
};