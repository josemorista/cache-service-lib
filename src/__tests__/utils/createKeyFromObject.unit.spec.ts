import { createKeyFromObject } from '../../utils/createKeyFromObject';

describe('CreateKeyFromObject', () => {
  it('Should create same key to objects with same attributes', () => {
    const obj1 = {
      a: 1,
      call() {
        console.log('call');
      },
    };
    const obj2 = {
      a: 1,
      call() {
        console.log('call');
      },
    };
    expect(createKeyFromObject(obj1)).toBe(createKeyFromObject(obj2));
  });

  it('Should create different keys to objects with different values', () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 1 };
    expect(createKeyFromObject(obj1)).not.toBe(createKeyFromObject(obj2));
  });

  it('Should create different keys to objects with different functions', () => {
    const obj1 = {
      a: 1,
      call() {
        console.log('call');
      },
    };
    const obj2 = {
      a: 1,
      call() {
        console.log('call_');
      },
    };
    expect(createKeyFromObject(obj1)).not.toBe(createKeyFromObject(obj2));
  });
});
