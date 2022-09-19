import { css } from 'styled-components';
import { SuomifiTheme } from '../../theme';
import { font } from '../../theme/reset';

export const baseStyles = (theme: SuomifiTheme) => css`
  &.fi-label {
    & .fi-label_label-span {
      ${font(theme)('actionElementInnerTextBold')};
      display: inline-block;
      vertical-align: middle;
      color: ${theme.colors.blackBase};

      & .fi-label_optional-text {
        ${theme.typography.bodyTextSmall};
      }
      & .fi-tooltip {
        margin-left: ${theme.spacing.insetS};
      }
    }
  }
`;
