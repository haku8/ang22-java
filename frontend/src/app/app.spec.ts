import { App } from './app';

describe('App', () => {
  it('should create the app', () => {
    expect(App).toBeTruthy();
  });

  it('should expose the root component class', () => {
    expect(App.name).toBe('App');
  });
});
