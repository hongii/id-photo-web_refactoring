import React, { useEffect, useState } from 'react';
import debounce from 'utils/debounce';
import styles from './ColorList.module.css';

type Props = {
  colors: string[];
  onClick: (color: string) => void;
  activeTarget: string;
  isGradient?: boolean;
};

const ColorItem = ({
  active,
  color,
  onClick,
}: {
  active: boolean;
  color: string;
  onClick: () => void;
}) => (
  <li aria-label="color item">
    <button
      type="button"
      className={`${styles['color-picker']} ${
        active ? styles['color-picker--active'] : ''
      }`}
      style={{ background: color }}
      onClick={onClick}
    >
      {color}
    </button>
  </li>
);

const ColorList = ({ colors, onClick, activeTarget, isGradient }: Props) => {
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    if (activeTarget === '') {
      setPicked(false);
    }
  }, [activeTarget]);

  const handleClickCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setPicked(true);
    if (isGradient) {
      onClick(`linear-gradient(${value}, white)`);
      return;
    }
    onClick(value);
  };

  const handleClick = (color: string) => {
    if (picked) {
      setPicked(false);
    }

    if (activeTarget === color) {
      onClick('');
      return;
    }

    onClick(color);
  };

  return (
    <ul aria-label="색상 목록" className={styles['color-list']}>
      <li aria-label="color item">
        <button
          type="button"
          className={`${styles['color-picker-checker']} ${
            activeTarget === '' ? styles['color-picker--active'] : ''
          }`}
          onClick={() => handleClick('')}
        >
          transparent
        </button>
      </li>
      {colors.map((color, idx) => (
        <ColorItem
          key={`${color}_${idx + 1}`}
          active={color === activeTarget}
          color={color}
          onClick={() => handleClick(color)}
        />
      ))}
      <li aria-label="color item">
        <input
          type="color"
          className={`${styles['color-picker-rainbow']} ${
            picked ? styles['color-picker--active'] : ''
          }`}
          name="customColor"
          id="customColor"
          onChange={debounce(handleClickCustomColor, 250)}
        />
      </li>
    </ul>
  );
};

export default ColorList;
