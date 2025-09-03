"use client";

import { useRouter } from "next/navigation";
import features from "@/assets/data/features";
import Image from "next/image";
import Container from "@/components/Container";
import { useAuth } from "@/contexts/AuthContext";

const Page = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleAuthRedirect = () => {
    router.push("/auth");
  };

  return (
    <Container title="Features of this app" content={true}>
      <div className="w-4/5 h-full flex flex-col items-center justify-start bg-gray-200 text-black px-6 py-8 mx-auto rounded-lg">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex items-center justify-between w-4/5 mx-auto mb-12 ${
              index % 2 !== 0 ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Icon */}
            <div className="h-24 w-24 flex items-center justify-center">
              <Image
                src={feature.icon}
                alt={feature.title}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Description */}
            <div className="w-1/2 flex flex-col items-start">
              <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
              <p className="text-base text-start">{feature.description}</p>
            </div>
          </div>
        ))}

        {!isAuthenticated && (
          <button
            onClick={handleAuthRedirect}
            className="mt-6 mx-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Start Your Project
          </button>
        )}
      </div>
    </Container>
  );
};

export default Page;
