/*
* https://github.com/schteppe/cannon.js/blob/master/examples/threejs_cloth.html
*/

import * as THREE from 'three'
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries.js';
import Experience from '../Experience.js'
import CANNON from 'cannon'

export default class Floor
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.physicWorld = this.experience.physicWorld.world
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.clothMass = 1;  // 1 kg in total
        this.clothSize = 1; // 1 meter
        this.Nx = 12;
        this.Ny = 12;
        this.mass = this.clothMass / this.Nx*this.Ny;
        this.restDistance = this.clothSize/this.Nx;

        this.walls = new THREE.Group()

        this.setGeometry()
        this.setPhysicParticle()
        this.setMaterial()
        this.setPhysicMaterial()
        this.setMesh()

        // Debug
        if(this.debug.active)
        {
            this.setDebug()
        }
    }

    clothFunction(){
        return ParametricGeometries.plane(this.restDistance * this.Nx, this.restDistance * this.Ny);
    }

    connect(i1,j1,i2,j2)
    {
        this.physicWorld.addConstraint( new CANNON.DistanceConstraint(this.particles[i1][j1],this.particles[i2][j2],this.restDistance) );

    }

    setGeometry()
    {
        // this.geometryLongWall = new THREE.PlaneGeometry(32, 5, 512, 512)
        // this.geometrySmallWall = new THREE.PlaneGeometry(18, 5, 512, 512)

        // cloth geometry
        this.geometryLongWall = new ParametricGeometry( ParametricGeometries.plane(this.restDistance * this.Nx, this.restDistance * this.Ny), this.Nx, this.Ny, true );
        console.log(this.geometryLongWall)
        this.geometryLongWall.dynamic = true;
        // this.geometryLongWall.computeFaceNormals();
    }

    setPhysicParticle()
    {
        this.particles = []
        // Create cannon particles
        for ( var i = 0, il = this.Nx+1; i !== il; i++ ) {
            this.particles.push([]);
            for ( var j = 0, jl = this.Ny+1; j !== jl; j++ ) {
                var idx = j*(this.Nx+1) + i;
                var p = this.clothFunction(i/(this.Nx+1), j/(this.Ny+1));
                console.log(p.x)
                var particle = new CANNON.Body({
                    mass: j==this.Ny ? 0 : this.mass
                });
                particle.addShape(new CANNON.Particle());
                particle.linearDamping = 0.5;
                particle.position.set(
                    p.x,
                    p.y-this.Ny * 0.9 * this.restDistance,
                    p.z
                );
                this.particles[i].push(particle);
                console.log(this.physicWorld);
                this.physicWorld.addBody(particle);
                particle.velocity.set(0,0,-0.1*(this.Ny-j));
            }
        }
        for(var i=0; i<this.Nx+1; i++){
            for(var j=0; j<this.Ny+1; j++){
                if(i<this.Nx) this.connect(i,j,i+1,j);
                if(j<this.Ny) this.connect(i,j,i,j+1);
            }
        }
    }

    setMaterial()
    {

        // this.material = new THREE.MeshBasicMaterial({
        //     color: new THREE.Color('#ff0000'),
        //     side: THREE.DoubleSide
        // })

        this.material = new THREE.MeshPhongMaterial( {
            alphaTest: 0.5,
            ambient: 0x000000,
            color: 0xffffff,
            specular: 0x333333,
            emissive: 0x222222,
            //shininess: 5,
            side: THREE.DoubleSide
        } );
    }

    setPhysicMaterial()
    {
        this.clothMaterial = new CANNON.Material();
    }

    setMesh()
    {
        this.meshLongWall = new THREE.Mesh(this.geometryLongWall, this.material)

        this.meshLongWall.position.set(0, 2.5, -9)

        // this.meshSmallWall = new THREE.Mesh(this.geometrySmallWall, this.material)

        // this.meshSmallWall.position.set(-16, 2.5, 0)
        // this.meshSmallWall.rotation.set(0, - Math.PI * 0.5, 0)


        this.walls.add(this.meshLongWall)
        // this.walls.add(this.meshSmallWall)

        // this.mesh.receiveShadow = true
        this.scene.add(this.walls)
    }

    setDebug()
    {
        this.debugFolder = this.debug.ui.addFolder('Wall')

        this.debugFolder.add(this.meshSmallWall.position, 'x').min(-10).max(10).step(0.5).name('position X')
        this.debugFolder.add(this.meshSmallWall.position, 'y').min(-10).max(10).step(0.5).name('position Y')
        this.debugFolder.add(this.meshSmallWall.position, 'z').min(-10).max(10).step(0.5).name('position Z')
        this.debugFolder.add(this.meshSmallWall.rotation, 'x').min(-10).max(10).step(0.001).name('rotation X')
        this.debugFolder.add(this.meshSmallWall.rotation, 'y').min(-10).max(10).step(0.001).name('rotation Y')
        this.debugFolder.add(this.meshSmallWall.rotation, 'z').min(-10).max(10).step(0.001).name('rotation Z')
    }

    update()
    {
        for ( var i = 0, il = this.Nx+1; i !== il; i++ ) {
            for ( var j = 0, jl = this.Ny+1; j !== jl; j++ ) {
                var idx = j*(this.Nx+1) + i;
                console.log( this.particles[i][j])
                this.geometryLongWall.attributes.position.array[idx] = this.particles[i][j].position.x;
            }
        }

        // this.geometryLongWall.computeFaceNormals();
        this.geometryLongWall.computeVertexNormals();

        this.geometryLongWall.normalsNeedUpdate = true;
        this.geometryLongWall.verticesNeedUpdate = true;
    }
}
