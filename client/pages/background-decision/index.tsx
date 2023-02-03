import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Header from '@/components/Header';
import styles from '@/styles/BackgroundDecision.module.css';
import TypeList from '@/components/TypeList';
import ColorList from '@/components/ColorList';
import { useRecoilState, useRecoilValue } from 'recoil';
import faceImageState, { withSrc } from 'recoil/faceImage';
import { useRouter } from 'next/router';
import Loading from '@/components/Loading';
import useFetch from 'services/useFetch';
import debounce from 'utils/debounce';
import removeBgResultAtom from 'recoil/removeBgResultAtom';
import resultAtom from 'recoil/resultAtom';
import { fetchBgRemovedImage } from 'services/clipdrop';

const typeNames = ['단색', '그라데이션'];
const colorOptions: { [key: string]: string[] } = {
  단색: ['#ffffff', '#eeeeee', '#cecece', '#b1b1b1'],
  그라데이션: [
    'linear-gradient(red, white)',
    'linear-gradient(orange, white)',
    'linear-gradient(green, white)',
    'linear-gradient(pink, white)',
  ],
};

const BackgroundDecision: NextPage = () => {
  const [activeType, setActiveType] = useState(0);
  const [activeColor, setActiveColor] = useState('');
  const faceSrc = useRecoilValue(withSrc);
  const [, setFaceImage] = useRecoilState(faceImageState);
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [result] = useRecoilState(resultAtom);
  const [removeBgResult, setRemoveBgResult] =
    useRecoilState(removeBgResultAtom);
  const { data, error, loading } = useFetch<{ image: Blob }>({
    body: removeBgResult,
    interval: 3000,
    enabled: !removeBgResult,
    shouldRetry: (cnt) => cnt < 1,
    // 배경 제거 기능 확인을 원하면 아래로 수정할 것
    api: () => fetchBgRemovedImage(result as File),
  });

  const drawImageToCanvas: (src: string) => void = useCallback(
    (src: string) => {
      const img = document.createElement('img');
      img.onload = () => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          const { width, height } = canvasRef.current;

          if (!ctx) return;

          ctx.clearRect(0, 0, width, height);
          if (activeColor) {
            const isGradation = typeNames[activeType] === '그라데이션';
            if (isGradation) {
              const gradient = ctx.createLinearGradient(
                Math.floor(width / 2),
                0,
                Math.floor(width / 2),
                height
              );
              const selectedColorValue = activeColor.split(/[(),]/)[1];
              gradient.addColorStop(0, selectedColorValue);
              gradient.addColorStop(1, 'white');
              ctx.fillStyle = gradient;
            } else {
              ctx.fillStyle = activeColor;
            }
            ctx.fillRect(0, 0, width, height);
          }
          ctx.drawImage(
            img,
            0,
            0,
            img.naturalWidth,
            img.naturalHeight,
            0,
            0,
            width,
            height
          );
        }
      };
      img.src = src;
    },
    [activeColor, activeType]
  );

  const handleChangeType = (idx: number) => {
    setActiveType(idx);
    setActiveColor('');
  };

  const toBlob = async (canvas: HTMLCanvasElement) =>
    new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob as Blob);
      });
    });

  const handleComplete = async () => {
    if (!canvasRef.current) return;

    const croppedFace = await toBlob(canvasRef.current);
    if (faceSrc) {
      URL.revokeObjectURL(faceSrc);
    }
    setFaceImage(croppedFace);

    router.push('/photo-retouch');
  };

  useEffect(() => {
    if (canvasRef.current) {
      const { offsetWidth } = canvasRef.current.parentElement || {
        offsetWidth: 300,
      };
      canvasRef.current.width = offsetWidth;
      canvasRef.current.height = Math.floor(offsetWidth / 3) * 4;
    }
  }, []);

  useEffect(() => {
    if (data) {
      const url = URL.createObjectURL(data.image);
      setRemoveBgResult(url);
    }
  }, [data, setRemoveBgResult]);

  useEffect(() => {
    if (!removeBgResult) {
      drawImageToCanvas(faceSrc);
    } else {
      drawImageToCanvas(removeBgResult);
    }
  }, [faceSrc, drawImageToCanvas, removeBgResult]);

  useEffect(() => {
    if (faceSrc === '/') {
      router.push('/');
    }
  }, [faceSrc, router]);

  if (error) {
    return <div>배경 제거 과정에서 오류가 발생했습니다</div>;
  }

  return (
    <div className={styles['page-layout']}>
      <Head>
        <title>ID Photo Web</title>
        <meta name="description" content="id photo generatation service" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header
        title="배경 결정"
        href="/cut-size-decision"
        onClickButton={handleComplete}
      />
      <main className={styles.main}>
        <div className={styles['face-image-container']}>
          <div className={styles['face-image']}>
            <canvas
              aria-label="얼굴 사진 결과물"
              className={styles.canvas}
              ref={canvasRef}
            />
          </div>
        </div>
        <article className={styles['select-container']}>
          <section>
            <h2 className={styles['screen-reader-only']}>배경 종류 선택</h2>
            <TypeList
              typeNames={typeNames}
              activeTarget={activeType}
              onClick={debounce(handleChangeType, 500)}
            />
          </section>
          <section>
            <h2 className={styles['screen-reader-only']}>배경 색상 선택</h2>
            <ColorList
              activeTarget={activeColor}
              colors={colorOptions[typeNames[activeType]]}
              onClick={debounce(setActiveColor, 500)}
              isGradient={typeNames[activeType] === '그라데이션'}
            />
          </section>
        </article>
      </main>
      <Loading isDone={loading === false} time={3000} />
    </div>
  );
};

export default BackgroundDecision;
