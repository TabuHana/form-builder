import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const UserButton = () => {
    return (
        <Avatar>
            <AvatarImage src='user.jpg' />
            <AvatarFallback>XZ</AvatarFallback>
        </Avatar>
    );
};