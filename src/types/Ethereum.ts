export default interface Ethereum {
  send(arg0: string): Promise<Array<string>>;
  enable(): Promise<any>;
  request(args: RequestArguments): Promise<unknown>;
}

export interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

export interface ProviderRpcError extends Error {
  code: number;
  data?: unknown;
}

export interface ProviderMessage {
  readonly type: string;
  readonly data: unknown;
}
