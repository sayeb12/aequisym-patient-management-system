import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
    CapsuleGeometry,
    Color,
    MeshPhysicalMaterial,
} from "three";


function createGeometry(detail) {
    const capSegments = detail === "compact" ? 7 : 10;
    const radialSegments = detail === "compact" ? 14 : 20;
    const heightSegments = 2;

    const geometry = new CapsuleGeometry(
        0.52,
        1.65,
        capSegments,
        radialSegments,
        heightSegments,
    );

    const firstHalfRows = capSegments + (heightSegments / 2);
    const firstHalfCount = firstHalfRows * radialSegments * 6;

    geometry.clearGroups();
    geometry.addGroup(0, firstHalfCount, 0);
    geometry.addGroup(
        firstHalfCount,
        geometry.index.count - firstHalfCount,
        1,
    );

    return geometry;
}


function createMaterial(color, finish, opacity) {
    const isPearl = finish === "pearl";

    return new MeshPhysicalMaterial({
        color: new Color(color),
        roughness: isPearl ? 0.31 : 0.23,
        metalness: 0,
        clearcoat: isPearl ? 0.58 : 0.78,
        clearcoatRoughness: isPearl ? 0.28 : 0.18,
        sheen: isPearl ? 0.16 : 0.08,
        sheenColor: new Color("#ffffff"),
        sheenRoughness: 0.44,
        ior: 1.46,
        specularIntensity: isPearl ? 0.48 : 0.64,
        specularColor: new Color("#ffffff"),
        envMapIntensity: isPearl ? 0.68 : 0.82,
        transparent: opacity < 1,
        opacity,
        depthWrite: opacity > 0.92,
    });
}


function FloatingCapsule({
    colors,
    detail,
    drift,
    finish = "glossy",
    opacity = 1,
    phase,
    position,
    rotation,
    rotationSpeed,
    scale,
    shouldAnimate,
}) {
    const capsuleRef = useRef(null);

    const geometry = useMemo(
        () => createGeometry(detail),
        [detail],
    );

    const materials = useMemo(
        () => colors.map(
            (color) => createMaterial(color, finish, opacity),
        ),
        [colors, finish, opacity],
    );

    useEffect(
        () => () => {
            geometry.dispose();
            materials.forEach((material) => material.dispose());
        },
        [geometry, materials],
    );

    useFrame(({ clock }) => {
        if (!shouldAnimate || !capsuleRef.current) {
            return;
        }

        const time = clock.getElapsedTime();
        const capsule = capsuleRef.current;

        capsule.position.x = position[0]
            + Math.sin((time * drift.speed) + phase) * drift.x;
        capsule.position.y = position[1]
            + Math.cos((time * drift.speed * 0.82) + phase) * drift.y;
        capsule.position.z = position[2]
            + Math.sin((time * drift.speed * 0.58) + phase) * drift.z;

        capsule.rotation.x = rotation[0]
            + Math.sin((time * rotationSpeed) + phase) * 0.2;
        capsule.rotation.y = rotation[1]
            + (time * rotationSpeed * 0.42);
        capsule.rotation.z = rotation[2]
            + Math.cos((time * rotationSpeed * 0.7) + phase) * 0.13;
    });

    return (
        <group
            ref={capsuleRef}
            position={position}
            rotation={rotation}
            scale={scale}
        >
            <mesh geometry={geometry} material={materials} />

            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry
                    args={[
                        0.526,
                        0.022,
                        8,
                        detail === "compact" ? 20 : 32,
                    ]}
                />
                <meshStandardMaterial
                    color="#b6bcb8"
                    roughness={0.4}
                    metalness={0}
                    transparent
                    opacity={0.72}
                />
            </mesh>
        </group>
    );
}


export default FloatingCapsule;
