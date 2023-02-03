import classnames from 'classnames';
import React from 'react';
import styles from './TypeList.module.css';

type Props = {
  typeNames: string[];
  activeTarget: number;
  onClick: (idx: number) => void;
};

const TypeListItem = ({
  typeName,
  active,
  onClick,
  isLast,
}: {
  typeName: string;
  active: boolean;
  onClick: () => void;
  isLast: boolean;
}) => (
  <li aria-label="type item" className={styles['type-select__item']}>
    <button
      type="button"
      className={classnames(styles['type-select__btn'], {
        [styles['type-select__btn--active']]: active,
      })}
      onClick={onClick}
    >
      {typeName}
    </button>
    {!isLast && <i className={styles['type-select__bar']}>|</i>}
  </li>
);

const TypeList = ({ typeNames, onClick, activeTarget }: Props) => (
  <ul aria-label="종류 목록" className={styles['type-select']}>
    {typeNames.map((typeName, idx) => (
      <TypeListItem
        key={`KEY_${typeName}`}
        typeName={typeName}
        onClick={() => onClick(idx)}
        active={activeTarget === idx}
        isLast={typeNames.length - 1 === idx}
      />
    ))}
  </ul>
);

export default TypeList;
