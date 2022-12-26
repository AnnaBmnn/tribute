import * as THREE from 'three'
import Experience from '../Experience.js'
import maskVertexShader from '../../shaders/mask/vertex.glsl'
import maskFragmentShader from '../../shaders/mask/fragment.glsl'

export default class Person
{
    constructor()
    {
        this.experience = new Experience()
        this.mediaDevices = this.experience.mediaDevices
        this.bodyPix = this.experience.bodyPix

        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setGeometry()

        console.log(this.mediaDevices)

        // Wait until video is ready
        this.videoDom = this.mediaDevices.videoDom
        this.setTextures()
        this.setMaterial()
        this.setMesh()

        this.bodyPix.on('ready', ()=>{
            this.setMaskTexture(this.bodyPix.mask[0].mask.mask)
        })


    }

    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry( 19, 8, 512, 512 )
    }

    setTextures()
    {
        this.textures = {}
        this.textures.color = new THREE.VideoTexture( this.videoDom )
    }
    setMaskTexture(dataBodyPix)
    {
        const dataTexture = new THREE.DataTexture( dataBodyPix.data, dataBodyPix.width, dataBodyPix.height );
        dataTexture.needsUpdate = true;
        dataTexture.flipY = true;
        this.material.uniforms.uMask.value = dataTexture;
    }

    setMaterial()
    {
        // this.material = new THREE.MeshBasicMaterial({
        //     map: this.textures.color,
        //     wireframe: false
        // })
        this.material = new THREE.ShaderMaterial({
            depthWrite: true,
            vertexShader: maskVertexShader,
            fragmentShader: maskFragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            opacity: 1,
            uniforms: {
                uTime: {value: 0},
                uTexture: { type: "t", value: this.textures.color},
                uMask: { type: "t", value: null}
            }
        })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    update()
    {
        if(this.bodyPix.isReady){
            this.bodyPix.segmentPeople(this.videoDom)
        }
    }
}