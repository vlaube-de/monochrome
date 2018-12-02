import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Draggable from '../shared/draggable';

import styled from '@emotion/styled';
import {withTheme, evaluateStyle} from '../shared/theme';

export const Container = styled.div(props => ({
  ...props.theme.__reset__,
  position: 'absolute',
  boxSizing: 'content-box',
  boxShadow: props.theme.shadow,
  left: props.left,
  top: props.top,
  width: props.width,
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor:
    props.isMoving || props.isResizing
      ? props.theme.controlColorActive
      : props.theme.backgroundInvert,
  ...evaluateStyle(props.userStyle, props)
}));

export const ContentComponent = styled.div(props => ({
  overflow: 'hidden',
  lineHeight: 0,
  boxSizing: 'content-box',
  position: 'relative',
  height: props.height,
  ...evaluateStyle(props.userStyle, props)
}));

export const TitleComponent = styled.div(props => ({
  background:
    props.isMoving || props.isResizing
      ? props.theme.controlColorActive
      : props.theme.backgroundInvert,
  color: props.theme.textColorInvert,
  textAlign: 'center',
  fontWeight: 'bold',
  lineHeight: 2,
  ...evaluateStyle(props.userStyle, props)
}));

export const Resizer = styled.div(props => ({
  position: 'absolute',
  width: 12,
  height: 12,
  right: 0,
  bottom: 0,
  zIndex: 1
}));

/**
 * @class
 */
class FloatPanel extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    // container
    parentWidth: PropTypes.number,
    parentHeight: PropTypes.number,
    // state
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    minimized: PropTypes.bool,
    // interactivity
    movable: PropTypes.bool,
    resizable: PropTypes.bool,
    minimizable: PropTypes.bool,
    // callbacks
    onUpdate: PropTypes.func
  };

  static defaultProps = {
    style: {},
    parentWidth: Infinity,
    parentHeight: Infinity,
    className: '',
    title: '',
    minimized: false,
    movable: true,
    resizable: false,
    minimizable: true,
    onUpdate: () => {}
  };

  /**
   * @constructor
   *
   * @property {string|Element} title content to display in the title bar.
   *  If empty, the title bar will be hidden.
   * @property {number} x position from the left in pixels
   * @property {number} y position from the top in pixels
   * @property {number} width width of the panel
   * @property {number} height height of the panel
   * @property {string} [className] additional class name for the container
   * @property {number} [parentWidth] width of the parent window
   * @property {number} [parentHeight]} height of the parent window
   *  If parent window size is specified, the panel cannot be moved outside of its bounds.
   * @property {boolean} [minimized] whether the panel is minimized (show only title bar)
   * @property {boolean} [movable] whether the panel can be moved, default true
   * @property {boolean} [resizable] whether the panel can be resized, default false
   * @property {boolean} [minimizable] whether the panel can be minimized, default true
   * @property {function} [onUpdate] callback when user move/resize/minimize the panel
   */
  constructor(props) {
    super(props);
    this.state = {
      isMoving: false,
      isResizing: false,
      startProps: null
    };
  }

  _onMoveStart = () => {
    const {x, y, width, height, minimized} = this.props;
    this.setState({
      isMoving: true,
      startProps: {x, y, width, height, minimized}
    });
  };

  _onMoveDrag = ({deltaX, deltaY}) => {
    const {startProps} = this.state;
    this.props.onUpdate({
      ...startProps,
      x: Math.max(0, startProps.x + deltaX),
      y: Math.max(0, startProps.y + deltaY)
    });
  };

  _onMoveEnd = ({hasDragged}) => {
    if (this.props.minimizable && this.props.title && !hasDragged) {
      const {startProps} = this.state;
      this.props.onUpdate({
        ...startProps,
        minimized: !startProps.minimized
      });
    }
    this.setState({isMoving: false});
  };

  _onResizeStart = () => {
    const {x, y, width, height, minimized} = this.props;
    this.setState({
      isResizing: true,
      startProps: {x, y, width, height, minimized}
    });
  };

  _onResizeDrag = ({deltaX, deltaY}) => {
    const {startProps} = this.state;
    this.props.onUpdate({
      ...startProps,
      width: Math.max(0, startProps.width + deltaX),
      height: Math.max(0, startProps.height + deltaY)
    });
  };

  _onResizeEnd = () => {
    this.setState({isResizing: false});
  };

  renderMover(children) {
    const {movable} = this.props;

    if (movable) {
      return (
        <Draggable
          onDragStart={this._onMoveStart}
          onDrag={this._onMoveDrag}
          onDragEnd={this._onMoveEnd}
        >
          {children}
        </Draggable>
      );
    }
    return children;
  }

  renderContent(styleProps) {
    const {style, minimized, minimizable, resizable} = this.props;

    if (minimizable && minimized) {
      return null;
    }

    return (
      <ContentComponent {...styleProps} userStyle={style.content}>
        {this.props.children}

        {resizable && (
          <Draggable
            onDragStart={this._onResizeStart}
            onDrag={this._onResizeDrag}
            onDragEnd={this._onResizeEnd}
            style={{cursor: 'nwse-resize'}}
          >
            <Resizer {...styleProps} userStyle={style.resizer} />
          </Draggable>
        )}
      </ContentComponent>
    );
  }

  render() {
    const {
      theme,
      style,
      title,
      x,
      y,
      width,
      height,
      className,
      parentWidth,
      parentHeight
    } = this.props;
    const {isMoving, isResizing} = this.state;

    const styleProps = {
      theme,
      isMoving,
      isResizing,
      width,
      height,
      left: Math.min(x, Math.max(0, parentWidth - width)),
      top: Math.min(y, Math.max(0, parentHeight - height))
    };

    // Only title bar is draggable
    return (
      <Container className={className} {...styleProps} userStyle={style.wrapper}>
        {title
          ? this.renderMover(
              <TitleComponent {...styleProps} userStyle={style.title}>
                {title}
              </TitleComponent>
            )
          : this.renderMover(this.renderContent(styleProps))}
        {title && this.renderContent(styleProps)}
      </Container>
    );
  }
}

export default withTheme(FloatPanel);
