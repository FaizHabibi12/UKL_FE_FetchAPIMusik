export const metadata = {
    title: 'addSong | UKL',
    description: 'UKL Paket 2',
}

type LoginLayout = {
    children: React.ReactNode
}

const LoginLayout = ({ children }: LoginLayout) => {
    return (
        <div>{children}</div>
    )
}

export default LoginLayout