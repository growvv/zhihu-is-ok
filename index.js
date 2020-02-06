require('dotenv').config()

const axios = require('axios')
const moment = require('moment')
const {GistBox} = require('gist-box')

const { GIST_ID, TOKEN } = process.env

async function tools(){
  let closed = true
  for (let i = 0; i < 3; i++) {
    await axios.get('https://www.zhihu.com').then(res => {
      if (res.status === 200) {
        closed = false
      }
    })
  }
  console.log(closed)

  const time = moment().format('YYYY-MM-DD kk:mm ZZ')
  console.log(time)

  let content = ''
  if (closed) {
    content = `
    知乎真的倒闭了！！！
    Zhihu.com have closed down today!!!😊
    ${time}`
  } else {
      content = `
      知乎还没有倒闭……
      Zhihu.com haven't closed down today... 😔
      ${time}`
  }

  const box = new GistBox({ id: GIST_ID, token: TOKEN })
  console.log(box)
  await box.update({
    filename: 'zhihu_is_ok.md',
    content: content
  })
}


tools()
