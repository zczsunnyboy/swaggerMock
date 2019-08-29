# 项目描述

这是一个根据swagger生成api、mock数据的脚步工具

# 主要功能

1.生成前端mock数据<br>
2.生成api文档，可支持前端模块化开发<br>
3.通过脚本对比，生成后端更改swagger文档导致前后差异的文档<br>

## Available Scripts

before start the project directory, you can run :

### `npm install`

in the project directory, you can run :

### `npm start`

if you want to change some thing, you can run :

### `npm dev`

# 使用说明

- 可通过使用者的项目代理到[http://localhost:3300]，访问接口的形式访问mock服务，例如: http://localhost:3300/web/area/chinaArea.<br>
- /apiRoutes 目录下的api文档可用于项目模块化开发，默认生成在此项目目录下，可通过修改config文件（devApiOptions.configFiles）参数来生成对应项目的目录文件。例如：‘D:\\xxx\xxx’<br>
- 在此项目目录下通过对比前后两次'swaggermock.json' 会生成差异文件 ‘differenceDoc.text’<br>
- 注： 差异是根据后端定义的类来对比的，故生成的对比内容会较长<br>

# 项目配置

```js
swaggerOptions: {
    url: `http://localhost:${Port}/${swaggerMockFile}`, // swagger文件本地访问地址
    outputPath: '/mockRoutes', //生成swaggermock的目录
    blackList: [], // 不需要mock生成的接口
    turnOn: true, // 开关 关闭后不生成mock
    restartTime: 5000 // mock 比对一次的时间
},
devApiOptions: {
    url: `${hostUrl}/v2/api-docs`, // swagger-doc接口地址
    defaultFiles: '/apiRoutes', // 生成api的默认目录
    configFiles: '', // 自定义生成api目录
    blackList: [], // 不需要生成api接口
    turnOn: true, // 开关 关闭后不生成api目录
},
devProxyOptions: {
    proxyInfo: {
        [proxyHost]: {
            target: hostUrl,
            pathRewrite: { [`^${proxyHost}`]: proxyHost },
            changeOrigin: true
        }
    },
    turnOn: false // 开关 关闭后不使用代理 默认关闭， 开启会影响调用mock接口 
},
delayOptions: {
    turnOn: false, // 开关 关闭后不延迟加载mock接口 用于模拟网络
    time: 1000
},
successOptions: {
    turnOn: false, // 开关 关闭后不模拟因网络原因加载不成功
    rate: 0.2
},
loginOptions: {
    api: {
        url: '/web/xxxxxx',
        type: 'post'
    },
    data: {
        
    },
    turnOn: false // 开关 默认关闭 可能有些需要用到登录获取用户信息
},
userOptions: {
    file: '/user.json' // 用于记录登录后的用户信息
},
diffOptions: {
    blackList: ['tags', 'paths', 'definitions'], // 不需要记录的对象
    file: '/differenceDoc.text', // 用于记录前后两次swagger差异
    turnOn: true // 开关 关闭后不生成对比文件
}
```

详细参见 config.js

# 代码目录
```js
+-- mockRoutes/                                             --- mockApi打包目录
+-- apiRoutes/                                              --- 模块化使用api打包目录
+-- node_modules/                                           --- npm包目录
+-- middleware/                                             --- 中间件目录
|   +-- delaytime                                           --- 模拟mock接口网络延迟
|   +-- successrate                                         --- 模拟mock接口调用成功率
+-- utils/                                                  --- 方法库
|   +-- index                                               --- 公用方法
|   +-- storage                                             --- 本地文件存储读取
|   +-- diff                                                --- swaggermock.json对比方法
+-- http/                                                   --- 网络
|   +-- index                                               --- axios的配置
+-- config.js                                               --- 项目配置文件
+-- server.js                                               --- 项目启动文件
+-- swaggerServer.js                                        --- 处理swagger的服务
+-- turnExpressRouter.js                                    --- 将mockApi配置到express
+-- swaggermock.json                                        --- swagger.doc
+-- user.json                                               --- 用户登录信息
+-- differenceDoc.text                                      --- 新旧'swagger.doc'的对比输出文件
```                                       