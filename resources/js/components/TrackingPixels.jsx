import React, { useEffect } from 'react';

const TrackingPixels = ({ generals = [] }) => {
    // Obtener valores de píxeles desde generals
    const facebookPixel = generals?.find(g => g.correlative === 'facebook_pixel')?.description?.trim();
    const googleAnalytics = generals?.find(g => g.correlative === 'google_analytics')?.description?.trim();
    const googleTagManager = generals?.find(g => g.correlative === 'google_tag_manager')?.description?.trim();
    const tiktokPixel = generals?.find(g => g.correlative === 'tiktok_pixel')?.description?.trim();
    const linkedinPixel = generals?.find(g => g.correlative === 'linkedin_pixel')?.description?.trim();
    const customPixels = generals?.find(g => g.correlative === 'custom_pixels')?.description?.trim();

    const generateFacebookPixel = (pixelId) => {
        if (!pixelId) return '';
        return `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
        `;
    };

    const generateGoogleAnalytics = (gaId) => {
        if (!gaId) return '';
        
        // Detectar si es GA4 (G-) o Universal Analytics (UA-)
        if (gaId.startsWith('G-')) {
            // Google Analytics 4
            return `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
            `;
        } else if (gaId.startsWith('UA-')) {
            // Universal Analytics (legacy)
            return `
                (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
                ga('create', '${gaId}', 'auto');
                ga('send', 'pageview');
            `;
        }
        return '';
    };

    const generateGoogleTagManager = (gtmId) => {
        if (!gtmId) return '';
        return `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
        `;
    };

    const generateTikTokPixel = (pixelId) => {
        if (!pixelId) return '';
        return `
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load('${pixelId}');
              ttq.page();
            }(window, document, 'ttq');
        `;
    };

    const generateLinkedInPixel = (partnerId) => {
        if (!partnerId) return '';
        return `
            _linkedin_partner_id = "${partnerId}";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l) {
                if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                window.lintrk.q=[]}
                var s = document.getElementsByTagName("script")[0];
                var b = document.createElement("script");
                b.type = "text/javascript";b.async = true;
                b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                s.parentNode.insertBefore(b, s);})(window.lintrk);
        `;
    };

    // Función para agregar scripts al head de forma segura
    const addScriptToHead = (scriptContent, scriptId, isInline = true) => {
        // Prevenir duplicados
        if (document.getElementById(scriptId)) {
            return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        
        if (isInline) {
            script.innerHTML = scriptContent;
        } else {
            script.src = scriptContent;
            script.async = true;
        }
        
        document.head.appendChild(script);
    };

    // Función para agregar noscript al head
    const addNoscriptToHead = (content, noscriptId) => {
        if (document.getElementById(noscriptId)) {
            return;
        }

        const noscript = document.createElement('noscript');
        noscript.id = noscriptId;
        noscript.innerHTML = content;
        document.head.appendChild(noscript);
    };

    useEffect(() => {
        // Facebook Pixel
        if (facebookPixel && facebookPixel !== '') {
            addScriptToHead(generateFacebookPixel(facebookPixel), 'facebook-pixel-script');
            addNoscriptToHead(
                `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${facebookPixel}&ev=PageView&noscript=1" />`,
                'facebook-pixel-noscript'
            );
        }

        // Google Analytics
        if (googleAnalytics && googleAnalytics !== '') {
            if (googleAnalytics.startsWith('G-')) {
                // GA4 - agregar script externo primero
                addScriptToHead(`https://www.googletagmanager.com/gtag/js?id=${googleAnalytics}`, 'gtag-script', false);
            }
            
            // Agregar script de configuración
            setTimeout(() => {
                addScriptToHead(generateGoogleAnalytics(googleAnalytics), 'google-analytics-script');
            }, 100);
        }

        // Google Tag Manager
        if (googleTagManager && googleTagManager !== '') {
            addScriptToHead(generateGoogleTagManager(googleTagManager), 'gtm-script');
        }

        // TikTok Pixel
        if (tiktokPixel && tiktokPixel !== '') {
            addScriptToHead(generateTikTokPixel(tiktokPixel), 'tiktok-pixel-script');
        }

        // LinkedIn Pixel
        if (linkedinPixel && linkedinPixel !== '') {
            addScriptToHead(generateLinkedInPixel(linkedinPixel), 'linkedin-pixel-script');
        }

        // Custom Pixels
        if (customPixels && customPixels.trim() !== '') {
            // Para píxeles personalizados, crear un contenedor en el body
            const customContainer = document.createElement('div');
            customContainer.id = 'custom-pixels-container';
            customContainer.innerHTML = customPixels;
            customContainer.style.display = 'none';
            
            // Remover contenedor anterior si existe
            const existingContainer = document.getElementById('custom-pixels-container');
            if (existingContainer) {
                existingContainer.remove();
            }
            
            document.body.appendChild(customContainer);
        }

    }, [facebookPixel, googleAnalytics, googleTagManager, tiktokPixel, linkedinPixel, customPixels]);

    // Este componente no renderiza nada visible
    return null;
};

export default TrackingPixels;