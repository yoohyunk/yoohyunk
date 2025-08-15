/// <reference types="vite/client" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      directionalLight: any;
      group: any;
      primitive: any;
      color: any;
      pointLight: any;
      mesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
    }
  }
}

export {};
