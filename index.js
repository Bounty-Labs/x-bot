const { Twitter, SearchType, ObjectConverter } = require("bountyweb3twitterts")
// const logger = require("npmlog")
const { Sequelize, Op } = require('sequelize');
const DB = require("./db/db")
const moment = require("moment")
const db = new DB()
const accounts = require("./accounts.json")
require('dotenv').config()
const executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

let twitter = null
const login = async () => {
  const index = Math.floor(Math.random() * accounts.length)
  const acc = accounts[index]
  const twitter = await Twitter.login({
    ...acc,
    puppeteerOptions: {
      executablePath,
      userDataDirectory: `./data/${acc.username}`,
      headless: false,
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
      const comment = entries[0]
      const commentInfo = ObjectConverter.convertToStatus(comment.content.itemContent.tweet_results.result)

      if (commentInfo) {
        return commentInfo
      }
    }
  } catch (error) {
    console.error(error)
  }
}


const crawlMentions = async () => {
  try {
    const page = await twitter.scraper.getScraperPage()
    await page.goto("https://twitter.com/notifications/mentions")
    while (true) {
      const response = page.shiftResponse('GET', 'REST', 'v2notificationsMentions')
      if (!response) {
        await page.scrollToBottom()
        continue
      }
      const existListTemp = await db.mention.findAll({
        attributes: ['id_str'],
        where: {
          id_str: {
            [Op.in]: Object.keys(response.globalObjects.tweets)
          }
        }
      })
      const existList = existListTemp.map(i => i.id_str)
      for (let key in response.globalObjects.tweets) {
        if (existList.includes(key)) {
          continue
        }
        const item = response.globalObjects.tweets[key]
        await db.mention.findOrCreate({
          where: { id_str: item.id_str },
          defaults: item
        })

      }
      if (existList.length) {
        break
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const crawlUser = async (id_list) => {
  const userList = await db.user.findAll({
    where: {
      user_id_str: {
        [Op.in]: id_list
      }
    }
  })
  const obj = {}
  userList.forEach(user => {
    obj[user.user_id_str] = user
  })
  const time = moment()
  for (let i = 0; i < id_list.length; i++) {
    const id = id_list[i]
    if (obj[id] && moment(obj[id].update_at).isAfter(time.startOf('day'))) {
      continue
    }
    const userInfo = await twitter.getUserByUserId({ userId: id })
    const data = {
      user_id_str: id,
      followers_count: userInfo.followers_count,
      screen_name: userInfo.screen_name,
      update_at: time.format()
    }
    await db.user.bulkCreate([data], { updateOnDuplicate: ["followers_count", "screen_name", "update_at"] })
    /*   if (obj[id]) {
        const tempUser = obj[id]
        tempUser.followers_count = userInfo.followers_count
        tempUser.screen_name = userInfo.screen_name
        tempUser.update_at = time.format()
        await tempUser.save()
      } else {
        await db.user.create({
          user_id_str: id,
          followers_count: userInfo.followers_count,
          screen_name: userInfo.screen_name,
          update_at: time.format()
        })
      } */
  }
}

const init = async () => {
  twitter = await login()
  await db.syncModel()
  await crawlMentions()
  const whereStr = '%ost'
  const mentionList = await db.mention.findAll({
    where: {
      full_text: {
        [Op.like]: whereStr
      }
    },
  })
  const id_list = mentionList.map(item => item.in_reply_to_user_id_str)
  await crawlUser(id_list)
  const [results, metadata] = await db.sequelize.query(
    `SELECT * FROM mention JOIN user ON mention.in_reply_to_user_id_str = user.user_id_str where full_text like "${whereStr}" and followers_count>1166220`
  );
  console.log(results)
  await twitter.close()
}


init()