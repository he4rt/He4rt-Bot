const env = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`missing env key: ${key}`)
  }
  return value
}

const keys = [
  "DEBUG",
  "AUTH_TOKEN",
  "COMMAND_PREFIX",
  "ADMIN_ROLE",
  "DONATOR_ROLE",
  "MUTED_ROLE",
  "PUNISHMENT_CHAT",
  "RULES_CHAT",
  "NOTIFY_ROLE",
  "GUILD_ID",
] as const

export default Object.fromEntries(keys.map((key) => [key, env(key)])) as {
  [key in typeof keys[number]]: string
}
