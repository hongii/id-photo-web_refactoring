import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import faceImageState, { withSrc } from 'recoil/faceImage';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import noBgPhotoAtom from 'recoil/noBgPhotoAtom';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [, setFaceImage] = useRecoilState(faceImageState);
  const faceSrc = useRecoilValue(withSrc);
  const [noBgPhoto, setNoBgPhoto] = useRecoilState(noBgPhotoAtom);
  const router = useRouter();

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const faceFile = e.target.files[0];
      if (faceSrc) {
        URL.revokeObjectURL(faceSrc);
      }
      if (noBgPhoto) {
        URL.revokeObjectURL(noBgPhoto);
      }
      setFaceImage(faceFile);
      setNoBgPhoto('');
      router.push('/hair-decision');
    }
  };

  return (
    <div>
      <Head>
        <title>ID Photo Web</title>
        <meta name="description" content="id photo generatation service" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles['screen-reader-only']}>서비스 소개</h1>

      <div className={styles.container}>
        <p className={styles.intro}>
          헤어 스타일을 바꾸고 싶으신가요? 지금 바로 시작해 보세요!
        </p>

        <div className={styles['picture-container']}>
          <div className={styles.picture1}>
            <Image
              width={235}
              height={235}
              src="/images/picture1.png"
              alt="picture1"
            />
          </div>
          <div className={styles.picture2}>
            <Image
              width={235}
              height={235}
              src="/images/picture2.png"
              alt="picture2"
            />
          </div>
          <div className={styles.picture3}>
            <Image
              width={245}
              height={245}
              src="/images/picture3.png"
              alt="picture3"
            />
          </div>
        </div>

        <div className={styles['start-btn']}>
          <label className={styles['start-btn__label']} htmlFor="photoUpload">
            시작하기
            <input
              type="file"
              name="photo"
              id="photoUpload"
              accept="image/*"
              aria-label="사진 업로드"
              onChange={handleUploadPhoto}
              hidden
            />
          </label>
        </div>
      </div>
    </div>
  );
};
export default Home;
