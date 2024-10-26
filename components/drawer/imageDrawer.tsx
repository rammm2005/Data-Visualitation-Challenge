"use client";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const ImageDrawer = ({ isOpen, onClose, imageUrl }: { isOpen: boolean; onClose: () => void; imageUrl: string }) => {
    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>ERD</DrawerTitle>
                    <DrawerClose onClick={onClose} />
                </DrawerHeader>
                <DrawerDescription>
                    <Image src={imageUrl} alt="ERD" width={800} height={600} layout="responsive" />
                </DrawerDescription>
                <DrawerFooter>
                    <Button onClick={onClose}>Close</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default ImageDrawer;
