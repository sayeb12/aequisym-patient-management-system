import { useEffect, useMemo, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
    ACESFilmicToneMapping,
    PMREMGenerator,
    SRGBColorSpace,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

import FloatingCapsule from "./FloatingCapsule";
import styles from "./CapsuleScene.module.css";


const DESKTOP_CAPSULES = [
    {
        id: "lavender-pearl",
        colors: ["#6845ad", "#f3f1ed"],
        position: [-5.05, 2.48, 0.15],
        rotation: [0.72, -0.36, -0.88],
        scale: 1.08,
        phase: 0.4,
        rotationSpeed: 0.42,
        drift: { x: 0.22, y: 0.28, z: 0.16, speed: 0.56 },
        finish: "pearl",
    },
    {
        id: "coral-cream",
        colors: ["#e66a52", "#f4f0e8"],
        position: [4.92, 2.32, -0.35],
        rotation: [0.34, 0.58, 0.72],
        scale: 0.88,
        phase: 2.15,
        rotationSpeed: 0.36,
        drift: { x: 0.2, y: 0.24, z: 0.13, speed: 0.48 },
    },
    {
        id: "aqua-cyan",
        colors: ["#168da8", "#b9e5e6"],
        position: [-4.78, -2.35, -0.18],
        rotation: [0.9, 0.2, -1.14],
        scale: 0.92,
        phase: 3.7,
        rotationSpeed: 0.39,
        drift: { x: 0.18, y: 0.3, z: 0.2, speed: 0.52 },
    },
    {
        id: "emerald-ivory",
        colors: ["#23846f", "#f2efe7"],
        position: [4.78, -2.46, 0.05],
        rotation: [0.58, -0.62, 0.94],
        scale: 1.02,
        phase: 5.2,
        rotationSpeed: 0.34,
        drift: { x: 0.24, y: 0.26, z: 0.16, speed: 0.46 },
        finish: "pearl",
    },
    {
        id: "amber-pearl",
        colors: ["#c99338", "#f5e9cf"],
        position: [-5.5, 0.05, -2.2],
        rotation: [0.18, 0.76, -0.48],
        scale: 0.56,
        phase: 1.1,
        rotationSpeed: 0.3,
        drift: { x: 0.16, y: 0.22, z: 0.12, speed: 0.42 },
        finish: "pearl",
    },
];


const TABLET_CAPSULES = [
    {
        ...DESKTOP_CAPSULES[0],
        position: [-3.95, 2.92, -0.4],
        scale: 0.84,
    },
    {
        ...DESKTOP_CAPSULES[1],
        position: [4.05, 2.66, -0.6],
        scale: 0.72,
    },
    {
        ...DESKTOP_CAPSULES[2],
        position: [-4.0, -2.82, -0.5],
        scale: 0.74,
    },
    {
        ...DESKTOP_CAPSULES[3],
        position: [4.08, -2.85, -0.32],
        scale: 0.78,
    },
];


const MOBILE_CAPSULES = [
    {
        ...DESKTOP_CAPSULES[0],
        position: [-1.72, 3.18, -1.2],
        scale: 0.48,
        drift: { x: 0.08, y: 0.14, z: 0.08, speed: 0.42 },
    },
    {
        ...DESKTOP_CAPSULES[1],
        position: [1.76, 2.55, -1.55],
        scale: 0.38,
        drift: { x: 0.07, y: 0.12, z: 0.06, speed: 0.38 },
    },
    {
        ...DESKTOP_CAPSULES[3],
        position: [1.74, -3.12, -1.3],
        scale: 0.44,
        drift: { x: 0.08, y: 0.14, z: 0.07, speed: 0.4 },
    },
];


function useMediaQuery(query) {
    const [matches, setMatches] = useState(
        () => typeof window !== "undefined" && window.matchMedia(query).matches,
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        const handleChange = (event) => setMatches(event.matches);

        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [query]);

    return matches;
}


function usePageVisibility() {
    const [isVisible, setIsVisible] = useState(
        () => typeof document === "undefined"
            || document.visibilityState === "visible",
    );

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsVisible(document.visibilityState === "visible");
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
        };
    }, []);

    return isVisible;
}


function canUseWebGL() {
    try {
        const canvas = document.createElement("canvas");
        const options = {
            failIfMajorPerformanceCaveat: true,
        };
        const context = canvas.getContext("webgl2", options)
            || canvas.getContext("webgl", options);

        if (!context) {
            return false;
        }

        context.getExtension("WEBGL_lose_context")?.loseContext();
        return true;
    } catch {
        return false;
    }
}


function StudioEnvironment() {
    const { gl, invalidate } = useThree();
    const environment = useMemo(() => {
        const room = new RoomEnvironment();
        const pmremGenerator = new PMREMGenerator(gl);
        const texture = pmremGenerator.fromScene(room, 0.04).texture;

        room.traverse((object) => {
            object.geometry?.dispose();

            if (Array.isArray(object.material)) {
                object.material.forEach((material) => material.dispose());
            } else {
                object.material?.dispose();
            }
        });

        pmremGenerator.dispose();
        return texture;
    }, [gl]);

    useEffect(() => {
        invalidate();

        return () => environment.dispose();
    }, [environment, invalidate]);

    return <primitive object={environment} attach="environment" />;
}


function SceneContents({ shouldAnimate }) {
    const { size } = useThree();
    const isMobile = size.width < 600;
    const isTablet = size.width >= 600 && size.width < 1100;
    const capsules = isMobile
        ? MOBILE_CAPSULES
        : isTablet
            ? TABLET_CAPSULES
            : DESKTOP_CAPSULES;
    const detail = isMobile ? "compact" : "full";

    return (
        <>
            <StudioEnvironment />

            <hemisphereLight args={["#fffefa", "#c9d4d0", 1.2]} />
            <directionalLight
                color="#fffdf8"
                intensity={2.75}
                position={[-6, 7, 8]}
            />
            <pointLight
                color="#c5e8df"
                intensity={13}
                distance={17}
                decay={2}
                position={[5, 1.5, 5]}
            />
            <pointLight
                color="#f1e5d9"
                intensity={9}
                distance={15}
                decay={2}
                position={[-5, -2, 4]}
            />

            {capsules.map((capsule) => (
                <FloatingCapsule
                    key={capsule.id}
                    {...capsule}
                    detail={detail}
                    shouldAnimate={shouldAnimate}
                />
            ))}
        </>
    );
}


function CapsuleScene() {
    const isCompact = useMediaQuery("(max-width: 48rem)");
    const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
    const isPageVisible = usePageVisibility();
    const webGLAvailable = useMemo(() => canUseWebGL(), []);
    const shouldAnimate = isPageVisible && !prefersReducedMotion;

    if (!webGLAvailable) {
        return null;
    }

    return (
        <div className={styles.scene} aria-hidden="true">
            <Canvas
                camera={{
                    position: [0, 0, 12],
                    fov: 36,
                    near: 0.1,
                    far: 40,
                }}
                dpr={isCompact ? [1, 1.25] : [1, 1.5]}
                frameloop={shouldAnimate ? "always" : "demand"}
                gl={{
                    alpha: true,
                    antialias: !isCompact,
                    failIfMajorPerformanceCaveat: true,
                    powerPreference: "high-performance",
                }}
                onCreated={({ gl }) => {
                    gl.outputColorSpace = SRGBColorSpace;
                    gl.toneMapping = ACESFilmicToneMapping;
                    gl.toneMappingExposure = 0.94;
                    gl.setClearColor(0xffffff, 0);
                }}
                resize={{
                    debounce: {
                        resize: 100,
                        scroll: 0,
                    },
                    scroll: false,
                }}
            >
                <SceneContents shouldAnimate={shouldAnimate} />
            </Canvas>
        </div>
    );
}


export default CapsuleScene;
