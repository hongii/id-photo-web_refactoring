import React from 'react';
import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { useRouter } from 'next/router';
import BackgroundDecision from '../pages/background-decision';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Background Decision Page', () => {
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
    render(<BackgroundDecision />, { wrapper: RecoilRoot });

    const heading = screen.getByRole('heading', {
      name: /배경 결정/,
      level: 1,
    });
    expect(heading).toBeInTheDocument();

    const backIcon = screen.getByLabelText(/뒤로 가기/);
    expect(backIcon).toBeInTheDocument();
    const link = screen.getByRole('link');
    expect(link).toContainElement(backIcon);

    const completeBtn = screen.getByRole('button', { name: /완료/ });
    expect(completeBtn).toBeInTheDocument();
  });

  it('renders a result image', () => {
    render(<BackgroundDecision />, { wrapper: RecoilRoot });

    const result = screen.getByLabelText(/얼굴 사진 결과물/);
    expect(result).toBeInTheDocument();
  });

  it('renders a type list', () => {
    render(<BackgroundDecision />, { wrapper: RecoilRoot });

    const heading = screen.getByRole('heading', {
      name: /배경 종류 선택/,
      level: 2,
    });
    expect(heading).toBeInTheDocument();

    const list = screen.getByRole('list', { name: /종류 목록/ });
    const listItems = screen.getAllByRole('listitem', { name: /type item/ });
    expect(list).toContainElement(listItems[0]);
    expect(listItems[0]).toContainElement(
      screen.getByRole('button', { name: /단색/ })
    );
    expect(listItems[0]).toContainElement(screen.getByText(/\|/));
  });

  it('renders a background color list', () => {
    render(<BackgroundDecision />, { wrapper: RecoilRoot });

    const heading = screen.getByRole('heading', {
      name: /배경 색상 선택/,
      level: 2,
    });
    expect(heading).toBeInTheDocument();

    const list = screen.getByRole('list', { name: /색상 목록/ });
    const listItems = screen.getAllByRole('listitem', { name: /color item/ });
    expect(list).toContainElement(listItems[0]);
    expect(listItems[0]).toContainElement(
      screen.getByRole('button', { name: /transparent/ })
    );
  });
});
