import axios from "axios"
import env from "../env"

export const api = axios.create({
  baseURL: env.HE4RT_API,
  timeout: 6000,
  headers: { Authorization: process.env.HE4RT_TOKEN },
})
