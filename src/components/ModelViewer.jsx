import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';
import { Box3, Vector3, MeshStandardMaterial, EdgesGeometry, LineBasicMaterial, LineSegments as ThreeLineSegments } from 'three';
import { Environment } from '@react-three/drei';

// Color presets organized by type
const COLOR_PRESETS = {
  standard: [
    { value: '#ffffff', name: 'White', metalness: 0.1, roughness: 0.7 },
    { value: '#000000', name: 'Black', metalness: 0.1, roughness: 0.7 },
    { value: '#ff4444', name: 'Red', metalness: 0.1, roughness: 0.7 },
    { value: '#4444ff', name: 'Blue', metalness: 0.1, roughness: 0.7 },
    { value: '#44ff44', name: 'Green', metalness: 0.1, roughness: 0.7 },
    { value: '#ffff44', name: 'Yellow', metalness: 0.1, roughness: 0.7 },
    { value: '#ff44ff', name: 'Pink', metalness: 0.1, roughness: 0.7 },
    { value: '#44ffff', name: 'Cyan', metalness: 0.1, roughness: 0.7 },
    { value: '#ff8844', name: 'Orange', metalness: 0.1, roughness: 0.7 },
    { value: '#8844ff', name: 'Purple', metalness: 0.1, roughness: 0.7 },
    { value: '#ff4488', name: 'Rose', metalness: 0.1, roughness: 0.7 },
    { value: '#44ff88', name: 'Mint', metalness: 0.1, roughness: 0.7 },
    { value: '#884444', name: 'Brown', metalness: 0.1, roughness: 0.7 },
    { value: '#448844', name: 'Forest', metalness: 0.1, roughness: 0.7 },
  ],
  metallic: [
    { value: '#ffd700', name: 'Gold', metalness: 0.6, roughness: 0.3 },
    { value: '#c0c0c0', name: 'Silver', metalness: 0.6, roughness: 0.35 },
    { value: '#cd7f32', name: 'Bronze', metalness: 0.5, roughness: 0.4 },
    { value: '#b87333', name: 'Copper', metalness: 0.5, roughness: 0.4 },
    { value: '#e5e4e2', name: 'Platinum', metalness: 0.6, roughness: 0.3 },
    { value: '#8a9597', name: 'Steel', metalness: 0.55, roughness: 0.45 },
  ]
};

function Model({ url, showWireframe, modelColor }) {
  const [geometry, setGeometry] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edges, setEdges] = useState([]);
  const [meshes, setMeshes] = useState([]);

  // Find the current color preset to get its material properties
  const getCurrentColorPreset = () => {
    const allColors = [...COLOR_PRESETS.standard, ...COLOR_PRESETS.metallic];
    return allColors.find(c => c.value === modelColor) || {
      value: modelColor,
      metalness: 0.1,
      roughness: 0.7
    };
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    const loader = new ThreeMFLoader();
    
    loader.load(
      url,
      (object) => {
        console.log('Model loaded successfully:', object);
        const box = new Box3().setFromObject(object);
        const size = box.getSize(new Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim;
        object.scale.multiplyScalar(scale);

        const edgesList = [];
        const meshList = [];
        const colorPreset = getCurrentColorPreset();

        object.traverse((child) => {
          if (child.isMesh) {
            child.material = new MeshStandardMaterial({
              color: modelColor,
              metalness: colorPreset.metalness,
              roughness: colorPreset.roughness,
              envMapIntensity: colorPreset.metalness > 0.5 ? 0.7 : 0.5,
            });
            meshList.push(child);

            const edgeLines = new ThreeLineSegments(
              new EdgesGeometry(child.geometry),
              new LineBasicMaterial({ 
                color: '#000000', 
                linewidth: 1,
                transparent: true,
                opacity: colorPreset.metalness > 0.5 ? 0.3 : 1.0
              })
            );
            edgeLines.scale.copy(child.scale);
            edgeLines.rotation.copy(child.rotation);
            edgeLines.position.copy(child.position);
            edgesList.push(edgeLines);
            child.add(edgeLines);
          }
        });
        
        setEdges(edgesList);
        setMeshes(meshList);
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

  // Update model color and material properties when color changes
  useEffect(() => {
    const colorPreset = getCurrentColorPreset();
    meshes.forEach(mesh => {
      mesh.material.color.set(colorPreset.value);
      mesh.material.metalness = colorPreset.metalness;
      mesh.material.roughness = colorPreset.roughness;
      mesh.material.envMapIntensity = colorPreset.metalness > 0.5 ? 0.7 : 0.5;
    });

    // Update wireframe opacity for metallic materials
    edges.forEach(edge => {
      edge.material.opacity = colorPreset.metalness > 0.5 ? 0.3 : 1.0;
    });
  }, [modelColor, meshes, edges]);

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
  const [modelColor, setModelColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div className="model-viewer-container">
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-4">
        {/* Controls Container */}
        <div className="flex gap-4 items-center bg-gray-800/80 p-4 rounded-lg backdrop-blur-sm">
          {/* Color Button */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div 
                className="w-4 h-4 rounded-full border border-white"
                style={{ backgroundColor: modelColor }}
              />
              Color
            </button>
            
            {/* Color Picker Dropdown */}
            {showColorPicker && (
              <div className="absolute right-0 mt-2 p-3 bg-gray-800/95 rounded-lg shadow-xl border border-gray-700">
                {/* Standard Colors */}
                <div className="grid grid-cols-7 gap-1.5 mb-2">
                  {COLOR_PRESETS.standard.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setModelColor(color.value)}
                      className="w-6 h-6 rounded-full border border-gray-600 hover:scale-110 transition-transform"
                      style={{ 
                        backgroundColor: color.value,
                        borderColor: modelColor === color.value ? 'white' : undefined
                      }}
                      title={color.name}
                    />
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-700 my-2" />

                {/* Metallic Colors */}
                <div className="grid grid-cols-6 gap-1.5 mb-3">
                  {COLOR_PRESETS.metallic.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setModelColor(color.value)}
                      className="w-6 h-6 rounded-full border border-gray-600 hover:scale-110 transition-transform"
                      style={{ 
                        backgroundColor: color.value,
                        borderColor: modelColor === color.value ? 'white' : undefined
                      }}
                      title={color.name}
                    />
                  ))}
                </div>

                {/* Custom Color Picker */}
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={modelColor}
                    onChange={(e) => setModelColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={modelColor}
                    onChange={(e) => setModelColor(e.target.value)}
                    className="flex-1 px-2 py-1 bg-gray-700 text-white rounded text-sm"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Wireframe Toggle */}
          <button
            onClick={() => setShowWireframe(!showWireframe)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            {showWireframe ? 'Hide Wireframe' : 'Show Wireframe'}
          </button>
        </div>
      </div>

      {/* Click outside to close color picker */}
      {showColorPicker && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setShowColorPicker(false)}
        />
      )}
      
      <Canvas 
        camera={{ 
          position: [5, 5, 5],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
      >
        <color attach="background" args={["#1a1a1a"]} />
        
        {/* Repositioned lighting setup */}
        <ambientLight intensity={0.5} />
        
        {/* Main side lights */}
        <pointLight 
          position={[15, 0, 0]} 
          intensity={0.6}
        />
        <pointLight 
          position={[-15, 0, 0]} 
          intensity={0.6}
        />
        
        {/* Subtle fill lights */}
        <pointLight 
          position={[0, 10, 0]} 
          intensity={0.3}
        />
        <pointLight 
          position={[0, -10, 0]} 
          intensity={0.3}
        />
        
        {/* Removed front spotLight and added subtle back light */}
        <pointLight 
          position={[0, 5, -10]} 
          intensity={0.4}
        />
        
        {/* Environment map with lower intensity */}
        <Environment preset="studio" />
        
        <Model url={modelUrl} showWireframe={showWireframe} modelColor={modelColor} />
        
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