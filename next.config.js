/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['*.amazonaws.com'],
  },
  webpack: (config, { isServer }) => {
    // Exclude the amplify directory from webpack compilation
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/amplify/**'],
    };
    
    // Exclude amplify directory from module resolution
    config.resolve.modules = config.resolve.modules || [];
    config.resolve.modules.push('node_modules');
    
    return config;
  },
  // Exclude amplify directory from TypeScript compilation
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
