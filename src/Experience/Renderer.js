import * as THREE from 'three'
import Experience from './Experience.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug
        this.debugParams = {
            color: '#000000'
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Renderer')
        }

        this.setInstance()

        // Add Passes
        this.setPostProcessing()
        this.setBloomPass()
    }

    setInstance()
    {

        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })

        this.instance.physicallyCorrectLights = true
        this.instance.outputEncoding = THREE.sRGBEncoding
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setClearColor(this.debugParams.color)
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder.addColor( this.debugParams, 'color' ).onChange( ( value ) => {
                this.instance.setClearColor(value)
            } );
        }
    }

    setPostProcessing()
    {
        const renderTarget = new THREE.WebGLRenderTarget(
            800,
            600,
            {
                samples: this.instance.getPixelRatio() === 1 ? 2 : 0,
            }
        )
        this.effectComposer = new EffectComposer(this.instance, renderTarget)
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio)
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        
        const renderPass = new RenderPass(this.scene, this.camera.instance)
        this.effectComposer.addPass(renderPass)

    }
    setBloomPass()
    {
        const unrealBloomPass = new UnrealBloomPass()
        unrealBloomPass.strength = 0.3
        unrealBloomPass.radius = 1.0
        unrealBloomPass.threshold = 0.6
        unrealBloomPass.enabled = false
        this.effectComposer.addPass(unrealBloomPass)

        if(this.debug.active)
        {
            this.debugFolder.add(unrealBloomPass, 'enabled')
            this.debugFolder.add(unrealBloomPass, 'strength').min(0).max(2).step(0.001)
            this.debugFolder.add(unrealBloomPass, 'radius').min(0).max(2).step(0.001)
            this.debugFolder.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001)
        }
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio) 
    }

    update()
    {
        this.effectComposer.render(this.scene, this.camera.instance)
    }
}