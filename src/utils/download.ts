import { toPng, toSvg } from 'html-to-image';

export const downloadQRCode = async (
    elementId: string,
    fileName: string,
    format: 'png' | 'svg' = 'png'
) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        let dataUrl: string | null = null;

        // Configure higher quality for PNG
        const options = {
            quality: 1.0,
            pixelRatio: 4, // Scale up for high resolution
            backgroundColor: '#ffffff', // Ensure white background for better scanability
            style: {
                borderRadius: '0', // Ensure sharp corners if desired
            },
        };

        if (format === 'png') {
            dataUrl = await toPng(element, options);
        } else {
            dataUrl = await toSvg(element, { ...options, backgroundColor: 'transparent' }); // SVG often better transparent? Or white?
            // Usually white backing is safer for QR codes.
        }

        if (dataUrl) {
            const link = document.createElement('a');
            link.download = `${fileName}.${format}`;
            link.href = dataUrl;
            link.click();
        }
    } catch (err) {
        console.error('Error downloading QR Code:', err);
    }
};
