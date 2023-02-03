import React, {
  ChangeEvent,
  forwardRef,
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import debounce from 'utils/debounce';
import guideLineImage from '../../public/images/guide-line.png';
import styles from './Crop.module.css';

const TransformInputs = ({
  scale,
  rotate,
  handleScale,
  handleRotate,
}: {
  scale: number;
  rotate: number;
  handleScale: (value: number) => void;
  handleRotate: (value: number) => void;
}) => {
  const [phase, setPhase] = useState<'none' | 'scale' | 'rotate'>('none');

  const createConstant = (_scale: number, _rotate: number) =>
    ({ scale: _scale, rotate: _rotate } as const);

  const MAX = createConstant(2, 360);
  const MIN = createConstant(0.1, 0);
  const STEP = createConstant(0.05, 5);
  const VALUE = createConstant(scale, rotate);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { valueAsNumber } = e.target;
    if (phase === 'scale') {
      handleScale(valueAsNumber);
    }
    if (phase === 'rotate') {
      handleRotate(valueAsNumber);
    }
  };

  return (
    <div className={styles['transform-container']}>
      {phase === 'none' && (
        <>
          <button
            type="button"
            className={styles['transform-item-button']}
            onClick={() => setPhase('scale')}
          >
            확대/축소
          </button>
          <button
            type="button"
            className={styles['transform-item-button']}
            onClick={() => setPhase('rotate')}
          >
            회전
          </button>
        </>
      )}

      {phase !== 'none' && (
        <>
          <input
            type="range"
            className={styles['transform-item-input']}
            onChange={handleChange}
            name={phase}
            min={MIN[phase]}
            max={MAX[phase]}
            step={STEP[phase]}
            value={VALUE[phase]}
          />
          <button
            type="button"
            className={styles['transform-item-button']}
            onClick={() => setPhase('none')}
          >
            돌아가기
          </button>
        </>
      )}
    </div>
  );
};

interface IProps {
  faceSrc: string;
}

const Crop = (
  { faceSrc }: IProps,
  ref: Ref<HTMLCanvasElement>
): JSX.Element => {
  const canvas = ref as RefObject<HTMLCanvasElement>;
  const canvasSize = useRef({ width: 300, height: 426 });

  const faceImage = useRef<HTMLImageElement>(null);

  const [origin, setOrigin] = useState({ x: 0, y: 0, dx: 0, dy: 0 });
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const draw = useCallback(() => {
    if (canvas.current && faceImage.current) {
      const ctx = canvas.current.getContext('2d');

      const TO_RADIANS = Math.PI / 180;
      const halfWidth = Math.floor(canvas.current.width / 2);
      const halfHeight = Math.floor(canvas.current.height / 2);

      const SIN = Math.sin(rotate * TO_RADIANS);
      const COS = Math.cos(rotate * TO_RADIANS);
      const tx = Math.floor(COS * origin.x + SIN * origin.y);
      const ty = Math.floor(-SIN * origin.x + COS * origin.y);

      if (!ctx) {
        return;
      }

      ctx.save();
      ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);

      ctx.translate(halfWidth, halfHeight);
      ctx.rotate(rotate * TO_RADIANS);
      ctx.scale(scale, scale);
      ctx.translate(-halfWidth, -halfHeight);

      ctx.drawImage(
        faceImage.current,
        0,
        0,
        faceImage.current.naturalWidth,
        faceImage.current.naturalHeight,
        tx,
        ty,
        canvas.current.width,
        canvas.current.height
      );
      ctx.restore();
    }
  }, [origin.x, origin.y, scale, rotate, canvas]);

  const translateImage = (clientX: number, clientY: number) => {
    const { x, y, dx, dy } = origin;

    const diffX = Math.floor((clientX - dx) * 1);
    const diffY = Math.floor((clientY - dy) * 1);

    let nextX = x + diffX;
    let nextY = y + diffY;

    if (canvas.current) {
      const { width, height } = canvas.current;
      if (nextX > width || nextX < -width) {
        nextX = 0;
      }
      if (nextY > height || nextY < -height) {
        nextY = 0;
      }
    }

    setOrigin({
      x: nextX,
      y: nextY,
      dx: Math.floor(clientX),
      dy: Math.floor(clientY),
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.targetTouches.length === 1) {
      if (faceImage.current && faceImage.current.src === '') return;

      const { clientX, clientY } = e.targetTouches[0];
      setOrigin((prev) => ({
        ...prev,
        dx: Math.floor(clientX),
        dy: Math.floor(clientY),
      }));
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches.length === 1) {
      if (faceImage.current && faceImage.current.src === '') return;

      const { clientX, clientY } = e.changedTouches[0];
      translateImage(clientX, clientY);
    }
  };
  const handleTouchEnd = () => {
    draw();
  };

  const handleResize = useCallback(() => {
    if (canvas.current) {
      const { width, height } = canvasSize.current;
      const { offsetWidth = width, offsetHeight = height } =
        canvas.current.parentElement || {};
      canvas.current.width = offsetWidth;
      canvas.current.height = offsetHeight;
      canvasSize.current = { width: offsetWidth, height: offsetHeight };
    }
  }, [canvas]);

  const handleLoad = () => {
    setRotate(0);
    setScale(1);
    if (!(origin.x === 0 && origin.y === 0)) {
      setOrigin({ x: 0, y: 0, dx: 0, dy: 0 });
      return;
    }
    draw();
  };

  useEffect(() => {
    if (faceSrc !== '/') draw();
  }, [origin.x, origin.y, scale, rotate, draw, faceSrc]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', debounce(handleResize, 500));
    return () => {
      window.removeEventListener('resize', debounce(handleResize, 500));
    };
  }, [handleResize]);

  return (
    <>
      <div className={styles.container}>
        {
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt="face"
            ref={faceImage}
            hidden
            onLoad={handleLoad}
            src={faceSrc}
          />
        }
        <canvas
          className={styles.crop}
          aria-label="얼굴 위치 조정"
          ref={canvas}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        <div className={styles['guide-line']}>
          <Image
            src={guideLineImage}
            alt="face alignment guide line"
            layout="fill"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            priority
          />
        </div>
      </div>
      <TransformInputs
        scale={scale}
        rotate={rotate}
        handleScale={(value) => setScale(value)}
        handleRotate={(value) => setRotate(value)}
      />
    </>
  );
};

const forwardedCrop = forwardRef(Crop);
export default forwardedCrop;
