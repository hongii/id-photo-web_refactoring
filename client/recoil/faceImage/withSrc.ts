import { selector } from 'recoil';
import faceImageState from './atom';

const faceImageWithSrc = selector<string>({
  key: `faceImageSrc_${Date.now()}`,
  get: ({ get }) => {
    const file = get(faceImageState);
    if (!file) return '/';
    return URL.createObjectURL(file);
  },
});

export default faceImageWithSrc;
