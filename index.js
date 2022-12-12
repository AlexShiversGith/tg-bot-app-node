const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
 
const token = '5745684653:AAG-3fP-JjZr39TnIq2OdlzeOxtDob-mgpI';
const webAppUrl = 'https://shivers-tg-bot.netlify.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json())
app.use(cors())
 
bot.on('message', async function async (msg) {
  
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === 'Fuck you') {
    await bot.sendMessage(chatId, 'Fuck you')
  }

  if (text === '/start') {
      await bot.sendMessage(chatId, 'Tap button inside inputfield', {
          reply_markup: {
              keyboard: [
                [{text: 'fill out the form', web_app: {url: webAppUrl + '/form'}}]
              ]
          }
      })
  }

//  await bot.sendMessage(chatId, 'tap button', {
//    reply_markup: {
//     inline_keyboard: [
//        [{text: 'Buy', web_app: {url: webAppUrl}}]
//      ]
//    }
//  })

  if (msg?.web_app_data?.data){
    try {
      const data = JSON.parse(msg?.web_app_data?.data)
      await bot.sendMessage(chatId, 'Thanks for callback')
      await bot.sendMessage(chatId, 'U country: ' + data?.country)
      await bot.sendMessage(chatId, 'U street: ' + data?.street)

      setTimeout(() => {
        bot.sendMessage(chatId, 'U info')
      }, 1000)
    } catch (e) {
      console.log(e)
    }
  }

});

app.post( async (req, res) => {
  const {queryId, products, totalPrice} = req.body
  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Sucsess',
      input_message_content: {message_text: 'Congrateful. Thanks for you choice. Total price: ' + totalPrice}
    })
    return res.status(200).json({})
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'failed',
      input_message_content: {message_text: 'Failed'}
    })
    return res.status(500).json({})
  }
})

const PORT = 8800;
app.listen(PORT, () => console.log('server get started on PORT' + PORT))