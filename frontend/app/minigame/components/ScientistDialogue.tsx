import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ScientistDialogueProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    imageOpen: string;   // Image with mouth open
    imageClosed: string; // Image with mouth closed
}

const ScientistDialogue: React.FC<ScientistDialogueProps> = ({ message, isVisible, onClose, imageOpen, imageClosed }) => {
    const [currentImage, setCurrentImage] = useState(imageClosed);
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        if (!isVisible || !message) return;

        setDisplayedText(""); // Reset text
        let charIndex = 0;

        const textInterval = setInterval(() => {
            setDisplayedText((prev) => {
                if (charIndex < message.length + 1) {
                    charIndex++;
                    return message.slice(0, charIndex); // Slice ensures correct substring
                } else {
                    clearInterval(textInterval);
                    return prev; // Keep final text
                }
            });
        }, 50); // Adjust typing speed

        return () => clearInterval(textInterval);
    }, [isVisible, message]);


    useEffect(() => {
        if (!isVisible) return;

        const imageInterval = setInterval(() => {
            setCurrentImage((prev) => (prev === imageClosed ? imageOpen : imageClosed));
        }, 200); // Faster swap for a more animated effect

        return () => clearInterval(imageInterval);
    }, [isVisible, imageOpen, imageClosed]);

    if (!isVisible) return null;

    return (
        <div className="relative w-full h-full translate-x-[-220px] translate-y-[-20px]">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute bottom-0 left-0 flex items-center space-x-4"
            >
                {/* Scientist image positioned above the dialogue box */}
                <div className="relative w-64 h-64">
                    <img src={currentImage} alt="Scientist" className="w-full h-full rounded-full shadow-md absolute top-[-60px] left-1/2 transform" />
                </div>

                <Card className="max-w-sm">
                    <CardContent>
                        <p className="mt-4">{displayedText}</p>
                        <div className="flex justify-end mt-4">
                            <Button onClick={onClose} className="bg-green-500 text-white rounded">
                                Got it!
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ScientistDialogue;
