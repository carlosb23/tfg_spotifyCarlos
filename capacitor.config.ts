import type { CapacitorConfig } from '@capacitor/cli';


const config: CapacitorConfig = {
  appId: 'com.tfg.app',
  appName: 'tfg-spotify-carlos',
  bundledWebRuntime: false,
  webDir: 'dist/tfg-spotify-carlos/browser',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    },
    "@capacitor/browser": {}
  },
};

export default config;