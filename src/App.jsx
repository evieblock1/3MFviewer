import { useState, useRef } from 'react'
import ModelViewer from './components/ModelViewer'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center } from '@react-three/drei'
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader'
import { MODEL_PREVIEW, MODEL_CARDS } from './constants'
import { EdgesGeometry, LineBasicMaterial, LineSegments } from 'three'

const AVAILABLE_MODELS = [
  {
    name: 'Ear Cuffs',
    url: '/models/ear_cuffs_1.3mf',
    description: 'A stylish ear cuff design for 3D printing. Perfect for customizable jewelry and accessories. Features intricate details and adjustable sizing.',
    preview: {
      scale: [0.1, 0.1, 0.1],
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    }
  },
  {
    name: 'Cube Gears',
    url: '/models/cube_gears_prod.3mf',
    description: 'Mechanical cube with interlocking gears. A fascinating demonstration of 3D printed mechanical systems. Great for learning about gear mechanisms and mechanical movement.',
    preview: {
      scale: [0.1, 0.1, 0.1],
      position: [0, 0, 0],
      rotation: [0, Math.PI / 4, 0]
    }
  },
  {
    name: 'Torus',
    url: '/models/torus_proc.3mf',
    description: 'A procedurally generated torus shape. Showcases smooth curves and mathematical precision in 3D printing. Ideal for educational purposes and geometric studies.',
    preview: {
      scale: [0.5, 0.5, 0.5],
      position: [0, 0, 0],
      rotation: [Math.PI / 6, 0, 0]
    }
  },
  {
    name: 'Sphere',
    url: '/models/sphere_prod.3mf',
    description: 'A detailed spherical design with intricate surface patterns. Demonstrates the capabilities of 3D printing for creating complex curved surfaces and detailed textures.',
    preview: {
      scale: [0.7, 0.7, 0.7],
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    }
  },
  {
    name: 'Box',
    url: '/models/box_prod.3mf',
    description: 'A simple box design with customizable features. Perfect for storage solutions and organizational needs. Can be scaled and modified to suit various purposes.',
    preview: {
      scale: [1.2, 1.2, 1.2],
      position: [0, 0, 0],
      rotation: [Math.PI / 6, Math.PI / 4, 0]
    }
  }
]

function ModelPreview({ url, preview }) {
  const [model, setModel] = useState(null)

  useState(() => {
    const loader = new ThreeMFLoader()
    loader.load(url, (object) => {
      // Add wireframe to each mesh in the model
      object.traverse((child) => {
        if (child.isMesh) {
          const edges = new LineSegments(
            new EdgesGeometry(child.geometry),
            new LineBasicMaterial({ color: '#000000', linewidth: 1 })
          )
          edges.scale.copy(child.scale)
          edges.rotation.copy(child.rotation)
          edges.position.copy(child.position)
          child.add(edges)
        }
      })
      setModel(object)
    })
  }, [url])

  return (
    <Canvas camera={{ 
      position: MODEL_PREVIEW.CAMERA.position,
      fov: MODEL_PREVIEW.CAMERA.fov,
      near: MODEL_PREVIEW.CAMERA.near,
      far: MODEL_PREVIEW.CAMERA.far
    }}>
      <color attach="background" args={["#1a1a1a"]} />
      <ambientLight intensity={MODEL_PREVIEW.LIGHTING.ambient.intensity} />
      <pointLight 
        position={MODEL_PREVIEW.LIGHTING.point.position} 
        intensity={MODEL_PREVIEW.LIGHTING.point.intensity}
      />
      <Center>
        {model && (
          <primitive 
            object={model} 
            scale={preview.scale}
            position={preview.position}
            rotation={preview.rotation}
          />
        )}
      </Center>
      <OrbitControls 
        enableZoom={false} 
        autoRotate 
        autoRotateSpeed={MODEL_PREVIEW.CONTROLS.autoRotateSpeed}
      />
    </Canvas>
  )
}

function ModelCard({ model, onSelectModel, index }) {
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-8 sticky top-0"
      style={{
        zIndex: index + 1
      }}
    >
      <div className="max-w-6xl w-full bg-gray-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="h-[400px] lg:h-[600px] bg-black relative">
            <ModelPreview url={model.url} preview={model.preview} />
          </div>
          <div className="p-8 lg:p-12 flex flex-col justify-between backdrop-blur-md bg-gray-900/50">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">{model.name}</h2>
              <p className="text-gray-300 text-lg mb-8">{model.description}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => onSelectModel(model)}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors text-lg font-semibold"
              >
                View Model
              </button>
              <a
                href={model.url}
                download={model.name + '.3mf'}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-colors text-lg font-semibold text-center flex items-center justify-center gap-2"
              >
                Download ⬇️
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HomePage({ onSelectModel }) {
  return (
    <div className="min-h-screen">
      {/* Fixed background */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black" />
      </div>

      {/* Fixed welcome text */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">3MF Model Viewer</h1>
          <p className="text-xl lg:text-2xl text-gray-300 mb-8">Explore and download 3D printable models</p>
          <div className="animate-bounce text-gray-400">↓ Scroll to explore models ↓</div>
        </div>
      </div>

      {/* Scrollable cards container */}
      <div className="relative min-h-screen">
        {/* Empty first page to show welcome text */}
        <div className="h-screen w-full" />
        
        {/* Model cards */}
        {AVAILABLE_MODELS.map((model, index) => (
          <ModelCard
            key={model.name}
            model={model}
            onSelectModel={onSelectModel}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

function App() {
  const [currentModel, setCurrentModel] = useState(null)

  return (
    <div className="w-full h-full">
      {currentModel ? (
        <div className="relative w-full h-full">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button
              onClick={() => setCurrentModel(null)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Home
            </button>
            <a
              href={currentModel.url}
              download={currentModel.name + '.3mf'}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center gap-2"
            >
              Download ⬇️
            </a>
          </div>
          <ModelViewer modelUrl={currentModel.url} />
        </div>
      ) : (
        <HomePage onSelectModel={setCurrentModel} />
      )}
    </div>
  )
}

export default App
