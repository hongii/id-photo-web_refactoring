import { atom } from 'recoil';

const noBgPhotoAtom = atom<string>({
  key: `noBgPhotoAtom_${Date.now()}`,
  default: '',
  effects: [
    ({ onSet }) => {
      onSet((newURL, oldURL) => {
        URL.revokeObjectURL(oldURL as string);
      });
    },
  ],
});

export default noBgPhotoAtom;
