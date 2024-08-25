import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

const ThreeDPlot = ({ size = 5, data = [] }) => {
  const mountRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    const gridHelper = new THREE.GridHelper(size * 2, size);
    scene.add(gridHelper);

    const edges = [];

    for (let x = -size / 2; x <= size / 2; x++) {
      for (let y = -size / 2; y <= size / 2; y++) {
        for (let z = -size / 2; z <= size / 2; z++) {
          const vertex = new THREE.Vector3(x, y, z);

          if (x < size / 2) {
            edges.push([vertex, new THREE.Vector3(x + 1, y, z)]);
          }
          if (y < size / 2) {
            edges.push([vertex, new THREE.Vector3(x, y + 1, z)]);
          }
          if (z < size / 2) {
            edges.push([vertex, new THREE.Vector3(x, y, z + 1)]);
          }
        }
      }
    }

    edges.forEach((edge) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(edge);
      const material = new THREE.LineBasicMaterial({ color: 0xffffff });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    });

    const centralGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const centralMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
    centralSphere.position.set(0, 0, 0);
    scene.add(centralSphere);

    // Plot data points
    data.forEach(([x, y, z]) => {
      const geometry = new THREE.SphereGeometry(0.05, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(x, y, z);
      scene.add(sphere);
    });

    const loader = new FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
      (font) => {
        const createLabel = (text, position, rotation, color) => {
          const textGeometry = new TextGeometry(text, {
            font: font,
            size: 0.3,
            height: 0.05,
          });
          const textMaterial = new THREE.MeshBasicMaterial({ color });
          const mesh = new THREE.Mesh(textGeometry, textMaterial);
          mesh.position.copy(position);
          mesh.rotation.copy(rotation);
          scene.add(mesh);

          return mesh;
        };

        createLabel(
          "Conservative ↔ Progressive",
          new THREE.Vector3(1 + size / 2, -size / 2, 0),
          new THREE.Euler(0, 0, Math.PI / 2),
          0x00ffff
        ); // Cyan

        createLabel(
          "Extreme ↔ Moderate",
          new THREE.Vector3(-size / 2, size / 2, 0),
          new THREE.Euler(0, Math.PI / 2, 0),
          0xff00ff
        ); // Magenta

        createLabel(
          "Pragmatic <> Idealistic",
          new THREE.Vector3(-2.25, -size / 2, 1 + size / 2),
          new THREE.Euler(0, 0, 0),
          0x00ff00
        ); // Lime
      }
    );

    // Set the camera to view the grid straight on
    camera.position.set(0, 0, size * 2);
    camera.lookAt(0, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      controls.dispose();
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [size, data]);

  return <div ref={mountRef}></div>;
};

export default ThreeDPlot;
