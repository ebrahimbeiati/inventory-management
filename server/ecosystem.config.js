module.exports = {
  apps: [
    {
      name: "inventory-management",
      script: "npx",
      args: "dotenv -e .env -- ts-node src/index.ts",
      cwd: "./server",
      interpreter: "none"
    },
  ],
};
