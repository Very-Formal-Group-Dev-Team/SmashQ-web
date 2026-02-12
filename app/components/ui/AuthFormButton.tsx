import GoogleIcon from "./GoogleIcon";

interface buttonProps {
    variant: "login" | "register" | "guest" | "googleLogin" | "googleRegister"
    children?: React.ReactNode
}

export default function AuthFormButton({ variant, children }: buttonProps) {
    let className = "";

    if (variant === "login" || variant === "register" || variant === "guest") {
        className = "font-semibold pt-3 pb-3 rounded-sm cursor-pointer text-white bg-[#368F66]"
    } else {
        className= "font-semibold pt-3 pb-3 rounded-sm cursor-pointer text-black bg-white border border-gray-600 flex items-center justify-center gap-3"
    }

    children =  variant === "login" ? "Login" :
                variant === "register" ? "Register" :
                variant === "guest" ? "Join as Guest" :
                variant === "googleLogin" ? <><GoogleIcon/> Continue with Google</> :
                <><GoogleIcon/> Sign up with Google</>
    
    return (
        <button className={className}>
            {children}
        </button>
    )
}