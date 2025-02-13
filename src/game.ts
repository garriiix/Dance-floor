const colors = [
  '#1dccc7',
  '#ffce00',
  '#9076ff',
  '#fe3e3e',
  '#3efe94',
  '#3d30ec',
  '#6699cc'
]

///////////////////////////////
// Custom components

@Component('tileFlag')
export class TileFlag {}

@Component('beat')
export class Beat {
  interval: number
  timer: number
  constructor(interval: number = 0.5) {
    this.interval = interval
    this.timer = interval
  }
}

///////////////////////////
// Entity groups

const tiles = engine.getComponentGroup(TileFlag)

///////////////////////////
// Systems

export class changeColor implements ISystem {
  update(dt: number) {
    const beat = beatKeeper.getComponent(Beat)
    beat.timer -= dt
    if (beat.timer < 0) {
      beat.timer = beat.interval
      for (const tile of tiles.entities) {
        const colorNum = Math.floor(Math.random() * colors.length)
        tile.addComponentOrReplace(tileMaterials[colorNum])
      }
    }
  }
}

engine.addSystem(new changeColor())

///////////////////////////
// INITIAL ENTITIES

// Create materials
const tileMaterials: Material[] = []
for (let i = 0; i < colors.length; i++) {
  const material = new Material()
  material.albedoColor = Color3.FromHexString(colors[i])
  tileMaterials.push(material)
}

// Add Tiles
;[0, 1, 2, 3, 4, 5].forEach((x) => {
  ;[0, 1, 2, 3, 4, 5].forEach((z) => {
    const tile = new Entity()
    tile.addComponent(new PlaneShape())
    tile.addComponent(
      new Transform({
        position: new Vector3(x * 4 + 2, 0, z * 4 + 2),
        rotation: Quaternion.Euler(90, 0, 0),
        scale: new Vector3(4, 4, 4)
      })
    )
    tile.addComponent(new TileFlag())
    const colorNum = Math.floor(Math.random() * colors.length)
    tile.addComponent(tileMaterials[colorNum])
    engine.addEntity(tile)
  })
})

// Add dancing Trevor
const trevor = new Entity()
trevor.addComponent(new GLTFShape('models/Trevor.glb'))
const clipDance = new AnimationState('Armature_Idle')
const animator = new Animator()
animator.addClip(clipDance)
trevor.addComponent(animator)
clipDance.play()
trevor.addComponent(
  new Transform({
    position: new Vector3(5, 0.1, 5),
    rotation: Quaternion.Euler(0, -90, 0),
    scale: new Vector3(1.5, 1.5, 1.5)
  })
)

const audioClip = new AudioClip('sounds/Vexento.mp3')
audioClip.loop = true
const audioSource = new AudioSource(audioClip)
trevor.addComponent(audioSource)

engine.addEntity(trevor)

// Singleton to keep track of the beat
const beatKeeper = new Entity()
beatKeeper.addComponent(new Beat(0.5))

audioSource.playing = true
const party = new Entity()
party.addComponent(new GLTFShape("models/faucet_GibsonMateBlack.glb"))
party.addComponent(new Transform({
  position: new Vector3(0,1,0),
  scale: new Vector3().setAll(1),
  rotation: new Quaternion().setEuler(0, 0, 0)
}))
engine.addEntity(party)