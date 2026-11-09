// pm2 process for the DeepCleanz website + admin + API.
// Started/reloaded by deploy/remote-deploy.sh. APP_DIR layout:
//   releases/<id>/   one folder per deploy (Next.js standalone bundle)
//   current -> releases/<id>
//   shared/.env      production settings (never in git)
//   shared/media/    uploaded images (survive deploys)
const APP_DIR = process.env.APP_DIR || '/var/www/deepcleanz'

module.exports = {
  apps: [
    {
      name: 'deepcleanz',
      cwd: `${APP_DIR}/current`,
      script: 'server.js',
      node_args: `--env-file=${APP_DIR}/shared/.env`,
      exec_mode: 'fork',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
        HOSTNAME: '127.0.0.1', // only Nginx talks to the app
        MEDIA_DIR: `${APP_DIR}/shared/media`,
      },
      max_memory_restart: '800M',
      kill_timeout: 8000,
      time: true,
      out_file: `${APP_DIR}/shared/logs/out.log`,
      error_file: `${APP_DIR}/shared/logs/error.log`,
    },
  ],
}
