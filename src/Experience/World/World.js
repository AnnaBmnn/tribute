import Experience from '../Experience.js'
import Environment from './Environment.js'
import Person from './Person.js'
import Floor from './Floor.js'
import Wall from './Wall.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            // this.person = new Person()
            this.environment = new Environment()
            this.floor = new Floor()
            this.wall = new Wall()
        })
    }

    update()
    {
        if(this.person){
            this.person.update()
        }
        if(this.wall){
            // this.wall.update()
        }
    }
}