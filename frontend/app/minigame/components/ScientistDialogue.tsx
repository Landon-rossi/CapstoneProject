import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface ScientistDialogueProps {
    message: string;
    imageOpen: string;
    imageClosed: string;
}

const ScientistDialogue: React.FC<ScientistDialogueProps> = ({ message, imageOpen, imageClosed }) => {
    const [currentImage, setCurrentImage] = useState(imageClosed);
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        let charIndex = 0;
        setDisplayedText("");
        setIsTyping(true);

        const textInterval = setInterval(() => {
            setDisplayedText((prev) => {
                if (charIndex < message.length) {
                    charIndex++;
                    return message.slice(0, charIndex);
                } else {
                    clearInterval(textInterval);
                    setIsTyping(false); // Done typing
                    return prev;
                }
            });
        }, 40);

        return () => clearInterval(textInterval);
    }, [message]);

    useEffect(() => {
        if (!isTyping) {
            setCurrentImage(imageClosed); // Reset to closed
            return;
        }

        const imageInterval = setInterval(() => {
            setCurrentImage((prev) => (prev === imageClosed ? imageOpen : imageClosed));
        }, 200);

        return () => clearInterval(imageInterval);
    }, [isTyping, imageOpen, imageClosed]);

    return (
        <div className="relative w-full h-full flex items-start justify-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center space-x-4"
            >
                <div className="relative w-32 h-32">
                    <img src={currentImage} alt="Scientist" className="w-full h-full rounded-full shadow-md" />
                </div>

                <Card className="max-w-md">
                    <CardContent>
                        <p className="mt-4">{displayedText}</p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ScientistDialogue;
