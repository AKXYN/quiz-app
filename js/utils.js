// Utility function to get the correct base URL
function getBaseUrl() {
    // Check if we're on GitHub Pages
    if (window.location.hostname.includes('github.io')) {
        // Get the repo name from the URL path
        const pathParts = window.location.pathname.split('/');
        const repoName = pathParts[1]; // This will be 'quiz-app' in your case
        return `/${repoName}/`;
    }
    // For local development
    return '/';
}

// Function to get the correct path for assets
function getAssetPath(path) {
    const baseUrl = getBaseUrl();
    // Remove leading slash if present in the path
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${baseUrl}${cleanPath}`;
}

// Make functions available globally
window.getBaseUrl = getBaseUrl;
window.getAssetPath = getAssetPath; 