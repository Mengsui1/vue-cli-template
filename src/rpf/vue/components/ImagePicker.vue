<template>
  <input type="file" :accept="accept" @[eventType]="_onInput" />
</template>
<script>
// polyfill
import 'blueimp-canvas-to-blob';
import loadImage from 'blueimp-load-image';
import isWeChat from '../../un/isWeChat';
import wxGetLocalImgData from '../../un/wxGetLocalImgData';

const env = {
  wechat: isWeChat()
};

// https://www.npmjs.com/package/blueimp-load-image#options
const defaultOptions = {
  maxWidth: 750,
  orientation: true,
  canvas: true
};

const defaultWxOptions = {
  count: 1,
  sizeType: ['original', 'compressed'],
  sourceType: ['album', 'camera']
};

function pick(names, obj) {
  var result = {};
  var idx = 0;
  while (idx < names.length) {
    if (names[idx] in obj) {
      result[names[idx]] = obj[names[idx]];
    }
    idx += 1;
  }
  return result;
}

export default {
  name: 'ImagePicker',
  props: {
    accept: {
      type: String,
      default: 'image/*'
    },
    options: {
      type: Object,
      default: () => {}
    },
    wxOptions: {
      type: Object,
      default: () => {}
    },
    validate: {
      type: Function,
      default: () => true
    }
  },
  computed: {
    eventType() {
      return env.wechat ? 'click' : 'change';
    }
  },
  methods: {
    _onInput(e) {
      return env.wechat ? this._onClickInput(e) : this._onFileChange(e);
    },
    async _onFileChange(e) {
      const file = e.target.files[0];
      if (!this.validate || this.validate(file)) {
        const data = await this._compressImage(file);
        this.$emit('pick', data.image);
      }
    },
    async _onClickInput(e) {
      e.preventDefault();
      window.wx.chooseImage({
        ...pick(['count', 'sizeType', 'sourceType'], {
          ...defaultWxOptions,
          ...this.wxOptions
        }),
        success: async res => {
          const { localIds } = res;
          if (!this.validate || this.validate(res)) {
            if (localIds.length === 1) {
              const canvas = await this._localIdToCanvas(localIds[0]);
              this.$emit('pick', canvas);
            } else {
              Promise.all(
                localIds.map(id => {
                  return this._localIdToCanvas(id);
                })
              ).then(canvases => {
                this.$emit('pick', canvases);
              });
            }
          }
        }
      });
    },
    _compressImage(fileOrUrl) {
      return loadImage(fileOrUrl, {
        ...defaultOptions,
        ...this.options
      });
    },
    async _localIdToCanvas(localId) {
      const { localData } = await wxGetLocalImgData({
        localId
      });
      const data = await this._compressImage(localData);
      return data.image;
    }
  }
};
</script>
