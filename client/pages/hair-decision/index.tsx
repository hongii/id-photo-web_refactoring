import React, { useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Crop from '@/components/Crop';
import Header from '@/components/Header';
import styles from '@/styles/HairDecision.module.css';
import TypeList from '@/components/TypeList';
import HairStyleList from '@/components/HairStyleList';
import Loading from '@/components/Loading';
import { useRecoilState, useRecoilValue } from 'recoil';
import faceImageState, { withSrc } from 'recoil/faceImage';
import noBgPhotoAtom from 'recoil/noBgPhotoAtom';
import { useRouter } from 'next/router';
import useFetch from 'services/useFetch';
import uuid from 'react-uuid';
import { fetchBgRemovedImage } from 'services/clipdrop';
import ganPhotoAtom from 'recoil/ganPhotoAtom';
import { hairStyleImages, typeNames } from '../../constants/hairStyleData';

const HairDecision: NextPage = () => {
  const [activeType, setActiveType] = useState(0);
  const [selectedHair, setSelectedHair] = useState(-1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [faceImage, setFaceImage] = useRecoilState(faceImageState);
  const [noBgPhoto, setNoBgPhoto] = useRecoilState(noBgPhotoAtom);
  const [, setGanPhoto] = useRecoilState(ganPhotoAtom);
  const faceSrc = useRecoilValue(withSrc);
  const router = useRouter();
  const { data, error, loading } = useFetch<{ image: Blob }>({
    body: noBgPhoto,
    interval: 3000,
    enabled: !noBgPhoto,
    shouldRetry: (cnt) => cnt < 1,
    // 배경 제거 기능 확인을 원하면 아래로 수정할 것
    api: () => fetchBgRemovedImage(faceImage as File),
    // api: () => mockFetchBgRemovedImage(faceImage as Blob, false),
  });

  const toBlob = async (canvas: HTMLCanvasElement) =>
    new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob as Blob);
      }, 'image/jpeg');
    });

  const handleSelectHair = (idx: number) => {
    if (idx === selectedHair) {
      setSelectedHair(-1);
      return;
    }
    setSelectedHair(idx);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUploadImage = async (file: Blob) => {
    try {
      const id = uuid();
      console.log('uuid', id);

      const hairType = hairStyleImages[typeNames[activeType]][selectedHair]
        .replace('/images/', '')
        .replace(/(.webp)|(.jpg)|(.png)/, '');
      console.log('hairType', hairType);

      const responseOfPresignedURL = await fetch(
        `/aws/prod/sr/presignedurlforupload`,
        {
          method: 'POST',
          body: JSON.stringify({
            method: 'PUT',
            fileName: `barbershop/${id}/${hairType}.jpg`,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Pre:', responseOfPresignedURL);
      const presignedURL = await responseOfPresignedURL.text();

      const newNameImg = new File(
        [file as Blob],
        `barbershop/${id}/${hairType}`,
        {
          type: 'image/jpg',
        }
      );
      console.log('File:', newNameImg.name, newNameImg.type);
      const uri = presignedURL.replace(
        'https://sweetndata-barbershop.s3.amazonaws.com/',
        ''
      );
      const result = await fetch(`/s3/${uri}`.replaceAll(/"|(%22)/gi, ''), {
        method: 'PUT',
        body: newNameImg,
        headers: {
          'Content-Type': newNameImg.type,
        },
      });
      console.log('PUT:', result);
      if (!result.ok) {
        throw new Error('PUT failed');
      }

      const responseOfGetImage = await fetch(
        `/aws/prod/sr/presignedurlforupload`,
        {
          method: 'POST',
          body: JSON.stringify({
            method: 'GET',
            fileName: `barbershop/${id}/${hairType}.jpg`,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const resultImageURL = await responseOfGetImage.text();

      // eslint-disable-next-line no-console
      console.log('GET:', resultImageURL);

      const responseOfGetGANImage = await fetch(
        `/aws/prod/sr/presignedurlforupload`,
        {
          method: 'POST',
          body: JSON.stringify({
            method: 'GET',
            fileName: `barbershop/${id}/output.png`,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const ganImageURL = await responseOfGetGANImage.text();

      // eslint-disable-next-line no-console
      console.log('GAN:', ganImageURL);

      setGanPhoto(ganImageURL);

      router.push('/cut-size-decision');
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert('업로드를 실패했습니다. 다시 시도해주세요.');
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const handleComplete = async () => {
    if (!canvasRef.current) return;

    const croppedFace = await toBlob(canvasRef.current);

    if (faceSrc) {
      URL.revokeObjectURL(faceSrc);
    }
    setFaceImage(croppedFace);
    handleUploadImage(croppedFace);
  };

  useEffect(() => {
    if (data) {
      setNoBgPhoto(URL.createObjectURL(data.image));
    }
  }, [data, setNoBgPhoto]);

  useEffect(() => {
    setSelectedHair(-1);
  }, [activeType]);

  useEffect(() => {
    if (faceSrc === '/') {
      router.push('/');
    }
  }, [faceSrc, router]);

  if (error) {
    return <div>배경 제거 과정에서 오류가 발생했습니다</div>;
  }

  return (
    <div className={styles.page}>
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
        title="헤어 결정"
        href="/"
        onClickButton={handleComplete}
        hideButton={selectedHair === -1}
      />
      <main className={styles.main}>
        <article>
          <h2 className={styles['screen-reader-only']}>사진 조정</h2>
          <Crop faceSrc={noBgPhoto || '/'} ref={canvasRef} />
        </article>
        <article className={styles['select-container']}>
          <section>
            <h2 className={styles['screen-reader-only']}>
              헤어 스타일 종류 선택
            </h2>
            <TypeList
              typeNames={typeNames}
              activeTarget={activeType}
              onClick={setActiveType}
            />
          </section>
          <section className={styles['hair-style-container']}>
            <h2 className={styles['screen-reader-only']}>헤어 스타일 선택</h2>
            <HairStyleList
              images={hairStyleImages[typeNames[activeType]]}
              checkTarget={selectedHair}
              onClick={handleSelectHair}
            />
          </section>
        </article>
      </main>
      <Loading isDone={loading === false} time={3000} />
    </div>
  );
};
export default HairDecision;
