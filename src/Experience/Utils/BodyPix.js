/**
 * 
 * https://github.com/tensorflow/tfjs-models/tree/master/body-segmentation/src/body_pix
 * 
 */
import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'
import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';



export default class BodyPix  extends EventEmitter
{
    constructor()
    {
        super()

        this.experience = new Experience()
        this.mediaDevices = this.experience.mediaDevices
        this.isReady = false

        // Config
        this.segmentationConfig = {
            multiSegmentation: false, 
            segmentBodyParts: false,
        };

        // Initialize model to detect body 
        this.initModel().then(()=>{
            this.segmentPeople(this.videoDom)
        })

        // Wait until video is ready
        this.mediaDevices.on('streamReady', () =>
        {
            this.videoDom = this.mediaDevices.videoDom
        })
    }
    async initModel()
    {
        this.model = bodySegmentation.SupportedModels.BodyPix;
        this.segmenterConfig = {
          architecture: 'MobileNetV1',
          outputStride: 8,
          quantBytes: 2,
        };
        this.segmenter = await bodySegmentation.createSegmenter(this.model, this.segmenterConfig);

    }

    async segmentPeople(image)
    {
        console.log(this.segmenter)
        this.people = await this.segmenter
            .segmentPeople(image, this.segmentationConfig)
            .then((result)=>
            {
                this.mask = result
                this.trigger('ready')
                this.isReady = true
            });
    }


}