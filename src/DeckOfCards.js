import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const DeckOfCards = () => {
  const [showPanel, setShowPanel] = useState(false);

  const handleClick = () => {
    console.log('Deck clicked {handleClick}');
    setShowPanel(true);
  };

  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x18191c);
    scene.backgroundIntensity = 1;  
    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 3;
    camera.position.y = 3;
    camera.lookAt(0, 0, 0);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // soft white light
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1); // Adjust as necessary
    scene.add(directionalLight);

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

        // Handle window resize
        const handleResize = () => {
          camera.aspect = mount.clientWidth / mount.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

    // Create a deck of cards
    const deck = new THREE.Group();
    scene.add(deck);

    const loader = new THREE.TextureLoader();
    
    const loadTexture = (path, rotation = 0, repeatX = 1, repeatY = 1) => {
      const texture = loader.load(path, () => {
          texture.rotation = rotation; // Apply rotation if specified
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping; // Enable repeating
          texture.repeat.set(repeatX, repeatY); // Set repeat values
      });
        texture.minFilter = THREE.LinearFilter; // Improve minification filtering
        texture.magFilter = THREE.LinearFilter; // Improve magnification filtering
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Use max available anisotropy
        return texture;
    };
  
    // Adjust these values based on how zoomed in or out you want the texture to appear
    const repeatX = 1; // Repeat texture this many times along the X axis
    const repeatY = 1; // Repeat texture this many times along the Y axis
    
      
      // Load front and back textures with improved settings
      const frontTexture = loadTexture("example.png", Math.PI + Math.PI / 2); // Assuming you meant to load 'card_front.png' here
      const backTexture = loadTexture("card_back.png", Math.PI / 2); // Assuming you meant to load 'card_back.png' here
      
      // Step 1: Load the new transparent texture
      const overlayTexture = loadTexture("card_front.png", Math.PI + Math.PI / 2);

      // Step 2: Create a new material for the overlay texture
      const overlayMaterial = new THREE.MeshStandardMaterial({
        map: overlayTexture,
        transparent: true, // Ensure the material supports transparency
        opacity: 1 // Adjust opacity as needed
      });


      // Create materials for front and back with the loaded textures using MeshStandardMaterial
      const frontMaterial = new THREE.MeshStandardMaterial({ map: frontTexture });
      const backMaterial = new THREE.MeshStandardMaterial({ map: backTexture });

      
      
      // Geometry for the card
      const geometry = new THREE.BoxGeometry(1.5, 1.0, 0.02);

      // Apply textures to the two sides of the card using MeshStandardMaterial
      const materials = [
        new THREE.MeshStandardMaterial({color: 0x262424}), // right side
        new THREE.MeshStandardMaterial({color: 0x262424}), // left side
        new THREE.MeshStandardMaterial({color: 0x363434}), // top side
        new THREE.MeshStandardMaterial({color: 0x262424}), // bottom side
        frontMaterial, // front side
        backMaterial, // back side
        
      ];

      let flipAnimation = false;
      let flipProgress = 0;

    const createCard = (position) => {
      // Create the card mesh with geometry and materials
      const card = new THREE.Mesh(geometry, materials);
      card.position.set(position.x, position.y, position.z);
      card.rotation.x = Math.PI / 2;
      card.scale.set(2,2,2);
      card.castShadow = true;
      card.receiveShadow = true;
      card.rotateZ(Math.PI + Math.PI / 2);
      deck.add(card);


    };

    const colors = ['#ff']
    for (let i = 0; i < 52; i++) {
      const position = { x: 0, y: -i * 0.02, z: 0 };
      createCard(position);
      if (i == 0)
      {
                    // Step 3: Create a new mesh for the overlay texture
      const overlayMesh = new THREE.Mesh(geometry, overlayMaterial);
      overlayMesh.position.set(position.x, position.y, position.z ); // Slightly offset in the Z-axis
      overlayMesh.rotation.x = Math.PI / 2;
      overlayMesh.scale.set(2,2,2);
      overlayMesh.rotateZ(Math.PI + Math.PI / 2);
      deck.add(overlayMesh); // Add the overlay mesh to the scene
      
      }
    }

    

    // Animation loop
    let startTime = Date.now();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Pulsating effect
      let elapsedTime = (Date.now() - startTime) / 1000;
      let scale = Math.sin(elapsedTime) * 0.05 + 1;
      deck.scale.set(scale, scale, scale);

      if (flipAnimation) {
          flipProgress += 0.02;
          //deck.rotation.y += Math.PI * 0.02;
          if (flipProgress >= Math.PI) {
              flipAnimation = false;
              flipProgress = 0;
          }
      }

      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('click', () => {
      flipAnimation = true;
      console.log('Deck clicked {addEventListener}');

      const event = new CustomEvent('drawCardEvent', { detail: 'A moist card was drawn' });
      document.dispatchEvent(event);


      deck.children.forEach((card, index) => {
        if (index == 0)
        {
          card.position.y = 1;
          card.rotation.x = 90;
          card.rotation.y = Math.PI; 
        } if (index == 1)
        {
          card.position.y = 1;
          card.rotation.x = 90;
          card.rotation.y = Math.PI;
        }
        
      });

      

    });

    // Clean up on component unmount
    return () => {
      <div onClick={handleClick}>
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);

      {showPanel && (
        <div className="fade-in">
          <p>This is the new panel content!</p>
        </div>
      )}

      </div>
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default DeckOfCards;
