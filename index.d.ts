import { AxiosAdapter } from 'axios';
import { Agent } from 'http2-wrapper';

/**
 * Configuration options for the HTTP/2 Axios adapter.
 */
export interface HTTP2AdapterConfig {
  /**
   * Optional custom HTTP/2 agent.
   */
  agent?: Agent;

  /**
   * Whether to force HTTP/2 usage without ALPN negotiation.
   */
  force?: boolean;
}

/**
 * Creates an Axios adapter that conditionally uses HTTP/2.
 *
 * @param adapterConfig Optional configuration for HTTP/2.
 * @returns An Axios adapter function.
 */
declare function createHTTP2Adapter(
  adapterConfig?: Partial<HTTP2AdapterConfig>
): AxiosAdapter;

export default createHTTP2Adapter;
