import GoogleIcon from "./GoogleIcon";

interface buttonProps {
    variant: "login" | "register" | "guest" | "googleLogin" | "googleRegister"
    onClick: React.MouseEventHandler
    children?: React.ReactNode
    disabled?: boolean
}

export default function AuthFormButton({ variant, onClick, children }: buttonProps) {
    let className = "";

    if (variant === "login" || variant === "register" || variant === "guest") {
        className = "font-semibold pt-3 pb-3 rounded-sm cursor-pointer text-white bg-primary"
    } else {
        className= "font-semibold pt-3 pb-3 rounded-md cursor-pointer text-black bg-white border border-gray-600 flex items-center justify-center gap-3"
    }

    children =  variant === "login" ? "Login" :
                variant === "register" ? "Register" :
                variant === "guest" ? "Join as Guest" :
                variant === "googleLogin" ? <><GoogleIcon/> Continue with Google</> :
                <><GoogleIcon/> Sign up with Google</>
    
    return (
        <button className={className} onClick={onClick}>
            {children}
        </button>
    )
}