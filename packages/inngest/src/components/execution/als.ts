import { type Context } from "../../types.js";

export interface AsyncContext {
  ctx: Context.Any;
}

/**
 * A local-only symbol used as a key in global state to store the async local
 * storage instance.
 */
const alsSymbol = Symbol.for("inngest:als");

/**
 * A type that represents a partial, runtime-agnostic interface of
 * `AsyncLocalStorage`.
 */
type AsyncLocalStorageIsh = {
  getStore: () => AsyncContext | undefined;
  run: <R>(store: AsyncContext, fn: () => R) => R;
};

/**
 * Retrieve the async context for the current execution.
 */
export const getAsyncCtx = async (): Promise<AsyncContext | undefined> => {
  return getAsyncLocalStorage().then((als) => als.getStore());
};

/**
 * Get a singleton instance of `AsyncLocalStorage` used to store and retrieve
 * async context for the current execution.
 */
export const getAsyncLocalStorage = async (): Promise<AsyncLocalStorageIsh> => {
  (globalThis as Record<string | symbol | number, unknown>)[alsSymbol] ??=
    new Promise<AsyncLocalStorageIsh>(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
      async (resolve) => {
        try {
          const { AsyncLocalStorage } = await import("node:async_hooks");

          resolve(new AsyncLocalStorage<AsyncContext>());
        } catch (err) {
          console.warn(
            "node:async_hooks is not supported in this runtime. Experimental async context is disabled."
          );

          resolve({
            getStore: () => undefined,
            run: (_, fn) => fn(),
          });
        }
      }
    );

  return (globalThis as Record<string | symbol | number, unknown>)[
    alsSymbol
  ] as Promise<AsyncLocalStorageIsh>;
};
