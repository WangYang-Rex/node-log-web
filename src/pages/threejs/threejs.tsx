import { initial } from 'lodash';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import './threejs.less';
import * as THREE from 'three';

let scene:any, camera:any, renderer:any;

const ThreeJs = () => {

  const container = useRef(null);
  
  useLayoutEffect(() => {
    init();
  }, [])

  const init = () => {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1;

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animation = (time: any) => {
      mesh.rotation.x = time / 2000;
      mesh.rotation.y = time / 1000;
      renderer.render(scene, camera);
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animation);

    const container = document.querySelector('#threejs');
    container && container.appendChild(renderer.domElement)
  }

  return (
    <div id="threejs" className="t3-container t-FB1" ref={container}></div>
  )
}


export default ThreeJs;