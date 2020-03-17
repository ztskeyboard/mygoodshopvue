
/**
 * 导入路径时候会非常麻烦，所以我们在这里给它设计别名，这样我们就不用加../了
 * 路径直接填写别名，方便快捷
 */
module.exports = {
    configureWebpack: {
      resolve: {
        alias: {
          'assets': '@/assets',
          'common': '@/common',
          'components': '@/components',
          'network': '@/network',
          'views': '@/views',
        }
      }
    }
  }
  
  