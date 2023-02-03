import React from 'react';
import styles from '../pages/photo-retouch/PhotoRetouch.module.css';

interface IProps {
  slimValue: string;
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SlimmingRange = ({ handleOnChange, slimValue }: IProps) => (
  <>
    {/* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */}
    <label htmlFor="ratio">0</label>
    <input
      className={styles.ratio}
      type="range"
      name="ratio"
      id="ratio"
      min="0"
      max="100"
      step="10"
      value={slimValue}
      onChange={handleOnChange}
    />
    <label htmlFor="ratio">100</label>
  </>
);

export default SlimmingRange;
