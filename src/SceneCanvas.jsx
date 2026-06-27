import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function makeGabledRoof() {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      [
        -3.1, 3, -2.5,
        3.1, 3, -2.5,
        0, 4.8, -2.5,
        -3.1, 3, 2.5,
        3.1, 3, 2.5,
        0, 4.8, 2.5,
      ],
      3,
    ),
  )
  geometry.setIndex([
    0, 2, 1,
    3, 4, 5,
    0, 3, 5,
    0, 5, 2,
    1, 2, 5,
    1, 5, 4,
    0, 1, 4,
    0, 4, 3,
  ])
  geometry.computeVertexNormals()
  return geometry
}

function addBox(parent, size, position, material, castShadow = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material)
  mesh.position.set(...position)
  mesh.castShadow = castShadow
  mesh.receiveShadow = true
  parent.add(mesh)
  return mesh
}

export default function SceneCanvas({ language }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = canvas.parentElement
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x9bd7ee)
    scene.fog = new THREE.Fog(0x9bd7ee, 18, 38)

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(11, 8, 14)
    camera.lookAt(0, 1.7, 0)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace

    scene.add(new THREE.HemisphereLight(0xdff6ff, 0x496d31, 2.1))
    const sunlight = new THREE.DirectionalLight(0xfff1c4, 3.5)
    sunlight.position.set(-8, 14, 10)
    sunlight.castShadow = true
    sunlight.shadow.mapSize.set(1024, 1024)
    sunlight.shadow.camera.left = -14
    sunlight.shadow.camera.right = 14
    sunlight.shadow.camera.top = 14
    sunlight.shadow.camera.bottom = -14
    scene.add(sunlight)

    const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x5f9f45, roughness: 1 })
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 35), grassMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    const house = new THREE.Group()
    house.rotation.y = -0.08
    house.position.set(0, 0, -1)
    scene.add(house)

    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf0c987, roughness: 0.9 })
    const timberMaterial = new THREE.MeshStandardMaterial({ color: 0x5b3825, roughness: 0.95 })
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xa84232, roughness: 0.88 })
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x9ddcff,
      emissive: 0x245270,
      emissiveIntensity: 0.18,
      roughness: 0.2,
    })

    addBox(house, [6, 3, 4.7], [0, 1.5, 0], wallMaterial)
    const roof = new THREE.Mesh(makeGabledRoof(), roofMaterial)
    roof.castShadow = true
    roof.receiveShadow = true
    house.add(roof)

    addBox(house, [1.25, 2.25, 0.18], [0, 1.12, 2.44], timberMaterial)
    const handle = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 12, 8),
      new THREE.MeshStandardMaterial({ color: 0xe5ba55, metalness: 0.55, roughness: 0.35 }),
    )
    handle.position.set(0.4, 1.1, 2.58)
    house.add(handle)

    for (const x of [-1.85, 1.85]) {
      addBox(house, [1.15, 1.05, 0.14], [x, 1.75, 2.46], glassMaterial)
      addBox(house, [0.1, 1.18, 0.2], [x, 1.75, 2.55], timberMaterial)
      addBox(house, [1.28, 0.1, 0.2], [x, 1.75, 2.55], timberMaterial)
    }

    addBox(house, [0.75, 2, 0.8], [-1.75, 4.45, -0.75], timberMaterial)

    const pathMaterial = new THREE.MeshStandardMaterial({ color: 0xcbb98d, roughness: 1 })
    for (let i = 0; i < 8; i += 1) {
      const stone = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.08, 0.8), pathMaterial)
      stone.position.set(Math.sin(i * 1.7) * 0.14, 0.045, 2.1 + i * 0.88)
      stone.rotation.y = Math.sin(i) * 0.12
      stone.receiveShadow = true
      scene.add(stone)
    }

    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x69462e, roughness: 1 })
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x3f7e3f, roughness: 0.95 })
    for (const [x, z, scale] of [[-6.2, -2.8, 1.15], [6.4, -4.2, 0.92], [-7.1, 4.1, 0.82]]) {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.34, 2.4, 8), trunkMaterial)
      trunk.position.set(x, 1.2 * scale, z)
      trunk.scale.setScalar(scale)
      trunk.castShadow = true
      scene.add(trunk)

      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 1), leafMaterial)
      crown.position.set(x, 3.15 * scale, z)
      crown.scale.set(scale, scale * 1.08, scale)
      crown.castShadow = true
      scene.add(crown)
    }

    const flowerStemMaterial = new THREE.MeshStandardMaterial({ color: 0x39743a })
    const flowerColors = [0xffdf55, 0xf47983, 0xf4f0e8, 0x8e6bd4]
    for (let i = 0; i < 26; i += 1) {
      const angle = i * 2.39
      const radius = 5.4 + (i % 5) * 0.42
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius - 0.3
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.34, 5), flowerStemMaterial)
      stem.position.set(x, 0.17, z)
      scene.add(stem)
      const bloom = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 7, 5),
        new THREE.MeshStandardMaterial({ color: flowerColors[i % flowerColors.length] }),
      )
      bloom.position.set(x, 0.38, z)
      scene.add(bloom)
    }

    const smokeMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5edf0,
      transparent: true,
      opacity: 0.58,
      roughness: 1,
      depthWrite: false,
    })
    const smokePuffs = Array.from({ length: 5 }, (_, index) => {
      const puff = new THREE.Mesh(
        new THREE.SphereGeometry(0.28 + index * 0.035, 12, 8),
        smokeMaterial.clone(),
      )
      puff.userData.offset = index * 0.82
      scene.add(puff)
      return puff
    })
    smokeMaterial.dispose()

    const pointer = new THREE.Vector2()
    const onPointerMove = (event) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
      pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
    }
    canvas.addEventListener('pointermove', onPointerMove)

    function resize() {
      const width = Math.max(container.clientWidth, 1)
      const height = Math.max(container.clientHeight, 1)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    const clock = new THREE.Clock()
    renderer.setAnimationLoop(() => {
      const time = clock.getElapsedTime()
      camera.position.x += (11 + pointer.x * 0.8 - camera.position.x) * 0.025
      camera.position.y += (8 - pointer.y * 0.35 - camera.position.y) * 0.025
      camera.lookAt(0, 1.7, 0)

      smokePuffs.forEach((puff, index) => {
        const travel = (time * 0.42 + puff.userData.offset) % 4
        puff.position.set(
          -1.82 + Math.sin(time * 0.7 + index) * 0.16 + travel * 0.07,
          5.45 + travel,
          -1.78,
        )
        const scale = 0.72 + travel * 0.18
        puff.scale.setScalar(scale)
        puff.material.opacity = 0.58 * (1 - travel / 4)
      })

      renderer.render(scene, camera)
    })

    return () => {
      renderer.setAnimationLoop(null)
      resizeObserver.disconnect()
      canvas.removeEventListener('pointermove', onPointerMove)
      scene.traverse((object) => {
        object.geometry?.dispose()
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose())
        } else {
          object.material?.dispose()
        }
      })
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      id="scene"
      ref={canvasRef}
      aria-label={language === 'zh' ? '草地上的三维房屋场景' : '3D house on a grassy field'}
    />
  )
}
