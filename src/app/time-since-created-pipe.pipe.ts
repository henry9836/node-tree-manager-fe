import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeSinceCreatedPipe'
})
export class TimeSinceCreatedPipePipe implements PipeTransform {

  transform(value: string): string {
    const currentTime = new Date();
    const createdTime = new Date(value);

    const timeDifference = currentTime.getTime() - createdTime.getTime();
    const seconds = Math.floor(timeDifference / 1000);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  }

}
