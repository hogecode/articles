import React, { useState, useMemo } from 'react';

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
		<div className="w-full max-w-6xl mx-auto px-4 py-8">
			{/* フィルターセクション */}
			<div className="mb-8 p-6 bg-gray-50 rounded-lg">
				<div className="mb-6">
					<h3 className="text-lg font-semibold mb-3">カテゴリー</h3>
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => handleCategoryChange(null)}
							className={`px-4 py-2 rounded-full text-sm font-medium transition ${
								selectedCategory === null
									? 'bg-blue-600 text-white'
									: 'bg-white border border-gray-300 text-gray-700 hover:border-blue-400'
							}`}
						>
							すべて
						</button>
						{allCategories.map((category) => (
							<button
								key={category}
								onClick={() => handleCategoryChange(category)}
								className={`px-4 py-2 rounded-full text-sm font-medium transition ${
									selectedCategory === category
										? 'bg-blue-600 text-white'
										: 'bg-white border border-gray-300 text-gray-700 hover:border-blue-400'
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>

				<div>
					<h3 className="text-lg font-semibold mb-3">タグ</h3>
					<div className="flex flex-wrap gap-2">
						{allTags.map((tag) => (
							<button
								key={tag}
								onClick={() => toggleTag(tag)}
								className={`px-4 py-2 rounded-full text-sm font-medium transition ${
									selectedTags.has(tag)
										? 'bg-green-600 text-white'
										: 'bg-white border border-gray-300 text-gray-700 hover:border-green-400'
								}`}
							>
								{tag}
							</button>
						))}
					</div>
				</div>

				{(selectedTags.size > 0 || selectedCategory) && (
					<button
						onClick={clearFilters}
						className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
					>
						フィルターをクリア
					</button>
				)}
			</div>

			{/* 記事数表示 */}
			<div className="mb-4 text-gray-600">
				{filteredPosts.length} 件の記事が見つかりました
			</div>

			{/* 記事リスト */}
			{paginatedPosts.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					{paginatedPosts.map((post) => (
						<article key={post.id} className="group border rounded-lg overflow-hidden hover:shadow-lg transition">
							<a href={`/articles/blog/${post.id}/`} className="block h-full">
								<div className="p-6">
									<h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">
										{post.data.title}
									</h3>
									<p className="text-gray-600 text-sm mb-4">{post.data.description}</p>

									{/* メタ情報 */}
									<div className="flex flex-wrap gap-2 mb-4">
										{post.data.category && (
											<span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
												{post.data.category}
											</span>
										)}
										{post.data.tags?.map((tag) => (
											<span
												key={tag}
												className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full"
											>
												{tag}
											</span>
										))}
									</div>

									<p className="text-gray-400 text-sm">
										{new Date(post.data.pubDate).toLocaleDateString('ja-JP')}
									</p>
								</div>
							</a>
						</article>
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<p className="text-gray-500 text-lg">該当する記事がありません</p>
				</div>
			)}

			{/* ページネーション */}
			{totalPages > 1 && (
				<div className="flex justify-center items-center gap-2 mt-8">
					<button
						onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
						disabled={currentPage === 1}
						className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
					>
						前へ
					</button>

					<div className="flex gap-1">
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<button
								key={page}
								onClick={() => setCurrentPage(page)}
								className={`px-3 py-2 rounded-lg text-sm transition ${
									page === currentPage
										? 'bg-blue-600 text-white'
										: 'border hover:bg-gray-100'
								}`}
							>
								{page}
							</button>
						))}
					</div>

					<button
						onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
						disabled={currentPage === totalPages}
						className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
					>
						次へ
					</button>
				</div>
			)}
		</div>
	);
}
