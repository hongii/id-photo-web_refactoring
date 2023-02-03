async function fetchGANImage(src: string) {
  const response = await fetch(
    `/s3/${src}`
      .replace('https://sweetndata-barbershop.s3.amazonaws.com/', '')
      .replaceAll(/"|(%22)/gi, ''),
    { method: 'get' }
  );
  const shouldRetry =
    !response.ok ||
    response.status === 404 ||
    !response.headers.get('Content-Type')?.includes('image');
  if (shouldRetry) {
    return Promise.reject(new Error('failed to get output'));
  }
  return { src };
}

function mockFetchGANImage(count: number, src: string) {
  let retryCount = 0;
  return async () => {
    const res = await new Promise((resolve, reject) => {
      setTimeout(() => {
        retryCount += 1;
        if (retryCount < count) reject(new Error('req failed'));
        resolve({ src });
      }, 1000 * 6);
    });
    return res;
  };
}

export { mockFetchGANImage, fetchGANImage };
