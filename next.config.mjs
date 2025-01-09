/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "profile.line-scdn.net",
      },
      {
        hostname: "img.freepik.com",
      },
      {
        hostname: "img.lazcdn.com",
      },
      {
        hostname: "cdn.nocnoc.com",
      },
      {
        hostname: "test-api.khumkha.com",
      },
    ],
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/promotion",
        destination: "/",
        permanent: true,
      },
      // Wildcard path matching
      {
        source: "/promotion/:id",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
