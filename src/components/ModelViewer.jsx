import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';
import { Box3, Vector3, MeshStandardMaterial, EdgesGeometry, LineBasicMaterial, LineSegments as ThreeLineSegments } from 'three';

function Model({ url, showWireframe }) {
  const [geometry, setGeometry] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const loader = new ThreeMFLoader();
    
    loader.load(
      url,
      (object) => {
        console.log('Model loaded successfully:', object);
        // Calculate the bounding box
        const box = new Box3().setFromObject(object);
        const size = box.getSize(new Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim; // Scale to fit in a 5 unit box
        object.scale.multiplyScalar(scale);

        const edgesList = [];
        // Apply materials to make the model more visible
        object.traverse((child) => {
          if (child.isMesh) {
            // Create a new material for better visibility
            child.material = new MeshStandardMaterial({
              color: '#ffffff',
              metalness: 0.3,
              roughness: 0.4,
            });

            // Add edges to each mesh
            const edgeLines = new ThreeLineSegments(
              new EdgesGeometry(child.geometry),
              new LineBasicMaterial({ color: '#000000', linewidth: 1 })
            );
            edgeLines.scale.copy(child.scale);
            edgeLines.rotation.copy(child.rotation);
            edgeLines.position.copy(child.position);
            edgesList.push(edgeLines);
            child.add(edgeLines);
          }
        });
        
        setEdges(edgesList);
        setGeometry(object);
        setLoading(false);
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total) * 100, '%');
      },
      (error) => {
        console.error('Error loading model:', error);
        setError(error);
        setLoading(false);
      }
    );
  }, [url]);

  // Toggle wireframe visibility
  useEffect(() => {
    edges.forEach(edge => {
      edge.visible = showWireframe;
    });
  }, [showWireframe, edges]);

  if (loading) {
    return <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>;
  }

  if (error) {
    return <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>;
  }

  if (!geometry) return null;

  return (
    <Center>
      <primitive object={geometry} />
    </Center>
  );
}

export default function ModelViewer({ modelUrl }) {
  const [showWireframe, setShowWireframe] = useState(true);

  return (
    <div className="model-viewer-container">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowWireframe(!showWireframe)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          {showWireframe ? 'Hide Wireframe' : 'Show Wireframe'}
        </button>
      </div>
      <Canvas 
        camera={{ 
          position: [5, 5, 5],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
      >
        <color attach="background" args={["#1a1a1a"]} />
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight
          position={[-10, 10, -10]}
          angle={0.3}
          penumbra={1}
          intensity={1.5}
          castShadow
        />
        
        <Model url={modelUrl} showWireframe={showWireframe} />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[0, 0, 0]}
          makeDefault
        />
      </Canvas>
    </div>
  );
} 