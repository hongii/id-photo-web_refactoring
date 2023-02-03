import { atom } from 'recoil';

const ganPhotoAtom = atom<string>({
  key: `ganPhotoAtom_${Date.now()}`,
  default: '',
});

export default ganPhotoAtom;
