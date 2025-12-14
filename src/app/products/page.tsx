"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminRole } from '@/lib/constants/roles';
import { useProducts } from '@/lib/hooks/useProducts';

export default function ProductsPage() {
	const router = useRouter();
	const { data: products = [], isLoading, isError } = useProducts();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [initials] = useState(() => {
		const first = typeof window !== 'undefined' ? localStorage.getItem('firstName') || '' : '';
		const last = typeof window !== 'undefined' ? localStorage.getItem('lastName') || '' : '';
		return (((first[0] || '') + (last[0] || '')).toUpperCase() || 'U');
	});
	const [isAdmin] = useState(() => {
		const roleId = typeof window !== 'undefined' ? localStorage.getItem('roleId') : null;
		return isAdminRole(roleId);
	});
	const menuRef = useRef<HTMLDivElement | null>(null);

	const handleLogout = () => {
		try {
			localStorage.clear();
		} catch (e) {
		}
		router.push('/login');
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setIsMenuOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isMenuOpen]);

	if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading products...</div>;
	if (isError) return <div className="p-8 text-center text-red-600">Failed to load products.</div>;

	return (
		<div className="min-h-screen bg-background">
			{/* Header with avatar */}
			<header className="bg-white border-b border-border shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<h1 className="text-2xl font-bold text-foreground">Products</h1>
						<div className="flex items-center gap-4 relative" ref={menuRef}>
							<button
								onClick={() => setIsMenuOpen((s) => !s)}
								aria-haspopup="true"
								aria-expanded={isMenuOpen}
								className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold shadow"
								title="User menu"
							>
								{initials}
							</button>

							{isMenuOpen && (
								<div className="absolute top-full right-0 mt-2 w-44 bg-white border border-border rounded-md shadow-lg z-50 overflow-hidden">
									{isAdmin && (
										<button
											onClick={() => {
												setIsMenuOpen(false);
                                                router.push('/admin');
											}}
											className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
										>
											Admin BackOffice
										</button>
									)}
									<button
										onClick={() => {
											setIsMenuOpen(false);
											handleLogout();
										}}
										className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-red-100"
									>
										Logout
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{products.length === 0 ? (
					<div className="p-8 text-center text-muted-foreground">No products found</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{products.map((product) => (
							<div key={product.id} className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
								{product.image_url && (
									<div className="aspect-video bg-muted overflow-hidden">
										<img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
									</div>
								)}
								<div className="p-4">
									<h3 className="text-lg font-semibold text-foreground mb-2">{product.name}</h3>
									<p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
									<div className="flex items-center justify-between">
										<span className="text-xl font-bold text-primary">Rs. {parseFloat(product.price).toFixed(2)}</span>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</main>
		</div>
	);
}

