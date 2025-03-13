class FetchClient {
  constructor(config = {}) {
    this.config = config;
  }

  async request(url, option = {}) {
    const fullUrl = this.config.baseUrl + url;

    const { timeout, retryCount, retryTimeout } = this.config;

    const controller = new AbortController();

    if (option.signal) {
      option.signal.addEventListener('abort', () => controller.abort());
    }

    let attempt = 0;

    while (attempt <= retryCount) {
      try {
        const timer = setTimeout(() => controller.abort(), timeout);
        const res = await fetch(fullUrl, { ...option, signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok) throw new Error('HTTP error');

        return res;
      } catch (error) {
        clearTimeout(timer);

        if (attempt < retryCount) {
          attempt++;
          await new Promise((r) => setTimeout(r, retryTimeout));
          continue;
        }

        throw error;
      }
    }
  }

  async get(url, option) {
    return this.request(url, { ...option, method: 'GET' });
  }
}

const api = new FetchClient({
  baseUrl: '',
  timeout: 5000,
  retryCount: 3,
  retryTimeout: 1000
});

api
  .get('/list', {})
  .then((res) => res.json())
  .then((res) => console.log('success', res))
  .catch((err) => console.log(err));
