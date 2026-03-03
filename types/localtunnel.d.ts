declare module 'localtunnel' {
  interface TunnelOptions {
    port: number;
    host?: string;
    subdomain?: string;
  }
  interface Tunnel {
    url: string;
    close(): void;
    on(event: string, listener: (...args: any[]) => void): this;
  }
  function localtunnel(options: TunnelOptions): Promise<Tunnel>;
  export = localtunnel;
}
