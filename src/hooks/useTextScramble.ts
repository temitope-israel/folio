// src/hooks/useTextScramble.ts
// ============================================================
// TEXT SCRAMBLE HOOK
// ============================================================
// Takes a target string and returns a "scrambled" version that
// progressively reveals the correct characters over time —
// like a decoding/hacking terminal effect.
// ============================================================


import {useState, useEffect, useRef} from "react"
// useState → holds the currently displayed (scrambled) text
// useEffect → runs the scramble animation loop
// useRef    → stores the interval ID across renders without triggering re-renders

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
// The pool of random characters used while scramblin.
// Mix of uppercase letters and symbols gives a "terminal" feel.

interface UseTextScrambleOptions {
    text: string;
    // The final, correct text we want to reveal

    trigger?: boolean;
    // Optional - when this flips to true, the scramble starts.
    // Defaults to true (starts immediately on mount) if not provided.

    speed?: number;
    // Optional - milliseconds between each scramble tick. Default 30ms.

    revealDelay?: number;
    // Optional - how man ticks to wait before locking in the next
    // correct character. Higher = slower reveal. Default 2.
}


export function useTextScramble({
    text,
    trigger = true,
    speed  = 30,
    revealDelay = 2,
}: UseTextScrambleOptions){
    // Destructing with default values directly in the parameter.
    // If trigger/speed/revealDelay aren't passed in, these defaults apply.


    const [displayText, setDisplayText]  = useState(text);
    // Initialize with the real text (not scrambled) so there's no
    // flash of garbage text before JS runs (e.g., if JS is slow to load).

    const frameRef = useRef(0);
    // Tracks how many animation "frames" (ticks) have passed.
    // useRef because we need this value to persis across ticks
    // WITHOUT causing re-renders on every single frame.

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Stores the interval ID so we can clear it later.
    // ReturnType<typeof setInterval> => TS trick to get the exact
    // return type of setInterval without hardcosing "number" (which
    // differs between browser and Node.js typings).

    useEffect(() => {
        if(!trigger) {
            // If trigger is false, don't start scrambling - show plain text.
            setDisplayText(text);
            return;
            // Early return - exits the effect function immediately.
            // No interval is created, no cleanup needed.
        }

        let revealedCount = 0;
        // How many characters (from the left) are "locked in " as correct.
        // Starts at 0 - nothing revealed yt.

        let tickCount = 0;
        // Counts ticks since the last reveal - compared against revealDelay.

        intervalRef.current = setInterval(() => {
            tickCount += 1;

            // Every 'revealDelay' ticks, reveal one more correct character
            if(tickCount % revealDelay === 0) {
                // % is the modulo operator = remainder after division.
                // tickCount % revealDelay === 0 means tickCount is a multiple
                // of revealDelay. With revealDelay=2: true on ticks 2, 4, 6, 8...
                // This controls HOW OFTEN we lock in a new correct letter.
                revealedCount += 1;
            }

            if(revealedCount >= text.length) {
                // All characters have been revealed - stop the animation
                setDisplayText(text);
                // Ensure the final text is exactly correct (no stray random chars)
                if (intervalRef.current) clearInterval(intervalRef.current);
                return;
            }


            // Build the current frame's display text
            const scrambled = text
            .split("")
            // Turn the string into an array of individual chars
            .map((char, index) => {
                // For each character, decide: show the real one, or a random one?

                if(char === " ") return " ";
                // Always keep spaces as spaces - scramling a space looks broken
                // (you'd see a random char where a word gap should be).

                if (index < revealedCount) {
                    // This character's position has already been "locked in"
                    return char;
                    // Show the real character from the target text
                }

                // Not yet revealed - show a random character from CHARS
                return CHARS[Math.floor(Math.random() * CHARS.length)];
                // Math.random() => random decimal between 0 (inclusive) and 1 (exclusive)
                // Math.random() * CHARS.length => random decimal btw 0 and CHARS.length
                // Math.floor() => rounds DOWN to the nearest whole number
                // Result: a random valid INDEX into the CHARS string
                // CHARS[randomIndex] => the character at that random position
            })
            .join("");
            // Recombine the array of characters back into a single string


            setDisplayText(scrambled)
            // Update state => triggers re-render => user sees the new scrambled frame

            frameRef.current += 1;
            // Increment frame counter (not currently used elsewhere, but useful
            // if we want frame-based effects in the future, like fade-in per char)
        }, speed)
        // Run this tick function every 'speed' milliseconds
        // (default 30ms)
        // roughly 33 times per second, a good balance of smooth vs
        // performant.

        return () => {
            // cleanup - runs with trigger changes or component unmounts
            if(intervalRef.current) {
                clearInterval(intervalRef.current);
                // Stop the interval to prevent it running after cleanup
            }
        }
    }, [text, trigger, speed, revealDelay]);
    // Dependencies: re-run the effect if any of these change.
    // If "text" changes (different headline), restart the scramble.
    // If "trigger" flips from false to true, start the scramble.

    return displayText;

    // The hook returns just the current display string.
    // The component using this hook renders {displayText} directly.
}