import EventEmitter from './EventEmitter.js'


export default class MediaDevices extends EventEmitter
{
    constructor()
    {
        super()

        // Create a camera capture 
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
          }).then((stream) => {
            /* use the stream */
            this.stream = stream;

            // Use stream or dom video src 
            this.videoDom = document.querySelector('.video');
            this.videoDom.srcObject = stream;
            this.videoDom.play()

            // Tells that stream is ready
            this.trigger('streamReady')
            this.trigger('videoReady')

        }).catch((err) => {
            /* handle the error */
            this.trigger('streamError')
        });
    }
}