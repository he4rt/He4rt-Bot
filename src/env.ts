const env = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`missing env key: ${key}`);
  }
  return value;
};

const keys = [
  "ADMIN_ROLE",
  "DONATOR_ROLE",
  "MUTED_ROLE",
  "PUNISHMENT_CHAT",
  "RULES_CHAT",
  "NOTIFY_ROLE",
  "AUTH_TOKEN",
  "GUILD_ID",
  "COMMAND_PREFIX",
  "DEBUG",
] as const;

export default Object.fromEntries(keys.map((key) => [key, env(key)])) as {
  [key in typeof keys[number]]: string;
};
