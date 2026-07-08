import { LogLevel } from './LogLevel';

export interface LogConfig {
  level: LogLevel;
  enableStorage: boolean;
  enableUpload: boolean;
}

export const DefaultLogConfig: LogConfig = {
  level: LogLevel.Info,
  enableStorage: true,
  enableUpload: false,
};
