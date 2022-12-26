import * as THREE from 'three'
import Experience from './Experience.js'
import CANNON from 'cannon'

export default class PhysicWorld
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes

        this.world = new CANNON.World()
        this.world.gravity.set(0, - 9.82, 0)
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 20;
    }


    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    update()
    {
        this.instance.render(this.scene, this.camera.instance)
    }
}