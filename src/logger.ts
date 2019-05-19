export type LogFunction = (
  bot: string,
  message: string,
  data?: any
) => Promise<void>;
export type BotLogFunction = (message: string, data?: any) => Promise<void>;

export interface Logger {
  logError: LogFunction;
  logInfo: LogFunction;
}

export interface BotLogger {
  logError: BotLogFunction;
  logInfo: BotLogFunction;
}
