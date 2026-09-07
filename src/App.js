import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/App.tsx
import { useEffect } from "react";
import { motion } from "framer-motion";
// import { useLenis } from "@/hooks/useLenis";
// import CustomCursor from "@/components/shared/CustomCursor";
// import Preloader from "@/components/shared/Preloader";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import TechStack from "@/components/sections/TechStack";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";
import { recordPageVisit } from "@/lib/api";
function App() {
    // const [isLoading, setIsLoading] = useState(true);
    // useLenis();
    useEffect(() => {
        recordPageVisit("/");
    }, []);
    return (_jsx(_Fragment, { children: _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, ease: "easeOut" }, children: [_jsx(Navbar, {}), _jsxs("main", { className: "bg-bg-base", children: [_jsx(Hero, {}), _jsx(About, {}), _jsx(TechStack, {}), _jsx(Projects, {}), _jsx(Services, {}), _jsx(Contact, {})] })] }, "main") }));
}
export default App;
