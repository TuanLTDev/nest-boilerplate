export type KeyPair = {
  privateKey: string;
  publicKey: string;
};

export type Constructor<T = any, Arguments extends unknown[] = any[]> = new (...arguments_: Arguments) => T;
export type WrapperType<T> = T;
