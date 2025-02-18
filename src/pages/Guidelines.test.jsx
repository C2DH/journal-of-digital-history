import React from 'react';
import { render } from '@testing-library/react';
import Guidelines from './Guidelines';
import source from '../data/mock-api/authorGuideline.json';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: key => key})
}));

const expectedTitle = source.cells
  .filter(d => {
    return d.metadata?.tags?.includes('title')
  })
  .map(d => d.source.join(''))
  .join()
  .replace(/#\s*/, '')
  .trim()

test(`renders /guidelines title "${expectedTitle}" correctly`, () => {
  const { getByText } = render(<Guidelines />);

  const headingElement = getByText(expectedTitle);
  expect(headingElement).toBeInTheDocument();
});
