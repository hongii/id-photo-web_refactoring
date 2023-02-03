import React from 'react';
import Image from 'next/image';
import { CardInfo } from '../constants/cutSizeData';
import styles from '../pages/cut-size-decision/CutSizeDecision.module.css';

// Image src array
const imgSrc: string[] = [
  '/images/passportImg1.png',
  '/images/studentIDImg2.png',
  '/images/employeeIDImg3.png',
  '/images/visaImg4.png',
  '/images/visaImg4.png',
  '/images/visaImg4.png',
];

interface IProps {
  card: CardInfo;
  onClick: () => void;
}

const Card = ({ card, onClick }: IProps) => (
  <li className={styles.card__item} aria-label="cut size item">
    <Image
      src={imgSrc[card.id]}
      alt={`${card.title} 컷 사이즈`}
      width="317"
      height="353"
    />
    <p className={styles['cut-title']}>{card.title}</p>
    {card.cutSize.map((size) => (
      <p className={styles['cut-size']} key={size}>
        {size}
      </p>
    ))}
    <button className={styles['select-btn']} type="button" onClick={onClick}>
      선택하기
    </button>
  </li>
);
export default Card;
