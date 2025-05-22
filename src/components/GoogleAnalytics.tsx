
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// GA measurement ID
const TRACKING_ID = 'G-XXXXXXXXXX'; // Replace with your actual Google Analytics tracking ID

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Load Google Analytics script
    const loadGoogleAnalytics = () => {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}`;
      
      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${TRACKING_ID}', { 'send_page_view': false });
      `;
      
      document.head.appendChild(script1);
      document.head.appendChild(script2);
    };

    if (!window.gtag) {
      loadGoogleAnalytics();
    }
    
    // Function to track page views
    const trackPageView = (path: string) => {
      if (window.gtag) {
        window.gtag('config', TRACKING_ID, {
          page_path: path,
        });
        console.log(`Tracked pageview: ${path}`);
      }
    };

    // Function to set up event listeners
    const setupEventListeners = () => {
      // Find all elements with data-event attributes
      document.querySelectorAll('[data-event]').forEach(element => {
        const eventName = element.getAttribute('data-event');
        if (eventName) {
          element.addEventListener('click', () => {
            if (window.gtag) {
              window.gtag('event', eventName, {
                event_category: 'User Interaction',
                event_label: element.textContent || eventName
              });
              console.log(`Tracked event: ${eventName}`);
            }
          });
        }
      });
    };

    // Track page view when location changes
    trackPageView(location.pathname + location.search);
    
    // Set up event tracking after a short delay to ensure DOM is fully loaded
    const timeout = setTimeout(() => {
      setupEventListeners();
    }, 1000);

    // Cleanup
    return () => clearTimeout(timeout);
  }, [location]);

  return null; // This component doesn't render anything
};

// Add global type definitions for gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export default GoogleAnalytics;
