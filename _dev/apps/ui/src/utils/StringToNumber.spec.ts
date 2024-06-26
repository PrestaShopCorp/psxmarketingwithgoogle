import stringToNumber from '@/utils/StringToNumber';

describe('Testing if stringToBoolean return valid value', () => {
  it('should return value of itself if he is not a string number', () => {
    const value = {myKey: 'hello world'};
    expect(stringToNumber(value)).toStrictEqual(value);
  });

  it('should return number if value is float string number', () => {
    expect(stringToNumber('5.18')).toStrictEqual(5.18);
  });

  it('should return number if value is integer string number', () => {
    expect(stringToNumber('6')).toStrictEqual(6);
  });

  it('should return number if value is negative float string number', () => {
    expect(stringToNumber('-5.18')).toStrictEqual(-5.18);
  });

  it('should return number if value is negative integer string number', () => {
    expect(stringToNumber('-6')).toStrictEqual(-6);
  });
});
