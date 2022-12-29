import crypto from 'crypto';

export const createKeyFromObject = (object: Object) => {
  const hash = crypto
    .createHash('md5')
    .update(
      JSON.stringify(object, function (key, value) {
        if (key.startsWith('_')) return undefined;
        if (typeof value === 'function') return value.toString();
        return value;
      })
    )
    .digest('hex');
  return hash;
};
