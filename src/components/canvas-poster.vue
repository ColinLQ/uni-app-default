<template>
  <div>
    <canvas canvas-id="canvas-poster" :style="[canvasStyle]"></canvas>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'vue-property-decorator'

  @Component
  export default class HtmlToImg extends Vue {
    @Prop({ type: Array, default: () => ([]) }) contentConfig
    @Prop({ type: Object, default: () => ({}) }) canvasConfig

    config = {
      width: '300px',
      height: '300px',
      fileType: 'png',
      quality: 1,
    }

    arrayConfig = []

    created() {
      Object.assign(this.config, this.canvasConfig);
      this.arrayConfig = this.contentConfig;
    }

    async init(config) {
      config && (this.arrayConfig = config);
      await this.dowLoadImage();
      await this.initCanvas();
    }

    dowLoadImage() {
      const images = this.arrayConfig.filter(item => item.type === 'image' && /^http/.test(item.url))
      return Promise.all(images.map(async item => {
        const { path } = await uni.getImageInfo({ src: item.url });
        item.url = path;
      }));
    }

    // 初始化canvas
    async initCanvas() {
      // ctx 不需要被监听，所以不用先初始化
      this.ctx = uni.createCanvasContext('canvas-poster', this);

      const drawArr = [ ...this.arrayConfig ];
      let count = 0;
      const forEach = async () => {
        const configItem = drawArr.shift();
        if (!configItem) { return; }
        count++;
        this.ctx.save(); // 保存绘图上下文
        switch (configItem.type.toLowerCase()) {
          case 'image':
            this.drawImage(configItem);
            break;
          case 'text':
            this.handleDrawText(configItem);
            break;
          case 'background':
            this.drawBackground(configItem);
            break;
          case 'border':
            this.drawBorder(configItem);
            break;
        }
        this.ctx.restore(); // 恢复绘图上下文
        if (count >= 3) { // 每绘制3次 就画一次到canvas中
          await this.draw(true);
          count = 0;
        }
        await forEach();
      }

      await forEach();

      // 防止连续 draw 两次，导致安卓手机一直无法触发第二次 draw 的回调
      count !== 0 && (await this.draw(true));
      this.$emit('success', this.ctx);
    }

    drawImage(config) {
      const { top, left, width, height, url, isArc = false } = config;
      if (isArc) {
        // 画圆形图片
        this.createArcClip(config);
        this.ctx.drawImage(url, left, top, width, height);
      } else {
        this.ctx.drawImage(url, left, top, width, height);
      }
    }

    createArcClip(config) {
      const { top = 0, left = 0, width, height } = config;
      const x = width / 2 + left;
      const y = height / 2 + top;
      const r = Math.min(width / 2, height / 2);
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, 2 * Math.PI);
      this.ctx.setStrokeStyle('transparent');
      this.ctx.stroke(); // 不能删，否则剪切区域可能会将重叠区域计算进去
      this.ctx.clip(); // 创建圆形剪切区域
    }

    handleDrawText(config) {
      if (config.text instanceof Array) {
        const textArr = config.text;
        textArr.map(textObj => {
          Object.assign(config, textObj)
          const { left, textWidth } = this.drawText(config);
          // 多行文本 textAlign 暂时不支持 center
          config.left = config.textAlign === 'right' ? left - textWidth : left + textWidth;
        })
      } else {
        this.drawText(config)
      }
    }

    drawText(config) {
      let {
        text = '',
        font,
        maxRow = 1,
        maxWidth = 1000,
        ellipsis = true,
        top = 0,
        left = 0,
        fontSize,
        color = '#000000',
        textAlign = 'left',
        baseline = 'normal',
        lineHeight,
        margin = 0,
      } = config;
      lineHeight = lineHeight || fontSize * 1.5;
      font && (this.ctx.font = font);
      this.ctx.setTextAlign(textAlign);
      fontSize && this.ctx.setFontSize(fontSize);
      this.ctx.setFillStyle(color);
      this.ctx.setTextBaseline(baseline);
      const { textArr, textWidth } = this.sliceText(text, { maxRow, maxWidth, ellipsis });
      textArr.forEach((textSliced, index) => {
        // 多行文本 textAlign 暂时不支持 center
        const y = textAlign === 'right' ? (left - margin) : (left + margin);
        this.ctx.fillText(textSliced, y, top + index * lineHeight, maxWidth);
      })
      return { ...config, textWidth };
    }

    // 分割字符串
    sliceText(text, config) {
      const { maxRow = 1, maxWidth, ellipsis } = config
      const textArr = [];
      let textWidth = 0;
      for (let i = 0; i < text.length; i++) {
        const textLine = (textArr[Math.max(textArr.length - 1, 0)] || '') + text[i];
        textWidth = this.ctx.measureText(textLine).width;
        const index = Math.max(textWidth > maxWidth ? textArr.length : textArr.length - 1, 0);
        textArr[index] = (textArr[index] || '') + text[i];
      }

      if (textArr.length > maxRow) {
        textArr.length = maxRow;
        if (ellipsis) {
          textArr[maxRow - 1] = textArr[maxRow - 1].slice(0, -2) + '...';
        }
      }
      return {
        textArr,
        textWidth: textWidth > maxWidth ? maxWidth : textWidth,
      };
    }

    drawBackground(config) {
      const { top = 0, left = 0, width, height, color, alpha = 1, isArc = false } = config;
      isArc && this.createArcClip(config);
      this.ctx.setGlobalAlpha(alpha);
      this.ctx.setFillStyle(color);
      this.ctx.fillRect(left, top, width, height);

    }

    drawBorder(config) {
      const { top = 0, left = 0, width, height, color } = config;
      this.ctx.setStrokeStyle(color);
      this.ctx.strokeRect(left, top, width, height);
    }

    draw(reserve, callback) {
      return new Promise(resolve => {
        this.ctx.draw(reserve, () => {
          callback && callback();
          resolve();
        })
      })
    }

    canvasToTempFilePath() {
      const { fileType, quality } = this.config;
      return uni.canvasToTempFilePath({
        canvasId: 'canvas-poster',
        fileType,
        quality
      }, this);
    }

    get canvasStyle() {
      const { width, height } = this.config;
      return { width, height }
    }
  }
</script>

<style lang="less" scoped>
</style>
