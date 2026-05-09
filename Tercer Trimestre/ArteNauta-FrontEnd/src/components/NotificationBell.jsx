import React, { useState, useEffect, useRef } from "react";
import supabase from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

// Función simple para tiempo relativo
const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return "Hace un momento";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `Hace ${days} días`;
    return date.toLocaleDateString();
};

function NotificationBell() {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Cargar notificaciones iniciales
    useEffect(() => {
        if (!currentUser?.id) return;

        const fetchNotifications = async () => {
            const { data, error } = await supabase
                .from("notifications")
                .select("*")
                .eq("user_id", currentUser.id)
                .order("created_at", { ascending: false })
                .limit(20);

            if (!error && data) {
                setNotifications(data);
            }
        };

        fetchNotifications();
    }, [currentUser?.id]);

    // Suscripción en tiempo real
    useEffect(() => {
        if (!currentUser?.id) return;

        const channel = supabase
            .channel(`notifications-${currentUser.id}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                    filter: `user_id=eq.${currentUser.id}`,
                },
                (payload) => {
                    // Agregar la nueva notificación al principio de la lista
                    setNotifications((prev) => [payload.new, ...prev].slice(0, 20));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentUser?.id]);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    const handleMarkAsRead = async (id) => {
        const notif = notifications.find((n) => n.id === id);
        if (notif?.is_read) return;

        // Actualización optimista local
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );

        await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", id);
    };

    const handleMarkAllAsRead = async () => {
        // Actualización optimista local
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

        await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", currentUser.id)
            .eq("is_read", false);
    };

    if (!currentUser) return null;

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-cyan-700 focus:outline-none transition-colors"
                title="Notificaciones"
            >
                {/* Ícono de campana simple usando SVG */}
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 ring-1 ring-black ring-opacity-5">
                    <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-700">Notificaciones</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-cyan-600 hover:text-cyan-800 font-medium"
                            >
                                Marcar todas leídas
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-6 text-sm text-center text-gray-500">
                                No tienes notificaciones
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleMarkAsRead(notif.id)}
                                    className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                                        !notif.is_read ? "bg-cyan-50" : "bg-white"
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <p className={`text-sm text-gray-800 ${!notif.is_read ? "font-bold" : "font-medium"}`}>
                                            {notif.title}
                                        </p>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                            {timeAgo(notif.created_at)}
                                        </span>
                                    </div>
                                    <p className={`text-xs mt-1 ${!notif.is_read ? "text-gray-700" : "text-gray-500"}`}>
                                        {notif.body}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
