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
        hostname: "d338-101-108-100-250.ngrok-free.app",
      },
    ],
  },
  async redirects() {
    return [
      // Basic redirect
      // {
      //   source: "/promotion",
      //   destination: "/",
      //   permanent: true,
      // },
      // // Wildcard path matching
      // {
      //   source: "/promotion/:id",
      //   destination: "/",
      //   permanent: true,
      // },
    ];
  },
};

export default nextConfig;
