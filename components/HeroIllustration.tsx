import React from 'react';

const HeroIllustration = () => {
  return (
    <div className="relative">
      {/* Mock Dashboard UI */}
      <div className="bg-white rounded-lg shadow-2xl p-4 transform rotate-2 animate-fade-in">
        <div className="bg-navy-50 h-6 w-36 mb-4 rounded"></div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#0284c7]/10 h-24 rounded flex items-center justify-center">
            <div className="h-16 w-16 bg-[#0284c7]/20 rounded-full"></div>
          </div>
          <div className="bg-[#0d9488]/10 h-24 rounded flex items-center justify-center">
            <div className="h-16 w-16 bg-[#0d9488]/20 rounded-full"></div>
          </div>
        </div>
        <div className="bg-navy-100 h-32 rounded mb-4"></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-navy-50 h-8 rounded"></div>
          <div className="bg-navy-50 h-8 rounded"></div>
          <div className="bg-navy-50 h-8 rounded"></div>
        </div>
      </div>

      {/* Sentiment Analysis Card */}
      <div
        className="absolute -top-6 -right-6 bg-white rounded-lg shadow-lg p-4 w-64 animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="flex justify-between items-center mb-3">
          <div className="bg-navy-100 h-4 w-24 rounded"></div>
          <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
            Positive
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">Positive</div>
            <div className="w-32 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
            <div className="text-xs font-medium">75%</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">Neutral</div>
            <div className="w-32 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: "20%" }}
              ></div>
            </div>
            <div className="text-xs font-medium">20%</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">Negative</div>
            <div className="w-32 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-red-500 h-1.5 rounded-full"
                style={{ width: "5%" }}
              ></div>
            </div>
            <div className="text-xs font-medium">5%</div>
          </div>
        </div>
      </div>

      {/* Objection Card */}
      <div
        className="absolute -bottom-4 -left-8 bg-white rounded-lg shadow-lg p-4 w-56 animate-fade-in"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="bg-navy-100 h-4 w-20 rounded mb-3"></div>
        <div className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded inline-block mb-2">
          Pricing Objection
        </div>
        <div className="space-y-2">
          <div className="bg-gray-100 h-3 w-full rounded"></div>
          <div className="bg-gray-100 h-3 w-full rounded"></div>
          <div className="bg-gray-100 h-3 w-2/3 rounded"></div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default HeroIllustration;
