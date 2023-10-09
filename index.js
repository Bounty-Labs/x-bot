const { Twitter, SearchType, ObjectConverter } = require("bountyweb3twitterts")
// const logger = require("npmlog")
const accounts = require("./accounts.json")
require('dotenv').config()
const executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const login = async () => {
  const index = Math.floor(Math.random() * accounts.length)
  const acc = accounts[index]
  const twitter = await Twitter.login({
    ...acc,
    puppeteerOptions: {
      executablePath,
      userDataDirectory: `./data/${acc.username}`,
      headless: true,
      proxy: {
        server: "http://127.0.0.1:10809"
      }
    },
    /* debugOptions: {
      outputResponse: {
        enable: process.env.DEBUG_OUTPUT_RESPONSE === 'true',
        outputDirectory:
          process.env.DEBUG_RESPONSE_DIRECTORY || './data/responses',
        onResponse: (response) => {
          logger.info(`📦 Response: ${response.type} ${response.name}`)
        },
      },
    }, */
  })
  return twitter
}
const crawlComment = async (twitter, url) => {
  try {
    console.log(2222, url)
    const page = await twitter.scraper.getScraperPage()
    await page.goto(url)
    while (true) {
      const response = page.shiftResponse('GET', 'GRAPHQL', 'tweetDetail')
      if (!response) {
        await page.scrollToBottom()
        continue
      }
      const entries = response.data.threaded_conversation_with_injections_v2.instructions[0].entries
      const comment = entries[entries.length - 1]
      const commentInfo = ObjectConverter.convertToStatus(comment.content.itemContent.tweet_results.result)

      if (commentInfo) {
        return commentInfo
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const init = async () => {
  const twitter = await login()
  const urls = ["https://twitter.com/Clyde_Kuo/status/1710946612997144664", "https://twitter.com/gaoyao1005/status/1711177904262918452"]
  for (let i = 0; i < urls.length; i++) {
    const res = await crawlComment(twitter, urls[i])
    console.log(res)
  }
  await twitter.close()
}
init()