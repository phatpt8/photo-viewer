# photo-viewer
React Photo Slider Component

# TL:DR
This is a demonstration on how to apply transform and requestAnimationFrame on daily use Photo slider

# How it look
- [figure 1](https://drive.google.com/file/d/1fvCDEXefaKvVleoj9U85bqB_yPV1Aq-F/view?usp=sharing "How it look")

# How it work
- [video](https://drive.google.com/file/d/1Sv-_k_cUm-_XfH33vvRRxvURINqe8-LX/view?usp=sharing "How it work")

# Performance
- [figure 2](https://drive.google.com/file/d/1BNGiZ7nIvVEOYIjgQrNlJdSaBRtdm6Qd/view?usp=sharing "Perf")
- [figure 3](https://drive.google.com/file/d/1U9m3xh7Z2DdT7Sc3WXuPlIahkvS_cOk0/view?usp=sharing "Perf")


> For the yellow long rectangle, I believe it causes by framework or some hook event from other part of project when I made this performance record ... We can focus on that green tiny line, called Composite Layers! 👍

# Technique

1. To optimize [browser repaint processes](https://css-tricks.com/browser-painting-and-considerations-for-web-performance/) I have use several techniques:
- [will-change](https://dev.opera.com/articles/css-will-change-property/) (js: style.willChange): Perhaps you already familiar with this trick to give browser a tip about that element will have animations soon, browser will create a [composite layer](https://developers.google.com/web/fundamentals/performance/rendering/simplify-paint-complexity-and-reduce-paint-areas) for each element. If you don't know it, it work the same as old trick: translateZ(0);
- [transform, opacity](https://medium.com/outsystems-experts/how-to-achieve-60-fps-animations-with-css3-db7b98610108): This is the best for animation
requestAnimationFrame: why not? everyone should use it for render/animation, instead of setTimeout/setInterval

# Improvement

[ ] Image lazy loading

[ ] Support > 10 images (let say 1000 images)


