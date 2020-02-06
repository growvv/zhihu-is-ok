# zhihu-is-ok
利用Github Action每隔30检查zhihu的状态并发布到Gist上。

[查看效果](https://gist.github.com/growvv/ebe0a05e695c05b4dad1a907cd51f4f5)

## 一、检查网站状态
使用axios发送get请求，检查返回的状态码。

为确保不会误报，每次请求3次。

```js
  let closed = true
  for (let i = 0; i < 3; i++) {
    await axios.get('https://www.zhihu.com').then(res => {
      if (res.status === 200) {
        closed = false
      }
    })
  }
  console.log(closed)
```

## 二、发布到GitHub Gist
使用gist-box库，使用方法见[官方文档](https://github.com/JasonEtco/gist-box)

```
const {GistBox} = require('gist-box')

const GIST_ID = '6445484d9c0dd5eca236b37413d022cc'
const TOKEN = 'xxx'
const box = new GistBox({ id: GIST_ID, token: TOKEN })
console.log(box)
await box.update({
    filename: 'zhihu_is_ok.md',
    content: content
})
```

## 三、编写workflow文件
设置定时任务，安装nodejs及依赖包，再运行index.js

```yml
name: Send Weather Mail

on:
  schedule:
    - cron: "*/30 * * * *"
  push:
    branches:
      - master

jobs:
  build:
    name: Check Site
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
        
    - name: Setup Node
      uses: actions/setup-node@v1
      with:
        node-version: '10.x'
        
    - name: 'Install NPM dependencies'
      run: 
        npm install axios moment gist-box dotenv dotenv-extended
        
    - name: Run
      run: node index.js
```
## 四、有待改进
1. 使用Action的环境变量将token藏起来

已解决：
```yml
    - name: Run
      run: node index.js
      env:
        GIST_ID: 'ebe0a05e695c05b4dad1a907cd51f4f5'
        TOKEN: ${{ secrets.token }}
```
将token存到项目的secrets里，在index.js引入环境变量。

2. box.update()貌似有频率限制，除了再生成一个token，不知道还有什么其他办法

## 参考链接
1. [Himself65-知乎今天倒闭了吗](https://github.com/Himself65/did-zhihu-close-down-today)
