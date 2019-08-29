// can modify all config

const hostUrl = 'http://10.59.76.169:8901';
const swaggerMockFile = 'swaggermock.json';
const Port = process.env.PORT || 3300;
const proxyHost = '/web';

module.exports = {
    port: Port, // 端口号
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
    },
    swaggerMockFile, // 请求swagger-doc生成的本地json
    hostUrl, // 服务端地址
    proxyHost // 代理名
}