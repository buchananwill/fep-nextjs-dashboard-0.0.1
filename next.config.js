/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'avatar.vercel.sh']
  }
};

module.exports = {
  ...nextConfig,
  staticPageGenerationTimeout: 600
};
