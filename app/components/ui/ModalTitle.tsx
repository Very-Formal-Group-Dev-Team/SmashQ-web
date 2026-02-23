

export default function ModalTitle({ children }: {children: React.ReactNode}) {
    return (
        <h2 className="font-display text-accent text-center text-4xl mb-6">
            {children}
        </h2>
    )
}