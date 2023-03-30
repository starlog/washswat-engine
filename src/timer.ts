export function getTimer(timerTitle: string, firstStepName: string) {
  return new Timer(timerTitle, firstStepName);
}

export default class Timer {
  private readonly title: string;
  private timeList: any[];

  constructor(timerTitle: string, firstStepName: string) {
    this.title = timerTitle;
    this.timeList = [];
    this.time(firstStepName);
  }

  time(description: string): void {
    this.timeList.push({step: description, time: new Date().valueOf()});
  }

  toString(): string {
    let returnVal: string = '';
    let prevTime: number = 0;
    let firstTime: number = 0;
    this.timeList.forEach((x: any) => {
      if (prevTime !== 0) {
        returnVal += `(${this.numberWithCommas(x.time - prevTime)})==>${x.step}==`
        prevTime = x.time;
      } else {
        returnVal += `${x.step}==`
        prevTime = x.time;
        firstTime = x.time;
      }
    });
    returnVal = returnVal.slice(0, -2);
    returnVal = `${this.title} (total:${this.numberWithCommas(prevTime - firstTime)}) ${returnVal}`;
    return returnVal;
  }

  toJSON(): object {
    const returnObject: any = {
      title: this.title,
      totalDuration: 0,
      steps: [],
    };
    let prevTime: number = 0;
    let firstTime: number = 0;
    let prevTitle: string = '';
    this.timeList.forEach((x: any) => {
      if (prevTime !== 0) {
        returnObject.steps.push({from: prevTitle, to: x.step, duration: x.time - prevTime})
        prevTime = x.time;
        prevTitle = x.step;
      } else {
        prevTime = x.time;
        firstTime = x.time;
        prevTitle = x.step;
      }
    });
    returnObject.totalDuration = prevTime - firstTime;
    return returnObject;
  }

  numberWithCommas(numberValue: number): string {
    return numberValue.toString(10).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
