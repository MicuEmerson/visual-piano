# Visual Piano

![Screenshot](https://github.com/MicuEmerson/piano-app/blob/develop/visual-piano.jpg)
<h1 style="text-align:center"> <a href="https://micuemerson.github.io/visual-piano" target="_blank"> Try it out! </a> </h1>
<h2>Description</h2>
The purpose of this project is to create a tool that allows you to visualise musical pitches and it can also record and play music.
<h3> Technologies used: </h3>
  <ul>
    <li> <a target="_blank" href="https://vuejs.org/">Vue</a> as the main js framework</li>
    <li> <a target="_blank" href="https://vuex.vuejs.org/">Vuex</a> for state management</li>
    <li> <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas">Canvas</a> for drawning animations, more specific I used <a href="https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas"> Offscreencanvas </a> for performance reason</li>
    <li> <a target="_blank" href="https://tonejs.github.io/">Tone.js </a> for audio part </li>
    <li> <a target="_blank" href="https://vuetifyjs.com/en/"> Vuetify</a> for some material components </li>
  </ul>

## Support
Currently it works only in Chrome and Edge because of <a target="_blank" href="https://caniuse.com/offscreencanvas"> offscreencanvas</a>, in firefox it can be <a  target="_blank" href="https://hacks.mozilla.org/2016/01/webgl-off-the-main-thread/"> enabled </a>.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## License

MIT
