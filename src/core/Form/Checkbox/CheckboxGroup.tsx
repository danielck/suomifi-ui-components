import React, { Component, ReactNode, forwardRef } from 'react';
import { default as styled } from 'styled-components';
import classnames from 'classnames';
import { getConditionalAriaProp } from '../../../utils/aria';
import { SuomifiThemeProp, SuomifiThemeConsumer } from '../../theme';
import {
  HtmlDiv,
  HtmlDivWithRef,
  HtmlFieldSet,
  HtmlLegend,
} from '../../../reset';
import { InputStatus } from '../types';
import { Label } from '../Label/Label';
import { HintText } from '../HintText/HintText';
import { StatusText } from '../StatusText/StatusText';
import { CheckboxProps } from './Checkbox';
import { baseStyles } from './CheckboxGroup.baseStyles';
import { AutoId } from '../../utils/AutoId/AutoId';
import { VisuallyHidden } from '../../VisuallyHidden/VisuallyHidden';

const baseClassName = 'fi-checkbox-group';
const checkboxGroupClassNames = {
  legend: `${baseClassName}_legend`,
  labelIsVisible: `${baseClassName}_label--visible`,
  container: `${baseClassName}_container`,
  statusTextHasContent: `${baseClassName}_statusText--has-content`,
};

type CheckboxGroupStatus = Exclude<InputStatus, 'success'>;

export interface CheckboxGroupProps {
  /** Custom classname to extend or customize */
  className?: string;
  /** Checkbox or ReactNode */
  children: Array<React.ReactElement<CheckboxProps> | ReactNode>;
  /** Hint text to be displayed under the label. */
  groupHintText?: string;
  /** Label for the group */
  labelText: ReactNode;
  /** Hide or show label. Label element is always present, but can be visually hidden.
   * @default visible
   */
  labelMode?: 'hidden' | 'visible';
  /** Text to mark a selection in group as optional. Will be wrapped in parentheses and shown after labelText. */
  optionalText?: string;
  /**
   * Unique id
   * If no id is specified, one will be generated
   */
  id?: string;
  /**
   * Status for the group. Will be passed to children.
   * 'default' | 'error'
   * @default default
   */
  groupStatus?: CheckboxGroupStatus;
  /** Status text to be shown below the component. Use e.g. for validation error */
  groupStatusText?: string;
  /** Ref is forwarded to the root div element. Alternative for React `ref` attribute. */
  forwardedRef?: React.Ref<HTMLDivElement>;
}

export interface CheckboxGroupProviderState {
  status?: CheckboxGroupStatus;
}

const defaultProviderValue: CheckboxGroupProviderState = {};

const { Provider, Consumer: CheckboxGroupConsumer } =
  React.createContext(defaultProviderValue);

class BaseCheckboxGroup extends Component<
  CheckboxGroupProps & SuomifiThemeProp
> {
  render() {
    const {
      children,
      className,
      theme,
      labelText,
      labelMode,
      optionalText,
      groupHintText,
      id,
      groupStatus = 'default',
      groupStatusText,
      ...passProps
    } = this.props;

    const statusTextId = !!groupStatusText ? `${id}-statusText` : undefined;

    return (
      <HtmlDivWithRef
        className={classnames(baseClassName, className)}
        id={id}
        {...passProps}
      >
        <HtmlFieldSet>
          <HtmlLegend className={checkboxGroupClassNames.legend}>
            <Label
              htmlFor={id}
              labelMode={labelMode}
              optionalText={optionalText}
              className={classnames({
                [checkboxGroupClassNames.labelIsVisible]:
                  labelMode !== 'hidden',
              })}
            >
              {labelText}
            </Label>
            {groupHintText && <HintText>{groupHintText}</HintText>}
            {groupStatusText && (
              <VisuallyHidden
                {...getConditionalAriaProp('aria-labelledby', [statusTextId])}
              />
            )}
          </HtmlLegend>
          <HtmlDiv className={checkboxGroupClassNames.container}>
            <Provider
              value={{
                status: groupStatus,
              }}
            >
              {children}
            </Provider>
          </HtmlDiv>
        </HtmlFieldSet>
        <StatusText
          className={classnames({
            [checkboxGroupClassNames.statusTextHasContent]: !!groupStatusText,
          })}
          id={statusTextId}
          status={groupStatus}
        >
          {groupStatusText}
        </StatusText>
      </HtmlDivWithRef>
    );
  }
}

const StyledCheckboxGroup = styled(BaseCheckboxGroup)`
  ${({ theme }) => baseStyles(theme)}
`;

/**
 * Use for grouping Checkboxes.
 */
const CheckboxGroup = forwardRef(
  (props: CheckboxGroupProps, ref: React.Ref<HTMLDivElement>) => {
    const { id: propId, ...passProps } = props;
    return (
      <SuomifiThemeConsumer>
        {({ suomifiTheme }) => (
          <AutoId id={propId}>
            {(id) => (
              <StyledCheckboxGroup
                theme={suomifiTheme}
                id={id}
                forwardedRef={ref}
                {...passProps}
              />
            )}
          </AutoId>
        )}
      </SuomifiThemeConsumer>
    );
  },
);

CheckboxGroup.displayName = 'CheckboxGroup';

export { CheckboxGroup, CheckboxGroupConsumer };
