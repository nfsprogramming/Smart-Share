/**
 * Utility functions for Capacitor platform detection and browser handling
 */

/**
 * Opens a URL with Capacitor Browser on native platforms, or window.open on web
 */
export async function openUrl(url: string): Promise<void> {
    try {
        const { Capacitor } = await import('@capacitor/core');
        if (Capacitor.isNativePlatform()) {
            const { Browser } = await import('@capacitor/browser');
            await Browser.open({ url });
        } else {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    } catch (err) {
        // Fallback if Capacitor is not available
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

/**
 * Checks if running on a native platform (Android/iOS)
 */
export async function isNativePlatform(): Promise<boolean> {
    try {
        const { Capacitor } = await import('@capacitor/core');
        return Capacitor.isNativePlatform();
    } catch {
        return false;
    }
}

/**
 * Opens a UPI payment URL on native platforms, or copies UPI ID on web
 */
export async function handleUpiPayment(upiId: string, name: string): Promise<void> {
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR`;

    try {
        const { Capacitor } = await import('@capacitor/core');
        if (Capacitor.isNativePlatform()) {
            // On Android, open UPI URL directly
            window.location.href = upiUrl;
        } else {
            // On web, copy UPI ID to clipboard
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(upiId);
                alert(`UPI ID copied: ${upiId}\nOpen any UPI app to pay`);
            } else {
                alert(`UPI ID: ${upiId}\nOpen any UPI app to pay`);
            }
        }
    } catch (err) {
        // Fallback for web
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(upiId);
            alert(`UPI ID copied: ${upiId}\nOpen any UPI app to pay`);
        }
    }
}

/**
 * Triggers a light vibration/haptic feedback on native platforms
 */
export async function triggerHapticSelection(): Promise<void> {
    try {
        const { Capacitor } = await import('@capacitor/core');
        if (Capacitor.isNativePlatform()) {
            const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
            await Haptics.impact({ style: ImpactStyle.Light });
        }
    } catch (err) {
        // Ignore haptic failures
    }
}
