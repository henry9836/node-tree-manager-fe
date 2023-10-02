import { TimeSinceCreatedPipePipe } from './time-since-created-pipe.pipe';

describe('TimeSinceCreatedPipePipe', () => {
  it('create an instance', () => {
    const pipe = new TimeSinceCreatedPipePipe();
    expect(pipe).toBeTruthy();
  });
});
