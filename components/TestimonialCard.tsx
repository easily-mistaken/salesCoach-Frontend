import React from "react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  initials?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  title,
  initials,
  gradientFrom = "blue-500",
  gradientTo = "blue-700",
}) => {
  // Generate initials if not provided
  const userInitials =
    initials ||
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative group h-full">
      {/* Quote icon that appears on hover */}
      <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.18 16.2C8.42 15.72 7.82 15.1 7.38 14.34C6.94 13.58 6.72 12.7 6.72 11.7C6.72 10.7 6.94 9.82 7.38 9.06C7.82 8.3 8.42 7.68 9.18 7.2L10.62 8.64C10.12 8.92 9.72 9.32 9.42 9.84C9.12 10.36 8.97 10.98 8.97 11.7C8.97 12.42 9.12 13.04 9.42 13.56C9.72 14.08 10.12 14.48 10.62 14.76L9.18 16.2ZM14.25 16.2C13.49 15.72 12.89 15.1 12.45 14.34C12.01 13.58 11.79 12.7 11.79 11.7C11.79 10.7 12.01 9.82 12.45 9.06C12.89 8.3 13.49 7.68 14.25 7.2L15.69 8.64C15.19 8.92 14.79 9.32 14.49 9.84C14.19 10.36 14.04 10.98 14.04 11.7C14.04 12.42 14.19 13.04 14.49 13.56C14.79 14.08 15.19 14.48 15.69 14.76L14.25 16.2Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <p className="text-gray-700 italic mb-6 leading-relaxed">
            {quote.toString()}
          </p>
        </div>

        <div className="flex items-center mt-4">
          <div
            className={`h-12 w-12 bg-gradient-to-br rounded-full flex items-center justify-center text-white font-bold text-lg mr-4`}
            style={{
              backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-from-${gradientFrom}), var(--tw-gradient-to-${gradientTo}))`,
            }}
          >
            {userInitials}
          </div>
          <div>
            <h4 className="font-semibold text-navy-800">{name}</h4>
            <p className="text-gray-500 text-sm">{title}</p>
          </div>
        </div>

        <div className="flex mt-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
