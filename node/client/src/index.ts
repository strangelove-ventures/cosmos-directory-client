import type { DirectoryChain } from "cosmos-directory-types/chain";
import type { DirectoryChainValidators } from "cosmos-directory-types/chain-validators";
import type { DirectoryChains } from "cosmos-directory-types/chains";
import type { DirectoryStatus } from "cosmos-directory-types/status";
import type { DirectoryValidator } from "cosmos-directory-types/validator";
import type { DirectoryValidators } from "cosmos-directory-types/validators";
import { fetch as $fetch } from "node-fetch-native";

export const DEFAULT_PROTOCOL = "https";
export const DEFAULT_DOMAIN = "cosmos.directory";
export const TESTNET_DOMAIN = "testcosmos.directory";

export interface DirectoryClientProps {
  protocol: string;
  domain: string;
  fetch: typeof fetch;
  fetchOpts: RequestInit;
}

export class DirectoryClient implements DirectoryClientProps {
  protocol = DEFAULT_PROTOCOL;
  domain = DEFAULT_DOMAIN;
  fetch = $fetch;
  fetchOpts = {};

  constructor(args: Partial<DirectoryClientProps> = {}) {
    this.protocol = args.protocol || this.protocol;
    this.domain = args.domain || this.domain;
    this.fetch = (args.fetch || this.fetch).bind(undefined);
    this.fetchOpts = args.fetchOpts || this.fetchOpts;
  }

  get #chainsEndpoint() {
    return `${this.protocol}://chains.${this.domain}`;
  }

  get #statusEndpoint() {
    return `${this.protocol}://status.${this.domain}`;
  }

  get #validatorsEndpoint() {
    return `${this.protocol}://validators.${this.domain}`;
  }

  async fetchChains() {
    const response = await this.fetch(this.#chainsEndpoint, this.fetchOpts);
    return response.json() as Promise<DirectoryChains>;
  }

  async fetchChain(path: string) {
    const response = await this.fetch(`${this.#chainsEndpoint}/${encodeURIComponent(path)}`, this.fetchOpts);
    return response.json() as Promise<DirectoryChain>;
  }

  async fetchStatus() {
    const response = await this.fetch(this.#statusEndpoint, this.fetchOpts);
    return response.json() as Promise<DirectoryStatus>;
  }

  async fetchValidators() {
    const response = await this.fetch(this.#validatorsEndpoint, this.fetchOpts);
    return response.json() as Promise<DirectoryValidators>;
  }

  async fetchValidator(path: string) {
    const response = await this.fetch(`${this.#validatorsEndpoint}/${encodeURIComponent(path)}`, this.fetchOpts);
    return response.json() as Promise<DirectoryValidator>;
  }

  async fetchChainValidators(path: string) {
    const response = await this.fetch(`${this.#validatorsEndpoint}/chains/${encodeURIComponent(path)}`, this.fetchOpts);
    return response.json() as Promise<DirectoryChainValidators>;
  }
}

export function createClient(args: Partial<DirectoryClientProps> = {}) {
  return new DirectoryClient(args);
}

export function createTestnetClient(args: Partial<DirectoryClientProps> = {}) {
  return new DirectoryClient({ domain: TESTNET_DOMAIN, ...args });
}
