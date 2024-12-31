export interface Config {
  secret: string;
  port: number;
}


export function getConfig(config: Partial<Config>): Config {
  return {
    secret: config.secret ?? "",
    port: config.port ?? 3220,
  }
}
