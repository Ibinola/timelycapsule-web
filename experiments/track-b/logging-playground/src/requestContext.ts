import { AsyncLocalStorage } from "node:async_hooks";

type RequestContext = {
  requestId: string;
};

const store = new AsyncLocalStorage<RequestContext>();

export const runWithRequestContext = <T>(
  context: RequestContext,
  callback: () => T,
): T => store.run(context, callback);

export const getRequestId = (): string | undefined => store.getStore()?.requestId;
