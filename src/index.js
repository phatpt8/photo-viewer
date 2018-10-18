import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import classNames from 'classnames';
import styles from './PhotoViewer.css';

const dedupe = (item = '', i, arr) => {
  const _item = item.trim ? item.trim() : item;
  return arr.indexOf(_item) === i;
};

const isImage = (file = '') => /\.(gif|jpe?g|tiff|png|webp|heic|heif)/i.test(file);

export default class PhotoViewer extends PureComponent {
  constructor(props) {
    super(props);

    let photos = props.photo.filter(isImage).filter(dedupe);

    photos.forEach(p => {
      this[p] = React.createRef();
    });

    let currentIndex = 0;

    if (props.viewImage) {
      currentIndex = photos.findIndex(p => p.includes(props.viewImage));
      if (currentIndex === -1) {
        currentIndex = 0;
      }
    }

    this.state = {
      photos,
      currentIndex,
    };
  }

  componentDidMount() {
    const { photos } = this.state;

    if (!photos.length) return;

    let idx = 0;

    if (this.props.viewImage) {
      idx = photos.findIndex(p => p.includes(this.props.viewImage));
    }

    const currentBCR = this[photos[idx]].current.getBoundingClientRect();
    this.step = currentBCR.width;

    for (let i = 0; i < photos.length; i++) {
      const p = this[photos[i]];

      p.current.style.willChange = 'transform';
    }

    if (idx > 0) {
      while (idx--) {
        for (let i = 0; i < photos.length; i++) {
          this.transformCord[i] = this.transformCord[i] || 0;
          this.transformCord[i] -= this.step;
        }
      }
    }

    requestAnimationFrame(() => {
      for (let i = 0; i < photos.length; i++) {
        const p = this[photos[i]];

        p.current.style.transform = `translate(${this.transformCord[i]}px)`;
      }

      requestAnimationFrame(() => {
        for (let i = 0; i < photos.length; i++) {
          const p = this[photos[i]];

          p.current.style.willChange = 'initial';
        }
      });
    });
  }

  transformCord = [];

  initAnimation = nextIdx => {
    const { photos } = this.state;
    for (let i = 0; i < photos.length; i++) {
      const p = this[photos[i]];

      p.current.style.willChange = 'transform';
      p.current.style.transition = 'transform 150ms cubic-bezier(0,0,0.31,1)';
      p.current.addEventListener('transitionend', this.reset);
    }
  };

  handleLeft = () => {
    const { photos, currentIndex } = this.state;
    const nextIdx = Math.max(0, currentIndex - 1);

    if (currentIndex === nextIdx || this.isAnimating) return;

    this.isAnimating = true;

    this.initAnimation(nextIdx);

    requestAnimationFrame(() => {
      for (let i = 0; i < photos.length; i++) {
        const p = this[photos[i]];
        let cord = this.transformCord[i] || 0;
        cord += this.step;

        p.current.style.transform = `translateX(${cord}px)`;

        this.transformCord[i] = cord;
      }
    });

    this.setState({
      currentIndex: nextIdx,
    });
  };

  handleRight = () => {
    const { photos, currentIndex } = this.state;
    const nextIdx = Math.min(photos.length - 1, currentIndex + 1);

    if (currentIndex === nextIdx || this.isAnimating) return;

    this.isAnimating = true;

    this.initAnimation(nextIdx);

    requestAnimationFrame(() => {
      for (let i = 0; i < photos.length; i++) {
        const p = this[photos[i]];
        let cord = this.transformCord[i] || 0;
        cord -= this.step;

        p.current.style.transform = `translateX(${cord}px)`;

        this.transformCord[i] = cord;
      }
    });

    this.setState({
      currentIndex: nextIdx,
    });
  };

  reset = evt => {
    const p = evt.target;
    p.removeEventListener('transitionend', this.reset);
    p.style.willChange = 'initial';
    p.style.transition = '';

    this.isAnimating = false;
  };

  onClose = e => {
    const { onClose } = this.props;
    onClose && onClose(e);
  };

  render() {
    const { photos, currentIndex } = this.state;
    const hasMany = photos.length > 1;

    if (!photos.length) return null;

    return (
      <div className={styles.photoViewerMask}>
        <div className={styles.photoViewClose}>
          <Icon type="close" onClick={this.onClose} />
        </div>
        <div className={styles.photoViewerContainer}>
          <div className={styles.photoViewerMainContainer}>
            {photos.map(p => (
              <div key={p} ref={this[p]} className={styles.photoViewerCard}>
                <img src={p} alt={p} />
              </div>
            ))}
          </div>
          {hasMany && (
            <div
              onKeyDown={() => {}}
              className={classNames(
                styles.photoViewerNavContainer,
                styles.photoViewerLeftContainer,
                {
                  'not-allowed': currentIndex === 0,
                }
              )}
              onClick={this.handleLeft}
            >
              <Icon type="left" />
            </div>
          )}
          {hasMany && (
            <div
              onKeyDown={() => {}}
              className={classNames(
                styles.photoViewerNavContainer,
                styles.photoViewerRightContainer,
                {
                  'not-allowed': currentIndex === photos.length - 1,
                }
              )}
              onClick={this.handleRight}
            >
              <Icon type="right" />
            </div>
          )}
        </div>
      </div>
    );
  }
}
