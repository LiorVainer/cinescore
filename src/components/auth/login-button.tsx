import {Button} from "@//components/ui/button";
import {SignInModal} from "@/components/auth/sign-in-modal";
import {useState} from "react";

export const LoginButton = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                התחבר
            </Button>
            <SignInModal open={open} onOpenChange={setOpen}/>
        </>
    );
};
