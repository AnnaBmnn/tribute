import * as THREE from 'three'
import Experience from '../Experience.js'
import zigzagVertexShader from '../../shaders/zigzag/vertex.glsl'
import zigzagFragmentShader from '../../shaders/zigzag/fragment.glsl'

export default class Floor
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry(32, 18, 512, 512)
    }


    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            depthWrite: true,
            vertexShader: zigzagVertexShader,
            fragmentShader: zigzagFragmentShader,
            transparent: false,
            wireframe: false,
            opacity: 1,
            side: THREE.DoubleSide
        })
        // this.material = new THREE.MeshBasicMaterial()
        console.log(this.material)
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = - Math.PI * 0.5
        // this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }
}