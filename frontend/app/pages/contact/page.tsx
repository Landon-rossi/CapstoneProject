"use client";

import Image from "next/image";

export default function Contact() {
    // Team members' data
    const teamMembers = [
        {
            name: "Grayson Odajima",
            role: "Data Scientist",
            email: "Grayson_Odajima1@baylor.edu",
            image: "/GraysonOdajima.png",
            description: "Developed the AI model and worked on data preprocessing.",
        },
        {
            name: "Landon Rossi",
            role: "Data Scientist",
            email: "Landon_Rossi2@baylor.edu",
            image: "/LandonRossi.png",
            description: "Implemented the deep learning pipeline and optimized model performance.",
        },
        {
            name: "Brad Buckingham",
            role: "Frontend Developer",
            email: "Brad_Buckingham1@baylor.edu",
            image: "/BradBuckingham.png",
            description: "Designed the UI/UX and integrated the AI model into the frontend.",
        },
        {
            name: "Zhongbo Sun",
            role: "Backend Developer",
            email: "Zhongbo_Sun1@baylor.edu",
            image: "/ZhongboSun.png",
            description: "Built the API and database for efficient model deployment.",
        },
        {
            name: "Kyle Hoang",
            role: "Frontend Developer",
            email: "Kyle_Hoang2@baylor.edu",
            image: "/KyleHoang.png",
            description: "Analyzed solar wind data and improved classification accuracy.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-indigo-900 to-yellow-600 text-white font-sans">
            {/* Header */}
            <header className="text-center py-16">
                <h1 className="text-4xl sm:text-6xl font-bold">Meet Our Team</h1>
                <p className="text-lg sm:text-xl mt-4 max-w-2xl mx-auto">
                    Get in touch with the minds behind the AI-Powered Solar Wind Classification project.
                </p>
            </header>

            {/* Professor Section */}
            <section className="px-8 py-16 sm:px-20 bg-black/70 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-yellow-400">Project Client</h2>
                <div className="flex flex-col items-center bg-white/10 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
                    <Image src="/HenryHan.png" alt="Professor" width={150} height={150} className="rounded-full mb-4 object-cover w-[150px] h-[150px]" />
                    <h3 className="text-xl font-semibold">Dr. Henry Han</h3>
                    <p className="text-yellow-300">McCollum Family Chair in Data Science; Professor</p>
                    <p className="mt-4">Oversaw the project, provided domain expertise, and guided research development.</p>
                    <a href="mailto:Henry_Han@baylor.edu" className="text-yellow-400 hover:underline mt-2 block">
                        Henry_Han@baylor.edu
                    </a>
                </div>
            </section>

            {/* Team Members Section */}
            <section id="TeamMembers" className="px-8 py-16 sm:px-20 bg-black/50 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-yellow-400">Project Team</h2>
                <div className="grid-contact gap-5 sm:gap-8">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="item-contact p-6 bg-white/10 rounded-lg shadow-lg hover:shadow-yellow-500/30 transition"
                        >
                            <Image
                                src={member.image}
                                alt={member.name}
                                width={120}
                                height={120}
                                className="rounded-full object-cover mx-auto mb-4 w-[100px] h-[100px]"
                            />
                            <h3 className="text-xl font-semibold">{member.name}</h3>
                            <p className="text-yellow-300">{member.role}</p>
                            <p className="mt-4">{member.description}</p>
                            <a href={`mailto:${member.email}`} className="text-yellow-400 hover:underline mt-2 block">
                                {member.email}
                            </a>
                        </div>
                    ))}
                </div>
            </section>



            {/* Footer */}
            <footer className="bg-black py-8 text-center text-sm">
                <p>&copy; 2025 Solar Wind AI. All rights reserved.</p>
            </footer>
        </div>
    );
}
