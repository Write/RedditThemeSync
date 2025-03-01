// ==UserScript==
// @name         Reddit Theme System Sync
// @namespace    RedditThemeSync
// @version      1.0
// @description  Automatically sync Reddit theme with system preference with flash prevention
// @author       Write
// @match        https://*.reddit.com/*
// @updateURL    https://raw.githubusercontent.com/Write/RedditThemeSync/refs/heads/main/RedditThemeSync.user.js
// @downloadURL  https://raw.githubusercontent.com/Write/RedditThemeSync/refs/heads/main/RedditThemeSync.user.js
// @grant        none
// @run-at       document-start
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAqFBMVEVHcEz/RQD/RQD/RQD/RQD/RQD/RQD/RgD/RQD/RQD/RQD/RQD/RQD+////RQD/QQD7/f3K1t7l7fD2+vvr8/Xx9/jP2+Lb5+vV4Ob5a0H/OgAFCw/9Vx7w4N3/XQD9t6EAAAAOFxr8fVn+lXf2ppD97+nvQAbdqp/bycbMztCCh4ntg2r6ybwfLjK5Z2XeNArDOAy4QC9ZXF7mkn2utbjLYldlLx5LSUecCmfiAAAADXRSTlMAw/k2IOvWC3CMSa2ejoaH8gAABHRJREFUWIWVV+l6qjAQVevubcK+CaIsAqLVVtu+/5vdmSRgUMR6/ONHck4mM8nMpNdrx2Q4ny7GowEhg9F4MZ0PJw8mtmI4n43JDcaz+fCP9Ldpf3BLRwz607e/rH6/uGzGUyumo8d0xGjabX2/m47oP97H5NnylREPIjKZdfKo53mU/521Kkz+dfI9P07iiHKJfy0Kk0U3Pw5SRUlDwhUWdwpP1qex8s6w90irDU/2T9z0XSD2Wv0w7aRvj9+qIQQCIUAaB+KtK37b089mubzwPSipiAQZyeeh6/wcfzabw+FwURC6HlQCpP+3DWwPy8PvqbQNU9d10zRyrx6qNzHs2sDP5vBJqJ/bGoPt1haQUXWzuiJ4WgIfwujmlgNQz540OBMe7Li/YMDPljCFLC/yrGwMjt+ee2DDDEAF4kauT5vDzAvDByGgFK4P7OAEd4hdAUrpDZ/00QvztvwFU30/isPs8JuFceT75I6MGMxBYHYlwRx2Y8HcOGSHFwLPz18Yu4SbISZygBsnlQspiZIwTFzikSgM3u8QhBEMuTgH/4g9THpD8deL9qlYK0zv6YgUhphyuo8qhWFvLvhxzXpAbwylsdjFXASRRh20VqmIikCyRET9/Wt8yCz8TCx6Y26A8qqAwk0Y99hFqjPWCwLcC6MeP0aJ3lDIA/2OkDdCqygJP0o9IgR0RYGvbDD4+Pz8uDkJ8jecqOtcgHABWhqQMDDlsLnH7Xb73VBIv+HbkStgYoLMIgIptuA6GqYcVFCy05a6oSvHRdkfKXw7ZYrgG5rDM8uAO5H4mW1rXED7OMJNivyz5BUF84gfHz+0d5YZNdvOfMKdyMPIMg4kPfBl8L0lqxUcbVmg9PAb7otlVtvKRWob90RFAwXHxLypgMAKQEpZIKb4jQngMnZRpcZFnY8oSUyTSWRMgDbO5p4LZLqCqdlMSHWhp9VlQhtMAxWUoPRXKz9uXI40xm9lgP4HXFPzvL7OcB8MAEpoYZLsU6UBfR8mocb4MOuaG4fXhEJIoGlcgYejeRCZ80zOD2oKJBQppSUaKjAN07Qul12Ny8VidQnZMCeRU9o1qVLXtoWEoVtf6+W6wnK5/lJ1QZerE0uqUlrPHJtXMLBih7wK6/WO6TI6nKFKgKX1a2HBswASTMNQv1BgAz8U+CoMXhpt28mvMZjelDZaFpYlNIzid70RWP8yPrIdSy1rvihtPam9OauqVWmgDUjH9TnZgTH1TBoubJZ3SkpLVSsRp9gdlsvDrnAqMoycr1WlLu9yefXcQhVAFbjkGlBVS3wrIqm8S12SXF/9rKim36LIpPZCbnEaTRZsI7Mc61YE7IHuQOI3mqxmj0D9MsmZxwWwN8mTstkdNPv+ZqNJsZtI9oEmEEA9dW8K/G3DfdvqYlNBfdeFtsT1W3qL+3Z7eNcpUdYItPQlpLXZnrU+tB7gfv3X+C0PjukL/LYnz5Nmv4G2R9cL/NZnX/djQcaDh+cfHouIx0/f7ueWQL/j8f2o2RULdz///wPZ/eZT2/SF3QAAAABJRU5ErkJggg==
// ==/UserScript==

(function() {
    'use strict';

    let currentThemeIsDark = null;
    let observer = null;

    // Immediately check system preference
    const systemPrefDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    let systemPrefersDark = systemPrefDarkQuery.matches;
    console.log(`Reddit Theme Sync: System prefers ${systemPrefersDark ? 'dark' : 'light'} mode`);

    // Function to update only the DOM theme (fast path for flash prevention)
    function updateDOMThemeOnly(enableDarkMode) {
        const htmlElement = document.documentElement;
        if (!htmlElement) return false;

        if (enableDarkMode) {
            htmlElement.classList.remove('theme-light');
            htmlElement.classList.add('theme-dark');
        } else {
            htmlElement.classList.remove('theme-dark');
            htmlElement.classList.add('theme-light');
        }
        return true;
    }

    function setRedditTheme(enableDarkMode, skipCheck = false) {

        const htmlElement = document.documentElement;
        if (!htmlElement) return false;

        const currentlyDark = htmlElement.classList.contains('theme-dark');

        if (!skipCheck && currentlyDark === enableDarkMode) {
            console.log('Reddit Theme Sync: Theme already matches preference');
            return false;
        }

        console.log(`Reddit Theme Sync: Setting theme to ${enableDarkMode ? 'dark' : 'light'} mode`);

        // 1. Update the HTML classes
        updateDOMThemeOnly(enableDarkMode);

        // 2. Set the theme cookie (1 for light, 2 for dark)
        const themeValue = enableDarkMode ? '2' : '1';
        document.cookie = `theme=${themeValue}; path=/; domain=.reddit.com`;

        // 3. Make the GraphQL request to persist the change server-side
        const csrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrf_token='))
            ?.split('=')[1];

        if (!csrfToken) {
            console.error('Reddit Theme Sync: CSRF token not found in cookies');
            return false;
        }

        fetch('https://www.reddit.com/svc/shreddit/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                operation: 'UpdateAccountPreferences',
                variables: {
                    input: {
                        isNightModeEnabled: enableDarkMode
                    }
                },
                csrf_token: csrfToken
            }),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Reddit Theme Sync: Theme updated successfully via API');
        })
        .catch(error => {
            console.error('Reddit Theme Sync: Error updating theme:', error);
        });

        currentThemeIsDark = enableDarkMode;
        return true;
    }

    function syncWithSystemTheme(force = false) {
        systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log(`Reddit Theme Sync: System prefers ${systemPrefersDark ? 'dark' : 'light'} mode`);
        return setRedditTheme(systemPrefersDark, force);
    }

    function startThemeObserver() {
        if (observer) return;

        observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'class' &&
                    mutation.target === document.documentElement) {

                    const htmlElement = document.documentElement;
                    const currentlyDark = htmlElement.classList.contains('theme-dark');

                    // If the current theme doesn't match our preference
                    if (currentThemeIsDark !== null && currentlyDark !== currentThemeIsDark) {
                        console.log('Reddit Theme Sync: Correcting theme class to match preference');
                        updateDOMThemeOnly(currentThemeIsDark !== null ? currentThemeIsDark : systemPrefersDark);
                    } else if (currentThemeIsDark === null) {
                        currentThemeIsDark = currentlyDark;
                        console.log(`Reddit Theme Sync: Detected initial Reddit theme: ${currentlyDark ? 'dark' : 'light'}`);
                        if (currentlyDark !== systemPrefersDark) {
                            console.log('Reddit Theme Sync: Initial theme does not match system preference');
                            setRedditTheme(systemPrefersDark, true);
                        }
                    }
                }
            }
        });

        // Watch for class changes on the HTML element
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        console.log('Reddit Theme Sync: Theme observer started');
    }

    function handleSystemThemeChange(event) {
        systemPrefersDark = event.matches;
        console.log(`Reddit Theme Sync: System theme changed to ${systemPrefersDark ? 'dark' : 'light'} mode`);
        setRedditTheme(systemPrefersDark, true);
    }

    function initialize() {
        console.log('Reddit Theme Sync: Initializing...');

        if (!observer && document.documentElement) {
            startThemeObserver();
        }

        // If we haven't detected Reddit's theme yet, force our preference
        if (currentThemeIsDark === null) {
            syncWithSystemTheme(true);
        }

        // Listen for system theme changes
        systemPrefDarkQuery.removeEventListener('change', handleSystemThemeChange);
        systemPrefDarkQuery.addEventListener('change', handleSystemThemeChange);

        // Listen for visibility changes (tab focus)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                console.log('Reddit Theme Sync: Tab became visible, checking theme...');
                syncWithSystemTheme();
            }
        });

        // Expose functions to global scope for debugging/manual control
        window.redditThemeSync = {
            toDark: () => setRedditTheme(true, true),
            toLight: () => setRedditTheme(false, true),
            syncWithSystem: () => syncWithSystemTheme(true),
            getCurrentTheme: () => ({
                systemPrefersDark,
                currentThemeIsDark,
                htmlClassDark: document.documentElement?.classList.contains('theme-dark')
            })
        };

        console.log('Reddit Theme Sync: Initialization complete');
    }

    // Attempt to set theme as early as possible to prevent flash
    function earlyThemeSetup() {
        // Apply DOM theme change immediately at document-start
        if (document.documentElement) {
            console.log('Reddit Theme Sync: Early theme setup (document-start)');
            updateDOMThemeOnly(systemPrefersDark);
            startThemeObserver();
        }
    }

    earlyThemeSetup();

    // If document wasn't ready yet, retry when it is
    if (!document.documentElement) {
        const checkDocument = setInterval(() => {
            if (document.documentElement) {
                earlyThemeSetup();
                clearInterval(checkDocument);
            }
        }, 5);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }
})();