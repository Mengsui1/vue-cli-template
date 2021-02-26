<template>
  <div class="h5v-wrap">
    <video
      crossOrigin="anonymous"
      preload="auto"
      ref="vRef"
      :src="src"
      x5-video-player-type="h5-page"
      webkit-playsinline="true"
      playsinline
      mtt-playsinline
      :poster="firstFrame"
      :controls="controls"
      @play="_play"
      @pause="_pause"
      @ended="_ended"
    />
    <div
      v-if="env.android"
      :class="{
        frame: true,
        show: frame === 'first'
      }"
      :style="{
        backgroundImage: `url('${firstFrame}')`
      }"
      @click.prevent
    />
    <div
      :class="{
        frame: true,
        show: frame === 'last'
      }"
      :style="{
        backgroundImage: `url('${lastFrame}')`
      }"
      @click.prevent
    />
    <slot></slot>
    <button v-if="debug && play" class="ff-btn" @click="_clickFF">快进</button>
  </div>
</template>
<script>
/* eslint no-unused-vars: "warn" */
import isIOS from '../../un/isIOS';
import isAndroid from '../../un/isAndroid';

const env = {
  ios: isIOS(),
  android: isAndroid()
};

export default {
  name: 'H5Video',
  model: {
    prop: 'play',
    event: 'change'
  },
  props: {
    debug: {
      type: Boolean,
      default: false
    },
    play: {
      type: Boolean
    },
    firstFrame: {
      type: String
    },
    lastFrame: {
      type: String
    },
    src: {
      type: String
    },
    controls: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      frame: 'first'
    };
  },
  computed: {
    env() {
      return env;
    }
  },
  created() {
    this.playTs = 0;
  },
  watch: {
    play(val) {
      if (val) {
        if (this.frame !== null) {
          this.frame = 'first';
        }
        let playProm = null;
        this.playTs = Date.now();
        if (window.WeixinJSBridge) {
          window.WeixinJSBridge.invoke('getNetworkType', {}, () => {
            this._log('to getNetworkType', Date.now() - this.playTs);
            playProm = this.$refs.vRef.play();
          });
        } else {
          playProm = this.$refs.vRef.play();
        }
        if (playProm) {
          playProm.catch(err => {
            this._log('play error', err.message);
          });
        }

        if (env.android) {
          this.$refs.vRef.addEventListener('timeupdate', this._onTimeUpdate);
        } else {
          this.$refs.vRef.addEventListener('play', this._onPlay);
          this.$refs.vRef.addEventListener('playing', this._onPlaying);
        }
      } else {
        this.$refs.vRef.pause();
      }
    }
  },
  beforeDestroy() {
    this.$refs.vRef.removeEventListener('timeupdate', this._onTimeUpdate);
    this.$refs.vRef.removeEventListener('play', this._onPlay);
    this.$refs.vRef.removeEventListener('playing', this._onPlaying);
  },
  methods: {
    _log(...args) {
      if (this.debug) {
        // eslint-disable-next-line no-console
        console.log('H5Video', ...args);
      }
    },
    _onTimeUpdate() {
      this._log('to timeupdate', Date.now() - this.playTs, 'ms');
      this._onFirstFrame();
      this.$refs.vRef.removeEventListener('timeupdate', this._onTimeUpdate);
    },
    _onPlay() {
      this._log('to play', Date.now() - this.playTs, 'ms');
      this._onFirstFrame();
      this.$refs.vRef.removeEventListener('play', this._onPlay);
    },
    _onPlaying() {
      this._log('to playing', Date.now() - this.playTs, 'ms');
      this.$refs.vRef.removeEventListener('playing', this._onPlaying);
    },
    _clickFF() {
      this.$refs.vRef.currentTime = this.$refs.vRef.duration - 1;
    },
    _onFirstFrame() {
      this.$emit('start');
      this.frame = null;
    },
    _play() {
      this.$emit('change', true);
    },
    _pause() {
      this.$emit('change', false);
    },
    _ended() {
      this.frame = 'last';
      this.$emit('ended');
    }
  }
};
</script>
<style scoped>
.h5v-wrap {
  position: relative;
}
.h5v-wrap > video {
  width: 100%;
  height: 100%;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
.h5v-wrap > .frame {
  width: 100%;
  height: 100%;
  z-index: 2;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  border: 0;
  pointer-events: none;
  opacity: 0;
  background-size: 100%;
  background-repeat: no-repeat;
  /* visibility: hidden; */
}
.h5v-wrap > .frame.show {
  opacity: 1;
  /* visibility: visible; */
}
.h5v-wrap > .ff-btn {
  position: absolute;
  top: 50%;
  right: 0;
  z-index: 9;
  color: red;
}
</style>
