
interface AvatarProps {
    src: string;
    alt: string;
}

const Avatar = ({ src, alt }: AvatarProps) => {
    return (
        <div>
            <img src={src} alt={alt} className="w-10 h-10 rounded-full" />
        </div>
    )
}

export default Avatar