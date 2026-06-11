const responseCache = new Map();
const pendingRequests = new Map();

const stableParams = (params = {}) => Object.entries(params)
  .filter(([, value]) => value !== undefined && value !== null && value !== "")
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
  .join("&");

const requestKey = (url, params) => `${url}?${stableParams(params)}`;

export const cachedGet = (client, url, config = {}, ttl = 1500) => {
  const key = requestKey(url, config.params);
  const cached = responseCache.get(key);

  if (cached && cached.expiresAt > Date.now()) {
    return Promise.resolve(cached.response);
  }

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const request = client.get(url, config)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        responseCache.set(key, {
          response,
          expiresAt: Date.now() + ttl,
        });
      }
      return response;
    })
    .finally(() => pendingRequests.delete(key));

  pendingRequests.set(key, request);
  return request;
};

export const invalidateRequestCache = (...prefixes) => {
  for (const key of responseCache.keys()) {
    if (!prefixes.length || prefixes.some((prefix) => key.startsWith(prefix))) {
      responseCache.delete(key);
    }
  }
};
