'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UserStatsForm() {
  const [address, setAddress] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address) {
      router.push(`/user/${address}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter your Bitcoin address"
        className="flex-grow bg-gray-700 border-gray-600 text-white"
      />
      <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
        Go
      </Button>
    </form>
  );
}