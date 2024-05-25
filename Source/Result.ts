export interface ResultBase<T, E> {
  isOk(): this is Ok<T, E>;
  isErr(): this is Err<T, E>;
}

export interface Ok<T, E> extends ResultBase<T, E> {
  value: T;
}

export interface Err<T, E> extends ResultBase<T, E> {
  error: E;
}

export type Result<T, E> = Ok<T, E> | Err<T, E>;

export function Ok<T, E>(value: T): Ok<T, E> {
  return { 
    isOk: () => true,
    isErr: () => false,
    value 
  };
}

export function Err<T, E>(error: E): Err<T, E> {
  return { 
    isOk: () => false,
    isErr: () => true,
    error 
  };
}