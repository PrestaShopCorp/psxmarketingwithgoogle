import {stringToBoolean, booleanToString} from '@/utils/StringToBoolean';

describe('Testing if stringToBoolean return valid value', () => {
  it('should return value if not string', () => {
    const value = {myKey: 'hello world'};
    expect(stringToBoolean(value)).toStrictEqual(value);
  });

  it('should return true if string is "true"', () => {
    expect(stringToBoolean('true')).toStrictEqual(true);
  });

  it('should return false if string is "false"', () => {
    expect(stringToBoolean('false')).toStrictEqual(false);
  });

  it('should return itself if string is not "true" or "false"', () => {
    const value = 'hello world';
    expect(stringToBoolean(value)).toStrictEqual(value);
  });
});

describe('Testing if stringToBoolean return valid value', () => {
  it('should return value if not boolean', () => {
    const value = 'true';
    expect(booleanToString(value)).toStrictEqual(value);
  });

  it('should return "true" if bool is true', () => {
    expect(booleanToString(true)).toStrictEqual('true');
  });

  it('should return "false" if bool is false', () => {
    expect(booleanToString(false)).toStrictEqual('false');
  });
});
