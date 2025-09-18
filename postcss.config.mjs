import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwind(),      // IMPORTANT: function form, not string key
    autoprefixer(),
  ],
};
