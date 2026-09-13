import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App } from '@capacitor/app';

export function useBackButton() {
    const navigate = useNavigate();
    const location = useLocation();

    // Keep track of current location in a ref to avoid re-registering listener
    // on every navigation, which can be expensive/glitchy
    const locationRef = useRef(location);
    useEffect(() => {
        locationRef.current = location;
    }, [location]);

    useEffect(() => {
        let listenerHandle: any = null;

        const setupListener = async () => {
            // We ignore canGoBack from the event because we are managing
            // routing via React Router, not the webview history stack directly
            listenerHandle = await App.addListener('backButton', () => {
                // If a modal is open, let the modal handle it
                const isModalOpen = !!document.querySelector('[role="dialog"]');
                if (isModalOpen) return;

                const currentPath = locationRef.current.pathname;

                // If we are on the home page or login page, exit the app
                if (currentPath === '/' || currentPath === '/login') {
                    App.exitApp();
                } else {
                    // Otherwise go back in history
                    navigate(-1);
                }
            });
        };

        setupListener();

        return () => {
            if (listenerHandle) {
                listenerHandle.remove();
            }
        };
    }, [navigate]); // Only re-run if navigate function changes (stable)
}
