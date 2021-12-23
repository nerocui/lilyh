import { Component } from "react";

import raf from "raf";
import sizeMe from "react-sizeme";

import FluidAnimation, { defaultConfig } from "./fluid-animation";

type ReactFluidAnimationProps = {
  content?: string,
  config: any,
  style?: any,
  animationRef: (ref: any) => void,
  size?: {
    width: number,
    height: number
  }
}

class ReactFluidAnimation extends Component<ReactFluidAnimationProps> {

  static defaultProps = {
    config: defaultConfig,
    style: {}
  };
  _animation: any;
  _tickRaf: any;
  _container: any;
  _canvas: any;

  componentWillReceiveProps(props: any) {
    this._onResize();

    if (props.config) {
      this._animation.config = {
        ...props.config,
        defaultConfig
      };
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this._onResize);
    this._reset(this.props);
    this._tick();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._onResize);
    if (this._tickRaf) {
      raf.cancel(this._tickRaf);
      this._tickRaf = null;
    }
  }

  render() {
    const { content, config, animationRef, style, size, ...rest } = this.props as any;

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          ...style
        }}
        {...rest}
        ref={this._containerRef}
      >
        <canvas
          ref={this._canvasRef}
          onMouseDown={this._onMouseDown}
          onMouseMove={this._onMouseMove}
          onMouseUp={this._onMouseUp}
          onTouchStart={this._onTouchStart}
          onTouchMove={this._onTouchMove}
          onTouchEnd={this._onTouchEnd}
          style={{
            width: "100%",
            height: "100%"
          }}
        />
      </div>
    );
  }

  _containerRef = (ref: any) => {
    this._container = ref;
  };

  _canvasRef = (ref: any) => {
    this._canvas = ref;
  };

  _onMouseDown = (event: any) => {
    event.preventDefault();
    this._animation.onMouseDown(event.nativeEvent);
  };

  _onMouseMove = (event: any) => {
    event.preventDefault();
    this._animation.onMouseMove(event.nativeEvent);
  };

  _onMouseUp = (event: any) => {
    event.preventDefault();
    this._animation.onMouseUp(event.nativeEvent);
  };

  _onTouchStart = (event: any) => {
    this._animation.onTouchStart(event.nativeEvent);
  };

  _onTouchMove = (event: any) => {
    this._animation.onTouchMove(event.nativeEvent);
  };

  _onTouchEnd = (event: any) => {
    this._animation.onTouchEnd(event.nativeEvent);
  };

  _onResize = () => {
    this._canvas.width = this._container.clientWidth;
    this._canvas.height = this._container.clientHeight;

    if (this._animation) {
      this._animation.resize();
    }
  };

  _tick = () => {
    if (this._animation) {
      this._animation.update();
    }

    this._tickRaf = raf(this._tick);
  };

  _reset(props: any) {
    const { animationRef, content, config } = props;

    this._onResize();

    this._animation = new FluidAnimation({
      canvas: this._canvas,
      content,
      config
    });

    if (animationRef) {
      animationRef(this._animation);
      // this._animation.addRandomSplats(parseInt(Math.random() * 20) + 5)
    }
  }
}

export default sizeMe({ monitorWidth: true, monitorHeight: true })(
  ReactFluidAnimation
);
