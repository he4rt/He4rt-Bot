import { api } from "./api"

export const getBalance = async (discordId: string): Promise<number> => {
  const { data } = await api.get(`users/${discordId}`)
  return parseInt(data.money, 10)
}

export const addValueToBalance = async (
  discordId: string,
  value: number
): Promise<void> => {
  await api.post(`/users/${discordId}/money/add`, { value })
}

export const removeValue = async (
  discordId: string,
  value: number
): Promise<void> => {
  await api.post(`/users/${discordId}/money/reduce`, { value })
}
