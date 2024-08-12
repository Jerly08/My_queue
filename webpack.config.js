const path = require('path');

module.exports = {
  entry: './src/index.tsx', // Entry point aplikasi Anda
  output: {
    path: path.resolve(__dirname, 'dist'), // Folder output untuk bundle
    filename: 'bundle.js', // Nama file output
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // Resolusi file yang akan diproses
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Proses semua file .ts dan .tsx
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development', // Ubah ke 'production' untuk produksi
};