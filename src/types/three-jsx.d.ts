/// <reference types="@react-three/fiber" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      directionalLight: any;
      group: any;
      primitive: any;
      color: any;
      pointLight: any;
    }
  }
}
