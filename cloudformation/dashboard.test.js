import { dashboard } from './dashboard';

describe('Dashboard', () => {
  test('returns cloudformation dashboard body', () => {
    expect(dashboard()).toMatchSnapshot();
  });
});
