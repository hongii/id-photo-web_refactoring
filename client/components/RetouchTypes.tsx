import React from 'react';
import classnames from 'classnames';
import styles from '../pages/photo-retouch/PhotoRetouch.module.css';

interface IProps {
  idx: number;
  typeName: string;
  types: string[];
  activeType: number;
  onClickHandler: (idx: number) => void;
}
const RetouchTypes = ({
  typeName,
  idx,
  types,
  activeType,
  onClickHandler,
}: IProps) => (
  <li className={styles['type-select__item']} aria-label="type item">
    <button
      type="button"
      className={classnames(styles['type-select__btn'], {
        [styles['type-select__btn--active']]: idx === activeType,
      })}
      onClick={() => {
        onClickHandler(idx);
      }}
    >
      {typeName}
    </button>
    {types.length - 1 !== idx && (
      <i className={styles['type-select__bar']}>|</i>
    )}
  </li>
);
export default RetouchTypes;
