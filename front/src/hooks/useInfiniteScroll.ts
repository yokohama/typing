import { useState, useEffect, useCallback, useRef } from 'react';

export function useInfiniteScroll<T>(
  allItems: T[],
  initialItemsCount: number = 20,
  loadMoreCount: number = 10
) {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  // 初期アイテムをロード
  useEffect(() => {
    setVisibleItems(allItems.slice(0, initialItemsCount));
    setHasMore(allItems.length > initialItemsCount);
  }, [allItems, initialItemsCount]);

  // アイテムをもっと読み込む
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    // 読み込みの遅延をシミュレート
    setTimeout(() => {
      const nextItems = allItems.slice(visibleItems.length, visibleItems.length + loadMoreCount);
      setVisibleItems(prev => [...prev, ...nextItems]);
      setHasMore(visibleItems.length + nextItems.length < allItems.length);
      setLoading(false);
    }, 300);
  }, [allItems, visibleItems.length, hasMore, loading, loadMoreCount]);

  // 最後の要素に対するコールバックレフ
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  return { visibleItems, hasMore, loading, loadMore, lastElementRef };
}

export default useInfiniteScroll;
