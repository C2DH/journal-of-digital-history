import React from 'react';
import { render } from '@testing-library/react';
import About from './about';


jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: key => key})
}));

const expectedContent = 'The Team at the C²DH'

test(`renders /guidelines title "${expectedContent}" correctly`, () => {
  const { getByText } = render(<About />);

  const headingElement = getByText(expectedContent);
  expect(headingElement).toBeInTheDocument();
});
