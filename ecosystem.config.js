module.exports = {
  apps: [
    {
      name: "tinker",
      script: 'index.js',
      // watch: ["./index.js", "./events/", "./commands/", "./lib/", "./util/"],
      kill_timeout: 3000,
      env: {
        "NODE_ENV": "production",
      }
      // max_memory_restart: '300M',
     // node_args: "--max_old_space_size=8192"
    }
  ]
};
