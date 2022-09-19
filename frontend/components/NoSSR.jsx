export default function NoSSR({ children }) {
    return(
        <div className='w-full h-full overflow-hidden' suppressHydrationWarning>
            {typeof window === 'undefined' ? null : children}
        </div>
    );
};