/* global document */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {getCSSVendorPrefix, getPageOffset} from '../../utils/dom';

const vendorPrefix = getCSSVendorPrefix();

const STYLES = {
  enabled: {
    cursor: `${vendorPrefix}grab`
  },
  active: {
    cursor: `${vendorPrefix}grabbing`
  },
  backdrop: {
    position: 'fixed',
    zIndex: 999,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  }
};

function noop() {};

/**
 * @class
 */
export default class Draggable extends PureComponent {

  static propTypes = {
    // container
    className: PropTypes.string,
    style: PropTypes.object,
    // config
    isEnabled: PropTypes.bool,
    threshold: PropTypes.number,
    // callbacks
    onStart: PropTypes.func,
    onDrag: PropTypes.func,
    onEnd: PropTypes.func
  };

  static defaultProps = {
    className: '',
    isEnabled: true,
    threshold: 0,
    onStart: noop,
    onDrag: noop,
    onEnd: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      isMouseDown: false,
      dragStartPos: null,
      hasDragged: false
    };
  }

  _getEventData = (evt, offset = this.state.offset) => {
    const {dragStartPos, hasDragged} = this.state;
    const result = {
      srcEvent: evt,
      x: evt.clientX,
      y: evt.clientY,
      offsetX: evt.pageX - offset.left,
      offsetY: evt.pageY - offset.top,
      hasDragged
    };
    if (dragStartPos) {
      result.deltaX = result.x - dragStartPos.x;
      result.deltaY = result.y - dragStartPos.y;
    } else {
      result.deltaX = 0;
      result.deltaY = 0;
    }
    return result;
  }

  _onMouseDown = (evt) => {
    if (!this.props.isEnabled) {
      return;
    }
    evt.stopPropagation();

    const offset = getPageOffset(this._element);
    const eventData = this._getEventData(evt, offset);

    this.setState({
      isMouseDown: true,
      hasDragged: false,
      offset,
      dragStartPos: {x: eventData.x, y: eventData.y}
    });
    this.props.onStart(eventData);
  };

  _onMouseMove = (evt) => {
    if (!this.props.isEnabled) {
      return;
    }
    evt.stopPropagation();

    if (this.state.isMouseDown) {
      const eventData = this._getEventData(evt);
      const {deltaX, deltaY} = eventData;

      if (!this.state.hasDragged) {
        if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) >= this.props.threshold) {
          this.setState({hasDragged: true});
        } else {
          return;
        }
      }
      this.props.onDrag(eventData);
    }
  };

  _onMouseUp = (evt) => {
    if (this.state.isMouseDown) {
      this.setState({
        isMouseDown: false,
        dragStartPos: null
      });
      this.props.onEnd(this._getEventData(evt));
    }
  };

  render() {
    const {isEnabled, style} = this.props;
    const {isMouseDown} = this.state;

    const containerStyle = Object.assign({},
      isEnabled ? STYLES.enabled : null,
      isMouseDown ? STYLES.active : null,
      style,
    );

    const className = classnames(
      'mc-draggable',
      this.props.className,
      {disabled: !isEnabled}
    );

    return (
      <div className={className}
        ref={ref => {
          this._element = ref;
        }}
        style={containerStyle}
        onMouseDown={this._onMouseDown}
        onMouseMove={this._onMouseMove}
        onMouseLeave={this._onMouseUp}
        onMouseUp={this._onMouseUp}>

        {isMouseDown && <div style={STYLES.backdrop} />}

        {this.props.children}

      </div>
    );
  }
}