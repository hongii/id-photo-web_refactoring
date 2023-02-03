import Image, { StaticImageData } from 'next/image';
import React from 'react';
import classnames from 'classnames';
import styles from './HairStyleList.module.css';

type Props = {
  images: (string | StaticImageData)[];
  onClick: (idx: number) => void;
  checkTarget: number;
};

const HairStyleListItem = ({
  src,
  onClick,
  checked,
}: {
  src: string | StaticImageData;
  onClick: () => void;
  checked: boolean;
}) => (
  <li
    aria-label="style item"
    className={classnames(styles['hair-style-select__item'], {
      [styles['hair-style-select__item--checked']]: checked,
    })}
  >
    <Image src={src} alt="헤어 스타일 이미지" layout="fill" onClick={onClick} />
  </li>
);

const HairStyleList = ({ images, onClick, checkTarget }: Props) => (
  <ul aria-label="스타일 목록" className={styles['hair-style-select']}>
    {images.map((image, idx) => (
      <HairStyleListItem
        src={image}
        key={`${image.toString()}_${idx + 1}`}
        onClick={() => onClick(idx)}
        checked={checkTarget === idx}
      />
    ))}
  </ul>
);

export default HairStyleList;
