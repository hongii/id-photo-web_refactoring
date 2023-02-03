import React, { useEffect, useState } from 'react';
import styles from './Loading.module.css';

type Props = {
  time: number;
  isDone: boolean;
};

const Rate = ({ timeout }: { timeout: number }) => {
  const [rate, setRate] = useState(0);
  const INTERVAL = 0.01;
  const increasePerTick = timeout * INTERVAL;
  const max = timeout - increasePerTick;

  useEffect(() => {
    const tick = setInterval(() => {
      setRate((prev) => {
        const nextState = prev + increasePerTick;
        if (nextState > max) return max;
        return nextState;
      });
    }, increasePerTick);

    return () => {
      clearInterval(tick);
    };
  }, [timeout, increasePerTick, max]);

  return <span>{Math.floor((rate / timeout) * 100)}%</span>;
};

const Loading = ({ time, isDone }: Props) => (
  <div className={`${styles.container} ${isDone ? styles.fadeout : ''}`}>
    <p className={styles.spinner}>
      {isDone ? '100%' : <Rate timeout={time} />}
    </p>
  </div>
);

export default Loading;
