export interface ResultBase<T, E> {
  value: T | undefined;
  error: E | undefined;
  isOk(): this is Ok<T, E>;
  isErr(): this is Err<T, E>;
  map<U>(fn: (value: T) => U): Result<U, E>;
  mapErr<U>(fn: (error: E) => U): Result<T, U>;
}

export type Result<T, E> = Ok<T, E> | Err<T, E>;
export const Result = {
  and<
    Key extends keyof Results,
    Value extends Results[Key] extends Result<infer T, unknown> ? T : never,
    Error extends Results[Key] extends Result<unknown, infer E> ? E : never,
    Results extends Record<Key, Result<Value, Error>>,
  >(
    results: Results
  ): Result<{ 
    [K in Key]: 
      Results[K] extends 
      Result<infer T, unknown> ? T : never 
  }, Error[]> {
    const errors = Object
      .values<Result<Value, Error>>(results)
      .filter(Result.isErr)
      .map(result => result.error);

    if (errors.length > 0) {
      return Err.of(errors);
    }

    const entries = Object
      .entries<Result<Value, Error>>(results)
      .map(([key, value]) => ({ [key]: value.value }))
      .reduce((acc, value) => ({ ...acc, ...value }), {});
    
    return Ok.of(entries as { 
      [K in Key]: Results[K] extends Result<infer T, unknown> ? T : never 
    });
  },

  isErr<T, E>(result: Result<T, E>): result is Err<T, E> {
    return result.isErr();
  },

  isOk<T, E>(result: Result<T, E>): result is Ok<T, E> {
    return result.isOk();
  }
};

export class Ok<T, E> implements ResultBase<T, E> {
  private constructor(
    public value: T,
    public error: E | undefined = undefined
  ) {}

  public static of<T, E>(value: T): Ok<T, E> {
    return new Ok(value);
  }

  public static void<E>(): Ok<void, E> {
    return new Ok(undefined);
  }

  isOk(): this is Ok<T, E> {
    return true;
  }

  isErr(): this is Err<T, E> {
    return false;
  }
  
  map<U>(fn: (value: T) => U): Result<U, E> {
    return Ok.of(fn(this.value));
  }
  
  mapErr<U>(): Result<T, U> {
    return Ok.of(this.value);
  }
}

export class Err<T, E> implements ResultBase<T, E> {
  private constructor(
    public error: E,
    public value: T | undefined = undefined
  ) {}

  public static of<T, E>(error: E): Err<T, E> {
    return new Err(error);
  }

  public static void<T>(): Err<T, void> {
    return new Err(undefined);
  }

  isOk(): this is Ok<T, E> {
    return false;
  }

  isErr(): this is Err<T, E> {
    return true;
  }

  map<U>(): Result<U, E> {
    return Err.of(this.error);
  }

  mapErr<U>(fn: (error: E) => U): Result<T, U> {
    return Err.of(fn(this.error));
  }
}