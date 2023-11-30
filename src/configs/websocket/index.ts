import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import type { AuthorizeRequest, AuthorizeResponse } from '@deriv/api-types';
import {
  TSocketEndpointNames,
  TSocketRequestProps,
  TSocketResponse,
  TSocketSubscribableEndpointNames,
} from './types';
import { Observable } from 'rxjs';
import { getIsBrowser, getServerConfig } from '@site/src/utils';

export type TDerivApi = {
  send: (...requestData: unknown[]) => Promise<unknown>;
  subscribe: (...requestData: unknown[]) => Observable<object>;
  authorize: (requestData: AuthorizeRequest) => Promise<AuthorizeResponse>;
};

const PING_INTERVAL = 12000;

export class ApiManager {
  private socket: WebSocket;
  private derivApi: TDerivApi;
  private pingInterval: NodeJS.Timer;

  public static instance: ApiManager;
  public static getInstance() {
    if (!ApiManager.instance) {
      ApiManager.instance = new ApiManager();
    }
    return ApiManager.instance;
  }

  public init() {
    if (!this.socket) {
      const { serverUrl, appId } = getServerConfig();
      this.socket = new WebSocket(`wss://${serverUrl}/websockets/v3?app_id=${appId}`);
    }
    this.derivApi = new DerivAPIBasic({ connection: this.socket });
    this.registerKeepAlive();
  }

  public augmentedSend<T extends TSocketEndpointNames>(
    request?: TSocketRequestProps<T> extends never ? undefined : TSocketRequestProps<T>,
  ): Promise<TSocketResponse<T>> {
    return this.derivApi.send(request) as Promise<TSocketResponse<T>>;
  }

  public augmentedSubscribe<T extends TSocketSubscribableEndpointNames>(
    request?: TSocketRequestProps<T> extends never ? undefined : TSocketRequestProps<T>,
  ): Observable<TSocketResponse<T>> {
    return this.derivApi.subscribe(request) as Observable<TSocketResponse<T>>;
  }

  public authorize(token: string) {
    return this.derivApi.authorize({ authorize: token });
  }
  public logout() {
    this.derivApi.send({ logout: 1 });
  }

  private registerKeepAlive() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    this.socket.addEventListener('open', () => {
      this.pingInterval = setInterval(() => {
        this.socket.send(JSON.stringify({ ping: 1 }));
      }, PING_INTERVAL);
    });

    this.socket.addEventListener('close', () => {
      clearInterval(this.pingInterval);
    });

    this.socket.addEventListener('error', () => {
      clearInterval(this.pingInterval);
    });
  }

  public reset(appId: string, url: string, registerKeepAlive = false) {
    this.socket = new WebSocket(`wss://${url}/websockets/v3?app_id=${appId}`);
    this.derivApi = new DerivAPIBasic({ connection: this.socket });
    if (registerKeepAlive) {
      this.registerKeepAlive();
    }
  }

  set connection(newConnection: WebSocket) {
    this.socket = newConnection;
  }

  get connection() {
    return this.socket;
  }

  set api(value: TDerivApi) {
    this.derivApi = value;
  }

  get api() {
    return this.derivApi;
  }
}
let apiManager: ApiManager;
if (getIsBrowser()) {
  apiManager = ApiManager.getInstance();
}

export default apiManager;
