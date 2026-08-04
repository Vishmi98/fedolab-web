import { Method } from "axios";
import { ReactNode } from "react";

export interface DesktopNavbarProps {
    openNav: () => void
}

export interface MobileNavbarProps {
    showNav: boolean;
    closeNav: () => void;
}

export type ApiCallOptions = {
    url: string;
    method?: Method; // GET, POST, PUT, etc.
    body?: Record<string, unknown>;
    params?: Record<string, unknown>;
    isAuth?: boolean;
}

export type UserStoreUserType = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    userType: string;
    phoneNumber: string;
}

export type ProfileLink = {
    id: string;
    label: string;
    icon: ReactNode;
    href: string;
}

export type SidebarProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export type LoaderProps = {
    h?: number;
};

export type TableProps = {
    reload?: boolean;
    handleReload?: () => void;
}

export type ConfirmModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
};

export interface CropModalProps {
    imageFile: File;
    onCropComplete: (file: File) => void;
    onClose: () => void;
    cropWidth?: number;
    cropHeight?: number;
}

export type AddModalProps = {
    isOpen: boolean;
    onClose: () => void;
    handleReload: () => void;
}

export type CommonModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    maxWidth?: string;
};

export interface CSEMarketSummary {
    status: string;
    aspi: number;
    aspiChange: number;
    spsl20: number;
    spsl20Change: number;
    turnover: number;
    volume: number;
    trades: number;
}

export interface CachedMarketSummary {
    status: string;
    aspi: {
        value: number;
        change: number;
    };
    spSL20: {
        value: number;
        change: number;
    };
    turnover: number;
    volume: number;
    trades: number;
    lastUpdated: string;
}