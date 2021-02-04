
 
/**
 * Este é o arquivo de configuração do webpack.
 * 
 * Nem eu entendo, então surgiro que não mexa!
 * 
 * 
 */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs');

var retorno = {
  mode: 'development',
  entry: './src/main.js',

  output: {
    path: path.resolve(__dirname, 'docs')
  },
  
  devServer: {
    contentBase: "../../public_html",
  },

  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.ProvidePlugin({
      _: "underscore"
    }),
    //new MiniCssExtractPlugin({ filename:'styles.[chunkhash].css' }),
    //new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }) //apagando o index.html
  ],

  module: {
    rules: [
      //compacta os JSs
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'babel-loader',
        options: {
          "plugins": [
            ["@babel/plugin-proposal-class-properties", {loose:true}]
          ]
        }
      },

      //transforma EJS em PHP
      /*{
        test: /\.hbs$/,
        include: [path.resolve(__dirname, 'hbs')],
        loader: 'ejs-loader',
        options: {
          variable: 'data',
          interpolate : '\\{\\{(.+?)\\}\\}',
          evaluate : '\\[\\[(.+?)\\]\\]'
        }
      },*/

      //compacta os CSSs
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'css')],

        use: [ {
          loader: "style-loader"
        },
        {
          loader: "css-loader",

          options: {
            sourceMap: true
          }
        }
      ]
    }]
  },

  optimization: {
    minimizer: [new TerserPlugin()],

    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        }
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: false
    }
  }
}

function carregaTodasAsPaginas() {
  fs.readdirSync("./hbs/").forEach(file => { //isso é um for para atividade assíncrona
      var sem_extensão = file.replace(".hbs","");

      console.log(`${file} foi para ${sem_extensão}`);

      /**
       * adiciona a pagina como plugin
       */
      retorno.plugins[retorno.plugins.length] = new HtmlWebpackPlugin({
        template: "./hbs/" + file,
        inject: false,
        filename: sem_extensão + ".php",
      
        templateParameters: require("./src/headerbars/variaveis.js"),
      })
    });

}

carregaTodasAsPaginas();

module.exports = retorno;