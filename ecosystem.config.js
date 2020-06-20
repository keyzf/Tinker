module.exports = {
  apps: [
    {
      name: "devsapp",
      script: 'index.js',
      //watch: ["./index.js", "./events/", "./commands/", "./lib/", "./res/"],
      kill_timeout: 3000,
      max_memory_restart: '300M',
     // node_args: "--max_old_space_size=8192"
    }
  ]
};
