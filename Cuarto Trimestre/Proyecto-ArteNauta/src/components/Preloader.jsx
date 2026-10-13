import { useEffect, useState } from "react";
import logo from "../assets/LOGO.png";

function Preloader({ onComplete }) {
    const [mounted, setMounted] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);

    useEffect(() => {
        // Trigger the entrance animations in the next frame
        const entranceTimer = setTimeout(() => {
            setMounted(true);
        }, 50);

        // Start the exit transition after the progress bar finishes loading (2.4 seconds)
        const exitTimer = setTimeout(() => {
            setAnimateOut(true);
        }, 2400);

        // Notify parent to unmount once the overlay transition finishes (3.2 seconds total)
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 3200);

        return () => {
            clearTimeout(entranceTimer);
            clearTimeout(exitTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div 
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-all duration-[800ms] ease-[cubic-bezier(0.85,0,0.15,1)] ${
                animateOut ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
            }`}
        >
            {/* Cinematic Radial background glow */}
            <div 
                className={`absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12)_0%,rgba(0,0,0,0)_75%)] pointer-events-none transition-opacity duration-[2000ms] ease-in-out ${
                    mounted ? "opacity-100" : "opacity-0"
                }`} 
            />
            
            {/* Centered Logo and Brand Info */}
            <div className="relative z-10 flex flex-col items-center select-none">
                <img 
                    src={logo} 
                    alt="ArteNauta Logo" 
                    className={`h-28 md:h-36 object-contain transition-all duration-[2200ms] ease-[cubic-bezier(0.25,1,0.5,1)] filter ${
                        animateOut 
                            ? "opacity-0 scale-105 blur-sm" 
                            : mounted 
                                ? "opacity-100 scale-100 blur-0 brightness-100 drop-shadow-[0_0_30px_rgba(6,182,212,0.45)]" 
                                : "opacity-0 scale-95 blur-md brightness-50 drop-shadow-[0_0_0px_rgba(6,182,212,0)]"
                    }`}
                />
                
                {/* Brand Name Text */}
                <h2 
                    className={`mt-4 text-white font-extralight tracking-[0.35em] text-xs md:text-sm uppercase transition-all duration-[2000ms] ease-out delay-200 ${
                        animateOut
                            ? "opacity-0 -translate-y-2 blur-[2px]"
                            : mounted 
                                ? "opacity-80 translate-y-0" 
                                : "opacity-0 translate-y-3"
                    }`}
                >
                    !Bienvenido¡
                </h2>
                
                {/* Sleek, minimal progress bar */}
                <div 
                    className={`mt-8 w-36 md:w-44 h-[2px] bg-neutral-900 rounded-full overflow-hidden transition-all duration-700 ${
                        animateOut ? "opacity-0 scale-95" : "opacity-100"
                    }`}
                >
                    <div 
                        className={`h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full transition-all duration-[2100ms] ease-[cubic-bezier(0.65,0,0.35,1)] delay-100 ${
                            mounted ? "w-full" : "w-0"
                        }`} 
                    />
                </div>
            </div>
        </div>
    );
}

export default Preloader;
