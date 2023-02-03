import React from 'react';
import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { useRouter } from 'next/router';
import HairDecision from '../pages/hair-decision';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Hair Decision Page', () => {
  beforeEach(() => {
    URL.createObjectURL = jest.fn();
    URL.revokeObjectURL = jest.fn();
    const push = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push,
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders a header', () => {
    render(<HairDecision />, { wrapper: RecoilRoot });

    const heading = screen.getByRole('heading', {
      name: /헤어 결정/,
      level: 1,
    });
    expect(heading).toBeInTheDocument();

    const backIcon = screen.getByLabelText(/뒤로 가기/);
    expect(backIcon).toBeInTheDocument();
    const link = screen.getByRole('link');
    expect(link).toContainElement(backIcon);
  });

  it('renders a photo alignment', () => {
    render(<HairDecision />, { wrapper: RecoilRoot });

    const heading = screen.getByRole('heading', {
      name: /사진 조정/,
      level: 2,
    });
    expect(heading).toBeInTheDocument();

    const faceAlignment = screen.getByLabelText(/얼굴 위치 조정/);
    expect(faceAlignment).toBeInTheDocument();
  });

  it('renders a type list', () => {
    render(<HairDecision />, { wrapper: RecoilRoot });

    const heading = screen.getByRole('heading', {
      name: /헤어 스타일 종류 선택/,
      level: 2,
    });
    expect(heading).toBeInTheDocument();

    const list = screen.getByRole('list', { name: /종류 목록/ });
    const listItems = screen.getAllByRole('listitem', { name: /type item/ });
    const names = ['롱', '미디움', '단발', '숏컷'];
    listItems.forEach((listItem, idx) => {
      expect(list).toContainElement(listItem);

      expect(listItem).toContainElement(
        screen.getByRole('button', { name: names[idx] })
      );
    });

    const bars = screen.getAllByText('|');
    expect(bars).toHaveLength(listItems.length - 1);
  });

  it('renders a hair style list', () => {
    render(<HairDecision />, { wrapper: RecoilRoot });

    const heading = screen.getByRole('heading', {
      name: /헤어 스타일 선택/,
      level: 2,
    });
    expect(heading).toBeInTheDocument();

    const list = screen.getByRole('list', { name: /스타일 목록/ });
    const listItems = screen.getAllByRole('listitem', { name: /style item/ });
    listItems.forEach((listItem, idx) => {
      expect(list).toContainElement(listItem);
      expect(listItem).toContainElement(
        screen.getAllByAltText(/헤어 스타일 이미지/)[idx]
      );
    });
  });
});
