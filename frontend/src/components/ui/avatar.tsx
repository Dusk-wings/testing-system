import { User } from "lucide-react";

interface AvatarProps {
    src?: string;
    alt: string;
}

const Avatar = ({ src, alt }: AvatarProps) => {
    return (
        <div>
            {
                src ? (
                    <img src={src} alt={alt} className="w-10 h-10 rounded-full" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-zinc-300 flex items-center justify-center">
                        <User />
                    </div>
                )
            }
        </div>
    )
}

export default Avatar