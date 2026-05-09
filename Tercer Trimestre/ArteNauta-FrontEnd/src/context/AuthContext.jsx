import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "../supabaseClient";

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshProfile = async (userId) => {
        if (!userId) return;
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("role, username, avatar_url")
                .eq("id", userId)
                .single();

            if (error) {
                console.error("Error fetching profile:", error);
                setRole("usuario"); // Fallback
            } else if (data) {
                setRole(data.role);
                setCurrentUser((prev) => ({ ...prev, ...data }));
            }
        } catch (err) {
            console.error("Unexpected error fetching profile:", err);
        }
    };

    useEffect(() => {
        // Initialize auth session
        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setCurrentUser(session.user);
                await refreshProfile(session.user.id);
            }
            setIsLoading(false);
        };

        initAuth();

        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    setCurrentUser(session.user);
                    await refreshProfile(session.user.id);
                } else {
                    setCurrentUser(null);
                    setRole(null);
                }
                setIsLoading(false);
            }
        );

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    // Subscribe to real-time changes on the profile (e.g. role updates)
    useEffect(() => {
        if (!currentUser?.id) return;

        const profileSubscription = supabase
            .channel(`public:profiles:id=eq.${currentUser.id}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "profiles",
                    filter: `id=eq.${currentUser.id}`,
                },
                (payload) => {
                    console.log("Profile updated in real-time:", payload);
                    if (payload.new && payload.new.role) {
                        setRole(payload.new.role);
                        setCurrentUser((prev) => ({ ...prev, ...payload.new }));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(profileSubscription);
        };
    }, [currentUser?.id]);

    const value = {
        currentUser,
        role,
        isLoading,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};
