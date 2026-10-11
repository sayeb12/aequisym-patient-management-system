import {
    useCallback,
    useRef,
    useState,
} from "react";
import {
    motion,
    MotionConfig,
    useReducedMotion,
} from "motion/react";
import {
    Outlet,
    useLocation,
} from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import styles from "./AppLayout.module.css";


function AppLayout() {
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);
    const menuButtonRef = useRef(null);
    const location = useLocation();
    const prefersReducedMotion = useReducedMotion();

    const openNavigation = useCallback(() => {
        setIsNavigationOpen(true);
    }, []);

    const closeNavigation = useCallback(() => {
        setIsNavigationOpen(false);
    }, []);

    return (
        <MotionConfig reducedMotion="user">
            <div className={styles.appShell}>
                <Sidebar
                    isOpen={isNavigationOpen}
                    menuButtonRef={menuButtonRef}
                    onClose={closeNavigation}
                />

                <div
                    className={styles.workspace}
                    inert={isNavigationOpen ? true : undefined}
                >
                    <Topbar
                        menuButtonRef={menuButtonRef}
                        isNavigationOpen={isNavigationOpen}
                        onMenuClick={openNavigation}
                    />

                    <main className={styles.mainContent}>
                        <motion.div
                            key={location.pathname}
                            className={styles.pageCanvas}
                            initial={
                                prefersReducedMotion
                                    ? false
                                    : { opacity: 0, y: 8 }
                            }
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: prefersReducedMotion ? 0 : 0.2,
                                ease: [0.2, 0, 0, 1],
                            }}
                        >
                            <Outlet />
                        </motion.div>
                    </main>
                </div>
            </div>
        </MotionConfig>
    );
}


export default AppLayout;
