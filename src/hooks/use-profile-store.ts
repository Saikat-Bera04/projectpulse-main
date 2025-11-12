
"use client";

import { useState, useEffect } from 'react';

type Profile = {
  name: string;
  email: string;
  linkedin: string;
  github: string;
  avatarId: string;
  tags: string[];
};

const defaultProfile: Profile = {
  name: "Alex Durden",
  email: "alex.durden@example.com",
  linkedin: "https://linkedin.com/in/alexdurden",
  github: "https://github.com/alexdurden",
  avatarId: "avatar1",
  tags: ['frontend developer', 'UI/UX designer', 'docker', 'AI engineer', 'react', 'next.js'],
};

const profileKey = 'userProfile';

export const useProfileStore = () => {
  const [profile, setProfileState] = useState<Profile>(defaultProfile);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    // This prevents a hydration mismatch.
    try {
      const item = window.localStorage.getItem(profileKey);
      if (item) {
        setProfileState(JSON.parse(item));
      }
    } catch (error) {
      console.error("Error reading from localStorage during hydration", error);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        window.localStorage.setItem(profileKey, JSON.stringify(profile));
      } catch (error) {
        console.error("Error writing to localStorage", error);
      }
    }
  }, [profile, isInitialized]);

  const setProfile = (newProfile: Partial<Profile>) => {
    setProfileState(prev => ({ ...prev, ...newProfile }));
  };

  // Return the default profile until the client-side has initialized
  // to ensure server and client render the same initial UI.
  return { profile: isInitialized ? profile : defaultProfile, setProfile };
};
