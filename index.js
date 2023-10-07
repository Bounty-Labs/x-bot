const { Twitter, SearchType } = require("@book000/twitterts")
// const logger = require("npmlog")
const { XMLBuilder, XMLParser } = require('fast-xml-parser')

const fs = require("fs")
require('dotenv').config()
function isFullUser(user) {
  return 'screen_name' in user
}
function sanitizeFileName(fileName) {
  // Windows / Linuxで使えない文字列をアンダーバーに置き換える
  // スペースをアンダーバーに置き換える
  return fileName.replace(/[\\/:*?"<>| ]/g, '').trim()
}
function getContent(tweet) {
  let tweetText = tweet.full_text
  if (!tweetText) {
    throw new Error('tweet.full_text is empty')
  }
  const mediaUrls = []
  if (tweet.extended_entities && tweet.extended_entities.media) {
    for (const media of tweet.extended_entities.media) {
      tweetText = tweetText.replace(media.url, '')
      mediaUrls.push(media.media_url_https)
    }
  }
  return [
    tweetText.trim(),
    mediaUrls.length > 0 ? '<hr>' : '',
    mediaUrls.map((url) => `<img src="${url}"><br>`).join('\n'),
  ].join('\n')
}
const init = async () => {
  const twitter = await Twitter.login({
    username: process.env.TWITTER_USERNAME,
    password: process.env.TWITTER_PASSWORD,
    otpSecret: process.env.TWITTER_AUTH_CODE_SECRET,
    puppeteerOptions: {
      executablePath: process.env.CHROMIUM_PATH,
      userDataDirectory: process.env.USER_DATA_DIRECTORY || './data/userdata',
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
  try {
    /* const url="https://twitter.com/TXBoater/status/1710091125401276743"
    const page = await twitter.scraper.getScraperPage()
    await page.goto(url) */
    const o=await twitter.getUserByUserId({userId:"@MayoMayoMe"})
    console.log(o)
    return
    const searchWordPath = process.env.SEARCH_WORD_PATH || 'data/searches.json'
    const searchWords = JSON.parse(
      fs.readFileSync(searchWordPath, 'utf8'),
    )
    for (const key in searchWords) {
      const searchWord = searchWords[key]
      const startAt = new Date()
      console.info(`🔎 Searching: ${searchWord}`)
      const builder = new XMLBuilder({
        ignoreAttributes: false,
        format: true,
      })

      const statuses = await twitter.searchTweets({
        query: searchWord,
        searchType: SearchType.LIVE,
      })
      console.log(333, statuses)
      const items = statuses
        .filter((status) => isFullUser(status.user))
        .map((status) => {
          if (!isFullUser(status.user)) {
            throw new Error('status.user is not FullUser')
          }

          // タイトルは投稿日にする
          // 微妙だけど、とりあえず9時間足す
          const title = new Date(
            new Date(status.created_at).getTime() + 9 * 60 * 60 * 1000,
          )
            .toISOString()
            .replace(/T/, ' ')
            .replace(/Z/, '')
            .replace(/\.\d+$/, '')

          const content = getContent(status)

          return {
            title,
            link:
              'https://twitter.com/' +
              status.user.screen_name +
              '/status/' +
              status.id_str,
            'content:encoded': content,
            author: status.user.name + ' (@' + status.user.screen_name + ')',
            pubDate: new Date(status.created_at).toUTCString(),
          }
        })
        .filter((item) => item != null)

      const obj = {
        '?xml': {
          '@_version': '1.0',
          '@_encoding': 'UTF-8',
        },
        rss: {
          '@_version': '2.0',
          '@_xmlns:dc': 'http://purl.org/dc/elements/1.1/',
          '@_xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
          '@_xmlns:atom': 'http://www.w3.org/2005/Atom',
          channel: {
            title: key,
            description: searchWord,
            link:
              'https://twitter.com/search?q=' +
              encodeURIComponent(searchWord) +
              '&f=live',

            generator: 'book000/twitter-rss',
            language: 'ja',
          },
          item: items,
        },
      }

      const feed = builder.build(obj)

      const filename = sanitizeFileName(key)
      fs.writeFileSync('output/' + filename + '.xml', feed.toString())
      const endAt = new Date()
      console.info(
        `📝 Generated: ${filename}.xml. Found ${items.length} items (${endAt.getTime() - startAt.getTime()
        }ms)`,
      )
    }
  } catch (e) {
    console.error('Error', e)
  } finally {
    // await twitter.close()
  }
}
init()