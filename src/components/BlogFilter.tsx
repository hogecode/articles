'use client';

import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Post {
	id: string;
	data: {
		title: string;
		description: string;
		pubDate: Date;
		tags?: string[];
		category?: string;
	};
}

interface BlogFilterProps {
	posts: Post[];
	postsPerPage?: number;
}

const POSTS_PER_PAGE = 6;

export default function BlogFilter({ posts, postsPerPage = POSTS_PER_PAGE }: BlogFilterProps) {
	const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	// 全タグとカテゴリーを取得
	const allTags = useMemo(() => {
		const tags = new Set<string>();
		posts.forEach((post) => {
			post.data.tags?.forEach((tag) => tags.add(tag));
		});
		return Array.from(tags).sort();
	}, [posts]);

	const allCategories = useMemo(() => {
		const categories = new Set<string>();
		posts.forEach((post) => {
			if (post.data.category) categories.add(post.data.category);
		});
		return Array.from(categories).sort();
	}, [posts]);

	// フィルタリング
	const filteredPosts = useMemo(() => {
		return posts.filter((post) => {
			const hasSelectedTags = selectedTags.size === 0 || post.data.tags?.some((tag) => selectedTags.has(tag));
			const hasSelectedCategory = !selectedCategory || post.data.category === selectedCategory;
			return hasSelectedTags && hasSelectedCategory;
		});
	}, [posts, selectedTags, selectedCategory]);

	// ページネーション
	const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
	const paginatedPosts = filteredPosts.slice(
		(currentPage - 1) * postsPerPage,
		currentPage * postsPerPage
	);

	const toggleTag = (tag: string) => {
		const newTags = new Set(selectedTags);
		if (newTags.has(tag)) {
			newTags.delete(tag);
		} else {
			newTags.add(tag);
		}
		setSelectedTags(newTags);
		setCurrentPage(1);
	};

	const handleCategoryChange = (category: string | null) => {
		setSelectedCategory(category);
		setCurrentPage(1);
	};

	const clearFilters = () => {
		setSelectedTags(new Set());
		setSelectedCategory(null);
		setCurrentPage(1);
	};

	return (
		<div className="w-full max-w-6xl mx-auto mt-8">
			{/* フィルターセクション */}
			<div className="mb-8 p-6 bg-muted rounded-lg border">
				<div className="mb-6">
					<h5 className="text-xs font-semibold mb-3">カテゴリー</h5>
					<div className="flex flex-wrap gap-2">
						<Button
							onClick={() => handleCategoryChange(null)}
							variant={selectedCategory !== null ? 'default' : 'outline'}
							size="sm"
						>
							すべて
						</Button>
						{allCategories.map((category) => (
							<Button
								key={category}
								onClick={() => handleCategoryChange(category)}
								variant={selectedCategory !== category ? 'default' : 'outline'}
								size="sm"
							>
								{category}
							</Button>
						))}
					</div>
				</div>		

				<div>
					<h5 className="text-xs font-semibold mb-3">タグ</h5>
					<div className="flex flex-wrap gap-2">
						{allTags.map((tag) => (
							<Badge
								key={tag}
								onClick={() => toggleTag(tag)}
								variant={selectedTags.has(tag) ? 'outline' : 'default'}
								className="cursor-pointer"
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										toggleTag(tag);
									}
								}}
							>
								{tag}
							</Badge>
						))}
					</div>
				</div>

				{(selectedTags.size > 0 || selectedCategory) && (
					<Button
						onClick={clearFilters}
						variant="destructive"
						size="sm"
						className="mt-4"
					>
						フィルターをクリア
					</Button>
				)}
			</div>

			{/* 記事数表示 */}
			<div className="mb-4 text-sm text-muted-foreground">
				{filteredPosts.length} 件の記事が見つかりました
			</div>

			{/* 記事リスト */}
			{paginatedPosts.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					{paginatedPosts.map((post) => (
						<article key={post.id} className="group border rounded-lg overflow-hidden hover:shadow-md transition">
							<a href={`/articles/blog/${post.id}/`} className="block h-full">
								<div className="p-6">
									<h5 className="text-xl font-bold mb-2 group-hover:text-primary transition">
										{post.data.title}
									</h5>
									<p className="text-muted-foreground text-sm mb-4">{post.data.description}</p>

									{/* メタ情報 */}
									<div className="flex flex-wrap gap-2 mb-4">
										{post.data.category && (
											<Badge variant="secondary" className="text-xs">
												{post.data.category}
											</Badge>
										)}
										{post.data.tags?.map((tag) => (
											<Badge key={tag} variant="outline" className="text-xs">
												{tag}
											</Badge>
										))}
									</div>

									<p className="text-muted-foreground text-xs">
										{new Date(post.data.pubDate).toLocaleDateString('ja-JP')}
									</p>
								</div>
							</a>
						</article>
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<p className="text-muted-foreground text-lg">該当する記事がありません</p>
				</div>
			)}

			{/* ページネーション */}
			{totalPages > 1 && (
				<div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
					<Button
						onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
						disabled={currentPage === 1}
						variant="outline"
						size="sm"
					>
						前へ
					</Button>

					<div className="flex gap-1">
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<Button
								key={page}
								onClick={() => setCurrentPage(page)}
								variant={page !== currentPage ? 'default' : 'outline'}
								size="sm"
								className="min-w-8"
							>
								{page}
							</Button>
						))}
					</div>

					<Button
						onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
						disabled={currentPage === totalPages}
						variant="outline"
						size="sm"
					>
						次へ
					</Button>
				</div>
			)}
		</div>
	);
}
