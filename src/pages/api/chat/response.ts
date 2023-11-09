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
      model: 'gpt-3.5-turbo',
    })

    return chatCompletion
  } catch (error) {
    alert(error)
    throw new ApiError(500, 'Internal Server Error')
  }
}

export async function getTrainedAiResponse({ input }: { input: string }) {
  try {
    const aiResponse = await axios.post(
      `http://ec2-34-204-81-241.compute-1.amazonaws.com:4000/chat`,
      {
        input: input,
        personality:
          'You are like a living embodiment of whimsy, a plastic avatar with a hollow gaze, radiating simplicity from your blocky form amidst a backdrop as vibrant as your bold, red torso.',
      },
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
      `http://ec2-34-204-81-241.compute-1.amazonaws.com:4000/create_personality`,
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
