import { Component, lazy, Suspense } from "react";

import styles from "./AuthLayout.module.css";


const CapsuleScene = lazy(() => import("../three/CapsuleScene"));


class SceneBoundary extends Component {

    state = {
        hasError: false,
    };


    static getDerivedStateFromError() {
        return {
            hasError: true,
        };
    }


    componentDidCatch(error) {
        console.warn("The decorative 3D scene could not be displayed.", error);
    }


    render() {
        if (this.state.hasError) {
            return null;
        }

        return this.props.children;
    }

}


function AuthLayout({ children }) {
    return (
        <main className={styles.authPage}>
            <div className={styles.atmosphere} aria-hidden="true">
                <span className={`${styles.glow} ${styles.glowOne}`} />
                <span className={`${styles.glow} ${styles.glowTwo}`} />
                <span className={styles.gridTexture} />
            </div>

            <SceneBoundary>
                <Suspense fallback={null}>
                    <CapsuleScene />
                </Suspense>
            </SceneBoundary>

            <section className={styles.authContent} aria-label="Patient sign in">
                {children}
            </section>
        </main>
    );
}


export default AuthLayout;
