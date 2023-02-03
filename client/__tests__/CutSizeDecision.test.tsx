import React from 'react';
import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { useRouter } from 'next/router';
import CutSizeDecision from '../pages/cut-size-decision';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('CutSizeDecision Page', () => {
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
    render(<CutSizeDecision />, { wrapper: RecoilRoot });

    const heading = screen.getByRole('heading', {
      name: /컷 사이즈/,
      level: 1,
    });
    expect(heading).toBeInTheDocument();

    const backIcon = screen.getByLabelText(/뒤로 가기/);
    expect(backIcon).toBeInTheDocument();
    const link = screen.getByRole('link');
    expect(link).toContainElement(backIcon);
  });

  it('renders a cut size list', () => {
    render(<CutSizeDecision />, { wrapper: RecoilRoot });

    const heading = screen.getByRole('heading', {
      name: /최종 사진 크기 선택/,
      level: 2,
    });
    expect(heading).toBeInTheDocument();

    const cutSizeList = screen.getAllByRole('listitem', {
      name: /cut size item/,
    });
    expect(cutSizeList).not.toHaveLength(0);
    cutSizeList.forEach((el, idx) => {
      expect(el).toContainElement(
        screen.getAllByAltText(/.+용 컷 사이즈/)[idx]
      );
      expect(el).toContainElement(screen.getAllByText(/.+용/)[idx]);
      expect(el).toContainElement(
        screen.getAllByText(/.*컷 사이즈 (\d+.?\d*cm) x (\d+.?\d*cm)/)[idx]
      );
      expect(el).toContainElement(
        screen.getAllByRole('button', { name: /선택하기/ })[idx]
      );
    });
  });
});
