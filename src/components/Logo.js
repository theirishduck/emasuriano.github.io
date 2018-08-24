import React from 'react';
import { withTheme } from 'styled-components';

const Logo = props => (
  <svg viewBox="0 0 1054 1054" {...props}>
    <path
      d="M0 0v1054h1054V0H0zm571.5 961H246.7V485h315v86.1h-217v151.2h191.1v84H344.7v68.6h226.8V961zm230.3 6.3c-91 0-149.8-43.4-178.5-100.1l79.8-46.2c21 34.3 48.3 59.5 96.6 59.5 40.6 0 66.5-20.3 66.5-48.3 0-33.6-26.6-45.5-71.4-65.1l-24.5-10.5c-70.7-30.1-117.6-67.9-117.6-147.7 0-73.5 56-129.5 143.5-129.5 62.3 0 107.1 21.7 139.3 78.4l-76.3 49c-16.8-30.1-35-42-63-42-28.7 0-46.9 18.2-46.9 42 0 29.4 18.2 41.3 60.2 59.5l24.5 10.5c83.3 35.7 130.2 72.1 130.2 154 0 88.2-69.3 136.5-162.4 136.5z"
      fill={props.color}
    />
  </svg>
);

export default withTheme(Logo);
