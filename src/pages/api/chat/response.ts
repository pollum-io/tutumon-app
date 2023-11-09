import axios from 'axios'
import { ApiError } from 'next/dist/server/api-utils'
import OpenAI from 'openai'

export async function getOpenAiResponse({ input }: { input: string }) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  })

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: input }],
      model: 'gpt-4',
    })
    return chatCompletion
  } catch (error) {
    throw new ApiError(500, 'Internal Server Error')
  }
}

export async function getTrainedAiResponse({ input }: { input: string }) {
  try {
    const aiResponse = await axios.post(
      `http://127.0.0.1:8000/chat`,
      { input: input },
      {
        timeout: 40000,
      },
    )
    const chatCompletion = await aiResponse.data

    const finalResponse = {
      choices: [{ message: { content: chatCompletion.response } }],
    }
    return finalResponse
  } catch (error) {
    throw new ApiError(500, 'Internal Server Error')
  }
}

export async function createPersonality({ input }: { input: any }) {
  try {
    const res = await axios.post(
      `https://3cde-178-166-73-115.ngrok.io/create_personality`,
      { input: input },
      {
        timeout: 40000,
      },
    )

    const persona = await res.data

    return persona
  } catch (error) {
    throw new ApiError(500, 'Internal Server Error')
  }
}
