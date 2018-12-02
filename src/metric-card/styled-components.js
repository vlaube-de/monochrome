import styled from '@emotion/styled';

import {evaluateStyle} from '../shared/theme';

export const CardContainer = styled.div(props => ({
  position: 'relative',
  fontSize: props.theme.fontSize,
  ...evaluateStyle(props.userStyle, props)
}));

export const CardTitle = styled.div(props => ({
  textAlign: 'center',
  fontWeight: 200,
  fontSize: '1.6em',
  maxWidth: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  ...evaluateStyle(props.userStyle, props)
}));

export const ErrorMessage = styled.div(props => ({
  fontWeight: 'bold',
  textAlign: 'center',
  margin: props.theme.spacingNormal,
  color: props.theme.textColorError,
  ...evaluateStyle(props.userStyle, props)
}));

// react-vis styles
/* Adpated from react-vis/dist/styles/plot.scss */
export const ChartContainer = styled.div(props => ({
  width: props.width,
  height: props.height,
  cursor: 'pointer',
  background: props.theme.background,

  '.rv-xy-plot': {
    color: props.theme.textColorPrimary,
    position: 'relative'
  },
  '.rv-xy-plot__inner': {
    display: 'block',
    position: 'relative',
    zIndex: 1
  },
  '.rv-xy-plot__axis__line': {
    display: 'none'
  },
  '.rv-xy-plot__axis__tick__line': {
    display: 'none'
  },
  '.rv-xy-plot__axis__tick__text': {
    fill: props.theme.textColorPrimary,
    fontSize: '0.8em'
  },
  '.rv-xy-plot__series, .rv-xy-plot__series path': {
    pointerEvents: 'all'
  },
  '.rv-xy-plot__series--line': {
    fill: 'none',
    stroke: '#000',
    strokeWidth: 2
  },
  '.rv-xy-plot__grid-lines__line': {
    stroke: props.theme.textColorSecondary,
    strokeDasharray: '1,2'
  },
  '.rv-xy-plot__series--mark circle': {
    pointerEvents: 'none'
  },

  '.rv-crosshair': {
    position: 'absolute',
    pointerEvents: 'none',
    fontSize: props.theme.fontSize
  },
  '.rv-crosshair__line': {
    background: props.theme.textColorPrimary,
    width: 1
  },
  '.rv-crosshair__inner': {
    zIndex: 2,
    margin: -6,
    transform: 'translateY(100%)',
    bottom: 0,
    display: 'none',
    position: 'absolute',
    textAlign: 'left'
  },
  '&:hover .rv-crosshair__inner': {
    display: 'block'
  },
  '.rv-crosshair__inner__content': {
    borderRadius: 2,
    background: props.theme.backgroundInvert,
    color: props.theme.textColorInvert,
    padding: props.theme.spacingSmall,
    boxShadow: props.theme.shadow,

    ...evaluateStyle(props.tooltipStyle, props)
  },
  '.rv-crosshair__item': {
    whiteSpace: 'nowrap',
    fontSize: '0.9em',
    lineHeight: '18px',
    position: 'relative'
  },

  ...evaluateStyle(props.userStyle, props)
}));

export const CrosshairItemTitle = styled.span(props => ({
  fontWeight: 'bold',
  marginRight: props.theme.spacingTiny,

  ...evaluateStyle(props.userStyle, props)
}));

export const CrosshairItemValue = styled.span(props => ({
  span: {
    color: props.theme.textColorSecondary,
    marginLeft: props.theme.spacingTiny
  },

  ...evaluateStyle(props.userStyle, props)
}));

export const CrosshairItemLegend = styled.div(props => {
  const style = {
    background: props.color,
    width: 4,
    left: -10,
    height: 18,
    top: 0,
    bottom: 0,
    position: 'absolute'
  };

  if (props.isFirst) {
    style.height += props.theme.spacingSmall;
    style.top = -props.theme.spacingSmall;
    style.borderTopLeftRadius = 4;
  }
  if (props.isLast) {
    style.height += props.theme.spacingSmall;
    style.bottom = -props.theme.spacingSmall;
    style.borderBottomLeftRadius = 4;
  }

  return Object.assign(style, evaluateStyle(props.userStyle, props));
});

export const FilterContainer = styled.div(props => ({
  fontSize: props.theme.fontSize,

  ...evaluateStyle(props.userStyle, props)
}));

export const FilterToggle = styled.div(props => ({
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: props.theme.spacingNormal,
  marginBottom: props.theme.spacingNormal,

  '&:before': {
    content: props.isExpanded ? '"➖ Show Less"' : '"➕ Show All"'
  },

  ...evaluateStyle(props.userStyle, props)
}));

export const FilterItem = styled.div(props => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  marginBottom: props.theme.spacingTiny,

  fontWeight: props.isHovered ? 'bold' : 'normal',
  color: props.isActive ? props.theme.textColorPrimary : props.theme.textColorDisabled,

  ...evaluateStyle(props.userStyle, props)
}));

export const FilterLegend = styled.div(props => ({
  display: 'inline-block',
  width: 16,
  height: 16,
  borderRadius: '50%',
  marginRight: props.theme.spacingSmall,
  textAlign: 'center',
  background: props.isActive ? props.color : props.theme.controlColorDisabled,
  color: props.theme.textColorInvert,

  '&:before': {
    fontWeight: 'normal',
    content: props.isActive ? '"✓"' : '""'
  },

  ...evaluateStyle(props.userStyle, props)
}));
