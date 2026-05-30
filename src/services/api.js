import { API_BASE } from '../constants/theme';

const decodeHTML = (html) => {
  if (!html) return '';
  return html
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/<[^>]*>/g, '');
};

const extractImages = (post) => {
  const urls = [];
  const seen = new Set();
  const add = (url) => { if (url && !seen.has(url)) { seen.add(url); urls.push(url); } };

  if (post._embedded && post._embedded['wp:featuredmedia']) {
    const media = post._embedded['wp:featuredmedia'][0];
    if (media) {
      const sizes = media.media_details?.sizes || {};
      if (sizes.medium_large) add(sizes.medium_large.source_url);
      if (sizes.medium) add(sizes.medium.source_url);
      if (sizes.large) add(sizes.large.source_url);
      add(media.source_url);
    }
  }

  if (post.uagb_featured_image_src) {
    const sizes = post.uagb_featured_image_src;
    if (sizes['medium_large'] && sizes['medium_large'][0]) add(sizes['medium_large'][0]);
    if (sizes.medium && sizes.medium[0]) add(sizes.medium[0]);
    if (sizes.large && sizes.large[0]) add(sizes.large[0]);
    if (sizes.full && sizes.full[0]) add(sizes.full[0]);
  }

  return urls;
};

const formatPost = (post) => {
  const imgs = extractImages(post);
  return {
    id: post.id,
    title: decodeHTML(post.title?.rendered || ''),
    excerpt: decodeHTML(post.excerpt?.rendered || ''),
    content: post.content?.rendered || '',
    date: post.date,
    image: imgs[0] || null,
    imageUrls: imgs,
    link: post.link,
    categories: post.categories || [],
    author: post.uagb_author_info?.display_name || 'RBI',
    views: post.post_views_count || 0,
  };
};

export const fetchPosts = async (page = 1, perPage = 10, categoryId = null, search = null) => {
  let url = `${API_BASE}/posts?page=${page}&per_page=${perPage}&_embed`;
  if (categoryId) url += `&categories=${categoryId}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);
  const total = parseInt(response.headers.get('X-WP-Total') || '0', 10);
  const posts = await response.json();

  return {
    posts: posts.map(formatPost),
    totalPages,
    total,
  };
};

export const fetchPost = async (id) => {
  const response = await fetch(`${API_BASE}/posts/${id}?_embed`);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const post = await response.json();
  return formatPost(post);
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE}/categories?per_page=50`);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
};

export const searchPosts = async (query, page = 1) => {
  return fetchPosts(page, 10, null, query);
};
