import React from 'react';
import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { useRouter } from 'next/router';
import PhotoSave from '../pages/photo-save';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Photo Save Page', () => {
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
    render(<PhotoSave />, { wrapper: RecoilRoot });

    const heading = screen.getByRole('heading', {
      name: /사진 저장/,
      level: 1,
    });
    expect(heading).toBeInTheDocument();

    const backIcon = screen.getByLabelText(/뒤로 가기/);
    expect(backIcon).toBeInTheDocument();

    const homeIcon = screen.getByLabelText(/메인 화면으로 가기/);
    expect(homeIcon).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links[0]).toContainElement(backIcon);
    expect(links[1]).toContainElement(homeIcon);
  });

  it('renders a result image', () => {
    render(<PhotoSave />, { wrapper: RecoilRoot });

    const result = screen.getByAltText(/얼굴 사진 결과물/);
    expect(result).toBeInTheDocument();
  });

  it('renders a save button', () => {
    render(<PhotoSave />, { wrapper: RecoilRoot });

    const save = screen.getByRole('link', { name: /저장하기/ });
    expect(save).toBeInTheDocument();
  });
});
