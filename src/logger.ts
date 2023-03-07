import moment from 'moment-timezone';

export interface loggerOption {
  level: string,
  prompt: string,
  timestamp: boolean,
}

export interface loggerEntry {
  name: string,
  option: loggerOption,
}

export interface loggerResult {
  status: boolean,
  message: string,
}

const logLevel = ['all', 'debug', 'info', 'warn', 'error', 'fatal', 'off'];

//--------------------------------------------------------------------------------------------------
class FelixLogger {
  public name: string;
  public prompt: string;
  public isTimeStamp: boolean;
  public level: string;

  constructor(name: string) {
    this.name = name;
    this.prompt = name;
    this.isTimeStamp = false;
    this.level = 'error';
  }

  setLevel(level: string) {
    if (logLevel.indexOf(level) === -1) {
      return { status: false, message: `Level must be one of ${JSON.stringify(logLevel)}` };
    } else {
      this.level = level;
      return { status: true, message: 'success' };
    }
  }

  setPrompt(prompt: string) {
    this.prompt = prompt;
    return { status: true, message: 'success' };
  }

  setIsTimestamp(isTimeStamp: boolean) {
    this.isTimeStamp = isTimeStamp;
    return { status: true, message: 'success' };
  }

  print(data: unknown, functionLevel: string) {
    const setIndex = logLevel.indexOf(this.level);
    const functionIndex = logLevel.indexOf(functionLevel);
    if (setIndex <= functionIndex) {
      if(functionLevel === 'err' || functionLevel === 'fatal'){
        console.error(`${this.isTimeStamp ? '['+moment.tz('Asia/Seoul').toISOString()+']' : ''}[${this.prompt}] ${data}`);
      }else{
        console.log(`${this.isTimeStamp ? '['+moment.tz('Asia/Seoul').toISOString()+']' : ''}[${this.prompt}] ${data}`);
      }
    }
  }

  debug(data: unknown) {
    this.print(data, 'debug');
  }

  info(data: unknown) {
    this.print(data, 'info');
  }

  warn(data: unknown) {
    this.print(data, 'warn');
  }

  error(data: unknown) {
    this.print(data, 'error');
  }

  fatal(data: unknown) {
    this.print(data, 'fatal');
  }
}


export const logList: FelixLogger[] = [];

//--------------------------------------------------------------------------------------------------
function findMyLogger(name: string): FelixLogger | null {
  for (const element of logList) {
    if (element.name === name) {
      return element;
    }
  }
  return null;
}

//--------------------------------------------------------------------------------------------------
export function getLogger(loggerName: string) {
  let myLogger = findMyLogger(loggerName);

  if (!myLogger) {
    myLogger = new FelixLogger(loggerName);
    logList.push(myLogger);
  }
  return myLogger;
}

//--------------------------------------------------------------------------------------------------
export function setLogLevel(loggerName: string, level: string): loggerResult {
  if (logLevel.indexOf(level) !== -1) {

    if (loggerName === 'all') { // apply to all
      logList.forEach((x) => {
        x.level = level;
      });
      return { status: true, message: 'success' };
    } else {
      let myLogger = findMyLogger(loggerName);
      if (myLogger) {
        myLogger.level = level;
        return { status: true, message: 'success' };
      } else {
        return { status: false, message: `Cannot find logger name:${loggerName}` };
      }
    }
  } else { // level string does not match
    return {
      status: false,
      message: `Invalid level data:${level}. This should be one of ${JSON.stringify(logLevel)}`
    };
  }
}


