async function fetchBgRemovedImage(photo: Blob | File) {
  const form = new FormData();
  form.append('image_file', photo);

  try {
    const response = await fetch('/clip/remove-background/v1', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_CLIP_API_KEY as string,
      },
      body: form,
    });
    if (!response.ok) {
      throw await response.json();
    }
    const blob = await response.blob();
    return { image: blob };
  } catch (error) {
    return Promise.reject(error);
  }
}

async function mockFetchBgRemovedImage(photo: Blob | File, isError: boolean) {
  const res = await new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isError) reject(new Error('req failed'));
      resolve({ image: photo });
    }, 3000);
  });
  return res;
}

export { fetchBgRemovedImage, mockFetchBgRemovedImage };
