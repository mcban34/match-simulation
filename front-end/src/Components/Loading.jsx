import React from 'react';

const Loading = () => {
    return (
        <div className="min-h-screen bg-themeBlack flex items-center justify-center">
            <div className="text-center">
                <div className='flex justify-center items-center'>
                    <div className="animate-bounce mb-4 w-24 h-h4 flex justify-center items-center rounded-full bg-white text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100"
                            height="100"
                            viewBox="-8 0 512 512"
                        >
                            <path d="M483.8 179.4C449.8 74.6 352.6 8 248.1 8c-25.4 0-51.2 3.9-76.7 12.2C41.2 62.5-30.1 202.4 12.2 332.6 46.2 437.4 143.4 504 247.9 504c25.4 0 51.2-3.9 76.7-12.2 130.2-42.3 201.5-182.2 159.2-312.4m-74.5 193.7-52.2 6.4-43.7-60.9 24.4-75.2 71.1-22.1 38.9 36.4c-.2 30.7-7.4 61.1-21.7 89.2-4.7 9.3-10.7 17.8-16.8 26.2m0-235.4-10.4 53.1-70.7 22-64.2-46.5V92.5l47.4-26.2c39.2 13 73.4 38 97.9 71.4M184.9 66.4 232 92.5v73.8l-64.2 46.5-70.6-22-10.1-52.5c24.3-33.4 57.9-58.6 97.8-71.9M139 379.5 85.9 373c-14.4-20.1-37.3-59.6-37.8-115.3l39-36.4 71.1 22.2 24.3 74.3zm48.2 67-22.4-48.1 43.6-61.7H287l44.3 61.7-22.4 48.1c-6.2 1.8-57.6 20.4-121.7 0"></path>
                        </svg>
                    </div>
                </div>

                <div className="relative">
                    <div className="flex justify-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-ping delay-75"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-ping delay-150"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-ping delay-300"></div>
                    </div>
                </div>

                <div className="text-gray-400 mt-4 text-sm">
                    Maç verileri hazırlanıyor...
                </div>
            </div>
        </div>
    );
};

export default Loading;