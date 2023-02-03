import React from 'react';
import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { useRouter } from 'next/router';
import Home from '../pages/index';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Home Page', () => {
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
    render(<Home />, { wrapper: RecoilRoot });

    const header = screen.getByRole('heading', { name: /서비스 소개/ });
    expect(header).toBeInTheDocument();
  });

  it('renders a introduction', () => {
    render(<Home />, { wrapper: RecoilRoot });

    const intro = screen.getByText(
      /헤어 스타일을 바꾸고 싶으신가요\? 지금 바로 시작해 보세요!/
    );
    expect(intro).toBeInTheDocument();
  });

  it('renders a start button', () => {
    render(<Home />, { wrapper: RecoilRoot });

    const start = screen.getByText(/시작하기/);
    expect(start).toBeInTheDocument();

    const uploadFile = screen.getByLabelText(/사진 업로드/);
    expect(uploadFile).toBeInTheDocument();
  });
});
