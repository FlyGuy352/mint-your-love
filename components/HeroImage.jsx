export default function HeroImage() {
    return (
        <div className='w-full h-full bg-hero bg-cover bg-center grid grid-rows-3 gap-5 py-10 transparent-background'>
            <div className='row-start-2 text-center text-crimsonRed text-4xl italic tracking-wide'>
                <h2>Immortalize Your Love on the Blockchain</h2>
            </div>
            <div className='row-start-3 text-center'>
                <button className='px-6 py-4 relative rounded-2xl group overflow-hidden font-bold bg-white text-crimsonRed border border-crimsonRed'>
                    <span className='absolute top-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-crimsonRed group-hover:h-full opacity-90'></span>
                    <span className='relative group-hover:text-white'>Start Minting</span>
                </button>
            </div>
        </div>
    );
};
